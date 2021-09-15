const db = require('../../config/db')

module.exports = {

    async all() {
      const results = await db.query(`
        SELECT recipes.*, chefs.name, files.path
        FROM recipes
        INNER JOIN recipe_files ON (recipe_files.recipe_id = recipes.id) 
        INNER JOIN files ON (recipe_files.file_id = files.id)
        INNER JOIN chefs ON (recipes.chef_id = chefs.id)`,
        )   
      return results.rows 
    },

   async find(id) {
       const results = await db.query(`
            SELECT * FROM recipes
            INNER JOIN recipe_files ON (recipe_files.recipe_id = recipes.id) 
            INNER JOIN files ON (recipe_files.file_id = files.id)
            WHERE recipes.id = $1`, [id])
            return results.rows[0]
    }, 

    findAllByTitle(filter,callback) {
        db.query(`
        SELECT r.*, c.name FROM recipes r
        INNER JOIN chefs c
        ON c.id = r.chef_id	
        WHERE r.title ILIKE '%${filter}%'`, function(err, results) {
                if(err) throw `Database Erro! ${err}`
    
                callback(results.rows)
            })
    },

   async paginate(params) {
        const { filter, limit, offset} = params // destruturando do params

        let query = `
        SELECT recipes.*,chefs.name,files.path, (SELECT COUNT (re.id) FROM recipes re) AS totaPages FROM recipes
        INNER JOIN chefs ON (recipes.chef_id = chefs.id) 
        INNER JOIN recipe_files ON (recipe_files.recipe_id = recipes.id) 
        INNER JOIN files ON (recipe_files.file_id = files.id) 
                
        `
        if ( filter ) {
            query = `%${query}%
            WHERE recipes.title ILIKE '%${filter}%' 
            `        
        }
            query = `${query} 
            ORDER BY recipes.title ASC
            LIMIT $1 OFFSET $2`
        
        const results = await db.query(query, [limit, offset])
        return results.rows
    },
    
    findOneByChef(id_chef){
        return  db.query(`
              SELECT * FROM recipes 
              WHERE recipes.chef_id = $1`,[id_chef])
  
      },

}