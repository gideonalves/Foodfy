const db = require('../config/db')
const {date} =  require('../lib/utils')

module.exports = { 
    // indexRecipe
    all(callback) {
        db.query(`
        SELECT recipes.id, recipes.title,chefs.name
        FROM recipes
        INNER JOIN chefs
        ON recipes.chef_id = chefs.id`,
            function (err, results) {
                if (err) throw `Database Erro! ${err}`

                callback(results.rows)
            })
    },

    // Criar    req.body        
    create(data) {
        //inserir dados no banco de dados
        const query = `
         INSERT INTO recipes (
             chef_id,
             image,
             title,
             ingredients,
             preparation,
             information,
             created_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id
         `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso
        ]

        return db.query(query, values)
    },

    // show
    find(id) {
        return db.query(`
            SELECT * FROM recipes
            WHERE id = $1`, [id])
    },

    updade(data) {
        const query = `
            UPDATE recipes SET
                chef_id=($1),
                image=($2),
                title=($3),
                ingredients=($4),
                preparation=($5),
                information=($6),
                created_at=($7)
            WHERE id = $8
            `
        const values = [
            data.chef_id,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.created_at,
            data.id
        ]
        return db.query(query, values)
    },

    delete(id) {
        return db.query(`
            DELETE FROM recipes 
            WHERE id = $1`, [id])
    },
      // createRecipe e editRecipe
    // chefSelectOptions() {        
    //     return db.query(`SELECT name, id FROM chefs`)
    // },
    chefSelectOptions(callback) {
        db.query(`
            SELECT * FROM chefs`,
            function (err, results) {
                if (err) throw `Database Erro! ${err}`

                callback(results.rows)
            }
        )
    },

    findByChef(id) {
        // try{
        return db.query(`
            SELECT * FROM recipes 
            WHERE chef_id = $1
                `, [id]
        )
        // } catch(error) {
        //     throw error
        // }
    }
}