const RecipesAdmin = require('../../models/RecipesAdmin')
const Files = require('../../models/Files') // Pega os files do model

module.exports = {

    async indexRecipe(req, res) {

        // Pega os recipes   
        let results =  (await RecipesAdmin.all()).rows            
                
        const files = results.map(async recipe =>({
                        ...recipe,
                        file: (await Files.findFileIDRecipeId(recipe.id)).rows})) 
        const filesPromisse = await Promise.all(files)       

        const recipes = filesPromisse.map(item => ({
             ...item,                    
            file:`${req.protocol}://${req.headers.host}${item.file[0].path.replace("public\\images\\", "\\\\images\\\\")}`,                   
        }))
        // return res.send(recipes)
        return res.render("admin/recipes/indexRecipe", { recipes }) 
    },

    async createRecipe(req, res) {
        const chefOptions = await RecipesAdmin.chefSelectOptions();
        // console.log(chefOptions)
        return res.render('admin/recipes/createRecipe', { chefOptions: chefOptions.rows });
        
    },  
    async post(req, res) {
    //return res.send({body: req.body, file: req.files}) ///debugar req.body
        try {
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send(`O campo ${key} esta em branco!`)
                }
            }
            // return res.send(keys) esta validando os campos

            // verifica se tem files
            if (req.files.length == 0)            
                return res.send('Por favor envie pelo menos uma imagem')  

            // Envia as recipes
            let result = await RecipesAdmin.create(req.body)
            const recipeId = result.rows[0].id
            //return res.send({result:result.rows[0], recipeId})
            
           // envia os files
            
            const filesIds = await Promise.all(req.files.map(file => Files.create({...file})))

            for (const id of filesIds) {
                await Files.createRecipeFiles({recipe_id: recipeId, file_id: id})
            }           

           // return res.send({filesIds,recipeId})
           
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (err) {
            console.error(err)
        }
    },
  
    async showRecipe(req, res) {
        let results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        // Vai fazer a galeria de imagem
        results = await Files.files(recipes.id) // pega as imagem do banco da tabela files pelo product.id
        const files = results.rows.map(file => ({
            ...file,                    // replace faz tira o plublic e deixa vazio                  
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))

        if (!recipes) return res.send("Recipes not found!")         

        return res.render("admin/recipes/showRecipe", { items: recipes, files })
    },

    async editRecipe(req, res) {
        // Pega os recipes
        let results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        if (!recipes) return res.send("Recipes not found!")         
        // Pega os chefOptions
        const chefOptions = await RecipesAdmin.chefSelectOptions();

        // Pega os Files
        results = await Files.files(recipes.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace(
            "public", 
            ""
            )}` 
        }))

        return res.render("admin/recipes/editRecipe", { items: recipes, chefOptions: chefOptions.rows, files })       
    },

    async put(req, res) {
      
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file => 
                Files.create({...file, file_id: req.body.id}))

            await Promise.all(newFilesPromise)    
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)
    

         // const removedFilesPromise = removedFiles.map(id = Files.delete(id))
            const removedFilesPromise = removedFiles.map(id => Files.delete(id))

            await Promise.all(removedFilesPromise)
        }

        req.body.ingredients = req.body.ingredients.filter(function (item) {                      
            return item != ""

        })
       
        await RecipesAdmin.updade(req.body) 
        // return res.send(req.body)
            return res.redirect(`/admin/recipes/${req.body.id}`)
        
    },

    async delete(req, res) {
        await RecipesAdmin.delete(req.body.id)
            return res.redirect(`/admin/recipes`)     
    },

}


// put(req, res) {
//     // essa parte verifica se o formulario ta vazio -------------------
//     const keys = Object.keys(req.body)
//     // return res.send(keys)

//     for (key of keys) {
//         if (req.body[key] == "") {
//             return res.send('Please, fill all fields!')
//         }
//     }
//     // filtro do array ingredites para remover item vazio
//     req.body.ingredients = req.body.ingredients.filter(function (item) { // filter precisa retornar boolean se o boolean for verdadeiro ele mantem o item no array  se for false ele tira o item do array                     
//         // console.log(item != "")
//         return item != ""

//         // if(item == "") // aqui to falando que o item ta vazio
//         // {
//         //     return false // essa linha tira o item do arrey 
//         // }
//         // return true // essa linha mantem o item no arrey
//     })
//     // console.log(req.body.ingredients)
//     //-----------------------------------------------------------------
//     RecipesAdmin.updade(req.body, function () {
//         return res.redirect(`/admin/recipes/${req.body.id}`)
//     })
// },
















