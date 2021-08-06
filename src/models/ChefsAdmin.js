const db = require('../config/db')

module.exports = {
    // INDEX
    all() {
        return db.query(`
        SELECT chefs.id, chefs.name, files.name AS file_name, files.path 
        FROM chefs
        INNER JOIN files 
        ON files.id = chefs.file_id `
        )
    },

    findChef(id) {
        try {
            return db.query(`
            SELECT * FROM chefs 
            WHERE id = $1`,
                [id]
            )

        } catch (error) {
            console.error(error)
        }
    },

    async findAllChefsCountRecipes() {
        const results = await db.query(`
        SELECT c.id, c.name,count(r.id) AS total_recipes,c.file_id, files.path
        FROM chefs c
        INNER JOIN files ON (files.id = c.file_id)
        INNER JOIN recipes r
        ON c.id = r.chef_id
        GROUP BY c.id,c.name,c.file_id, files.id 
        ORDER BY c.name ASC
        ` )
        return results.rows
    },

    // POST
    create(data) {
        //inserir dados no banco de dados
        const query = `
         INSERT INTO chefs (
            name,
            file_id,
            created_at            
        ) VALUES ($1, $2, $3)
        RETURNING id
    `
        const values = [
            data.name,
            data.file_id,
            new Date()
        ]

        return db.query(query, values)
    },
    // show
    find(id) {
        try {
            return db.query(`
            SELECT chefs.id,chefs.name AS name_chef,files.path,files.name,
            count(recipes.chef_id) AS totalRecipes FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            INNER JOIN files ON (files.id = chefs.file_id)      
            WHERE chefs.id = $1
            GROUP BY chefs.id,files.id`, [id]
            )

        } catch (error) {
            console.error(error)
        }

    },

    findRecipes(id) {
        try {
            return db.query(`
            SELECT r.*, files.path, c.name FROM chefs as c 
            LEFT JOIN  recipes as r 
            INNER JOIN recipe_files as rf
            ON r.id = rf.recipe_id
            INNER JOIN files 
            ON files.id = rf.file_id 
            ON c.id = r.chef_id
            WHERE c.id = $1  
            `, [id]
            )
        } catch (error) {
            console.error(error)
        }

    },
    // Edit
    findById(id, callback) {
        db.query(`
        SELECT chefs.*,
        count(*) AS totalRecipes FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`, [id], function (err, results) {
            if (err) return res.send("Database Erro!")

            callback(results.rows[0])
        })
    },

    updade(data) {
        const query = `
        UPDATE chefs SET
        name=($1),
        file_id=($2)
        WHERE id = $3
        `
        const values = [
            data.name,
            data.file_id,
            data.id
        ]
        return db.query(query, values)
    },

    findOneByChef(id_chef) {
        return db.query(`
        select * from chefs where id = $1`, [id_chef])

    },

    delete(id) {
        try {
            return db.query(`DELETE FROM chefs WHERE id = $1`, [id])

        } catch (error) {
            throw error
        }
    },



}


