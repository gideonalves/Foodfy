const RecipesAdmin = require('../../models/RecipesAdmin')
const Files = require('../../models/Files') // Pega os files do model

module.exports = {
    // Index
    async indexRecipe(req, res) {

        // Pega os recipes   
        let results = (await RecipesAdmin.all()).rows

        const files = results.map(async recipe => ({
            ...recipe,
            file: (await Files.findFileIDRecipeId(recipe.id)).rows
        }))
        const filesPromisse = await Promise.all(files)

        const recipes = filesPromisse.map(item => ({
            ...item,
            file: `${req.protocol}://${req.headers.host}${item.file[0].path.replace("public\\images\\", "\\\\images\\\\")}`,
        }))

        return res.render("admin/recipes/indexRecipe", { recipes })
    },
    // CreateRecipe
    async createRecipe(req, res) {
        const chefOptions = await RecipesAdmin.chefSelectOptions();
        return res.render('admin/recipes/createRecipe', { chefOptions: chefOptions.rows });
    },
    // Post
    async post(req, res) {
        try {
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "") {
                    return res.send(`O campo ${key} esta em branco!`)
                }
            }

            // verifica se tem files
            if (req.files.length == 0)
                return res.send('Por favor envie pelo menos uma imagem')

            // Envia as recipes
            let result = await RecipesAdmin.create(req.body)
            const recipeId = result.rows[0].id

            // envia os files            
            const filesIds = await Promise.all(req.files.map(file => Files.create({ ...file })))

            for (const id of filesIds) {
                await Files.createRecipeFiles({ recipe_id: recipeId, file_id: id })
            }

            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (err) {
            console.error(err)
        }
    },
    // ShowRecipe
    async showRecipe(req, res) {
        let results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        if (!recipes) return res.send("Recipes not found!")

        // Vai fazer a galeria de imagem
        results = await Files.files(recipes.id)

        const files = results.rows.map(file => ({
            ...file,                    // replace faz tira o plublic e deixa vazio                  
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))
        // console.log(files)

        return res.render("admin/recipes/showRecipe", { items: recipes, files })
    },
    // EditRecipe
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
        // return res.send(files)
        // console.log(files)
        return res.render("admin/recipes/editRecipe", { items: recipes, chefOptions: chefOptions.rows, files })
    },
    // Put    
    async put(req, res) {
        const keys = Object.keys(req.body)
        // return res.send({body:req.body,file:req.files})
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files") {
                return res.send('Please, fill all fields!')
            }
        }

        // remove as images
        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => {
                Files.deleteRecipeFiles(id)
                Files.delete(id)
            })

            await Promise.all(removedFilesPromise)
        }
        
        if (req.files.length != 0) {

            // validar se ja não existem 5 imagens no total
            const oldFiles = await Files.files(req.body.id)
            const totalFiles = oldFiles.rows.length + req.files.length

            if(totalFiles <= 5) {
                const newFilesPromise = req.files.map(file =>
                    Files.create({ ...file, file_id: req.body.id }))
    
                const idFiles = await Promise.all(newFilesPromise)
    
                const fileRecipes = idFiles.map(id => Files.createRecipeFiles({
                    recipe_id: req.body.id,
                    file_id: id
                }))
    
                const idFilesRecipes = await Promise.all(fileRecipes)                
            }           
        }

        req.body.ingredients = req.body.ingredients.filter(function (item) {
            return item != ""
        })


        await RecipesAdmin.updade(req.body)
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },


    // Delete
    async delete(req, res) {
        const results = (await Files.findFileIDRecipeId(req.body.id)).rows

        const idFiles = results.map(async file => {

            Files.deleteRecipeFiles(file.file_id)
            Files.delete(file.file_id)

        })
        await Promise.all(idFiles)
        await RecipesAdmin.delete(req.body.id)
        return res.redirect(`/admin/recipes`)
    },

}


















