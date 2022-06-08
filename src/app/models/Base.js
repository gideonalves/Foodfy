const db = require('../../config/db')

function find(filters, table) {
    let query = `SELECT * FROM ${table}`;

    if (filters) {
        Object.keys(filters).map((key) => {
            //WHERE | OR | AND
            query += ` ${key}`;

            Object.keys(filters[key]).map((field) => {
                query += ` ${field} = '${filters[key][field]}'`;
            });
        });
    }

    return db.query(query);
}

const Base = {
    init({ table }) {
        if (!table) throw new Error('Invalid Paramas')

        this.table = table
    },
    async findOne(filters) {
        let query = `SELECT * FROM ${this.table}`;

        Object.keys(filters).map(key => {
            query += ` ${key}`;

            Object.keys(filters[key]).map(field => {
                query += ` ${field} = '${filters[key][field]}'`
            });
        });

        const results = await db.query(query);
        return results.rows[0];
    },
    async create(fields) {
        try {
            let keys = [], values = [];

            Object.keys(fields).map(key => {
                keys.push(key);

                Array.isArray(fields[key])
                    ? values.push(`'{"${fields[key].join('","')}"}'`)
                    : values.push(`'${fields[key]}'`);
            });

            const query = `
                INSERT INTO ${this.table}
                (${keys.join(',')})
                VALUES(${values.join(',')})
                RETURNING id
            `;

            const results = await db.query(query);
            return results.rows[0].id;
        } catch (err) {
            console.error(err);
        }
    },
    async find(id) {
        const results = await find({ where: { id } }, this.table);
        return results.rows[0];
    },
    async findAll(filters) {
        const results = await find(filters, this.table);
        return results.rows;
    },
    async update(id, fields) {
        try {
            let update = []
            Object.keys(fields).map(key => {
                let line;

                Array.isArray(fields[key])
                    ? line = `${key} = '{"${fields[key].join('","')}"}'`
                    : line = `${key} = '${fields[key]}'`;
                update.push(line);
            });

            const query = `
                UPDATE ${this.table} SET
                ${update.join(',')}
                WHERE id = ${id}
            `;

            return db.query(query)

        } catch (error) {
            console.error(error)
        }
    },
    delete(field) {
        let exclude;

        Object.keys(field).map(key => {
            exclude = `${key} = '${field[key]}'`;
        });

        return db.query(`DELETE FROM ${this.table} WHERE ${exclude}`);
    }
}
module.exports = Base