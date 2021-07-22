const db = require('../config/db')

module.exports = {
 
    create({filename, path}) {
        //inserir dados no banco de dados
        const query = `
         INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
         RETURNING id
         `
        const values = [
            filename,
            path
        ]
        return db.query(query, values)
    },
    createRecipeFiles(idRecipe, idFile) {
        const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        RETURNING id
        `
        const values = [
            idRecipe,              
            idFile      
        ]
        return db.query(query, values)
    },

}