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
  }

}