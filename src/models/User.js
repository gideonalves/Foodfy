const db = require('../config/db')

module.exports = {
    list() {
      return db.query(`
          SELECT * FROM users`,
      )
    },
}    