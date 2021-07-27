const db = require('../config/db')
const {date} =  require('../lib/utils')

module.exports = {
    // index
    all() {
        return db.query(`
        SELECT recipes.id, recipes.title, chefs.name
        FROM recipes
        INNER JOIN chefs
        ON recipes.chef_id = chefs.id`)           
    }, 
    
    create(data) {
        //inserir dados no banco de dados
        const query = `
         INSERT INTO recipes (
             chef_id,
             title,
             ingredients,
             preparation,
             information,
             created_at
         ) VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id
         `
        const values = [
            data.chef_id,
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
        return db.query(`SELECT * FROM recipes WHERE id = $1`, [id])
    },

    updade(data) {

        const query = `
            UPDATE recipes SET
                chef_id=($1),
                title=($2),
                ingredients=($3),
                preparation=($4),
                information=($5),
                created_at=($6)
            WHERE id = $7
            `
        const values = [
            data.chef_id,
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
            WHERE id = $1`, [id]
        )
    },
    
    chefSelectOptions() {
       return db.query(`SELECT * FROM chefs`)
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