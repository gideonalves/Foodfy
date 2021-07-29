const db = require('../config/db')
const fs = require('fs')

module.exports = {
    // Index pega o files da tabela recipe_id    
    findFileIDRecipeId(id) {
        return db.query(`
        SELECT * FROM files 
        INNER JOIN recipe_files
        ON files.id = recipe_files.file_id
        WHERE recipe_files.recipe_id = $1
        `,[id]
        )
      },

    //  post - create e o put
    async create(data) {
        //inserir dados no banco de dados
        try {
            const query = `
            INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
            RETURNING id
            `
            const values = [
                data.filename,
                data.path
            ]
            const results = await db.query(query, values)

            return results.rows[0].id
        } catch (err) {
            console.error(err)
        }
          
    },

    // post - create
    createRecipeFiles(data) {
        try {
            const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id
            `
            const values = [
                data.recipe_id,              
                data.file_id      
            ]
            return db.query(query, values)
        } catch (err) {
            console.error(err)
        }
    },

    //  showRecipe e editRecipe
    files(id) {
        return db.query(
          `
          SELECT files.*
          FROM files 
          LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
          LEFT JOIN recipes ON (recipes.id = recipe_files.recipe_id) 
          WHERE recipes.id = $1
        `,
          [id]
        )
    },
    // Put    
    async delete(id) {

        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]

            fs.unlinkSync(file.path)

         // DELETE FROM files WHERE id = $id
            return db.query(`
            DELETE FROM files WHERE id = $1

        `, [id])

        } catch (error) {
            console.err(err);
        }

      
    },
    async deleteRecipeFiles(id) {

        try {
           
         // DELETE FROM deleteRecipeFile WHERE id = $id
            return db.query(`
            DELETE FROM recipe_files WHERE file_id = $1

        `, [id])

        } catch (error) {
            console.err(err);
        }

      
    },

}