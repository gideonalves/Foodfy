const db = require('../../config/db')

const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");


module.exports = {
    list() {
      return db.query(`
          SELECT * FROM users`,
      )
    },

    find(id) {
      return db.query(`SELECT * FROM users WHERE id = $1`, [id])
    },

    async findOne(filters) {
      let query = "SELECT * FROM users"
  
      Object.keys(filters).map(key => {
        // WHERE | OR | AND
        query = `${query}
            ${key}
            `
  
        Object.keys(filters[key]).map(field => {
          query = `${query} ${field} = '${filters[key][field]}'`
        })
      })
      const results = await db.query(query)
      return results.rows[0]
    },

    async create(data, password) {
      try {
        const query = `
          INSERT INTO users (
            name,
            email,
            password,
            is_admin
          ) VALUES ($1, $2, $3, $4)
          RETURNING id
        `
        const passwordHash = await hash(password, 8)
  
        const values = [data.name, data.email, passwordHash, data.is_admin]
  
        let results = await db.query(query, values)
  
        return results.rows[0].id
      } catch (err) {
        console.error(err)
      }
    },
  
    async update(id, fields) {
      let query = "UPDATE users SET"

      Object.keys(fields).map((key, index, array) => {
          if((index + 1) < array.length) {
              query = `${query}
                  ${key} = '${fields[key]}',
              `
          } else {
              //last iteration
              query = `${query}
                  ${key} = '${fields[key]}'
                  WHERE id = ${id}
              `
          }
      })

      await db.query(query)
      return
    },

    adminUpdate(data) {
      try {
        const query = `
          UPDATE users SET
            name=($1),
            email=($2),
            is_admin=($3)
          WHERE id = $4  
        `

        const values = [data.name, data.email, data.is_admin, data.id]

        return db.query(query, values)
      } catch (err) {
        console.error(err)
      }
    },

}