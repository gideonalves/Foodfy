const RecipesAdmin = require('../../models/RecipesAdmin')
const { options } = require('../../routes')

module.exports = {
    indexRecipe(req, res) {
        RecipesAdmin.all(function (recipes) {
            return res.render("admin/recipes/indexRecipe", { recipes })
        })
    },

    createRecipe(req, res) {
        RecipesAdmin.chefSelectOptions(function (options) {
            return res.render("admin/recipes/createRecipe", { chefOptions: options })
        })
    },
  
    // Criar
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos!')
            }
        }
        // Criar os Recipes
        let results = await RecipesAdmin.create(req.body)
        const recipe = results.rows[0]
        // redireciona para a pagina show
        return res.redirect(`/admin/recipes/${recipe.id}`)
    },   

    // Show
    async showRecipe(req, res) {
        const results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        if (!recipes) return res.send("Recipes not found!")

        return res.render("admin/recipes/showRecipe", { items: recipes })
    },

    
    async editRecipe(req, res) {
        let results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]
            if (!recipes) return res.send("Recipes não encontrado!")

        results = await RecipesAdmin.chefSelectOptions() 
        const options = results.rows

        return res.render("admin/recipes/editRecipe", { items: recipes, chefOptions: options })          
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        console.log(req.body);
        req.body.ingredients = req.body.ingredients.filter(function (item) {
             return item != ""        
        })         

        await RecipesAdmin.updade(req.body)
        return res.redirect(`/admin/recipes/${req.body.id}`)
    },

    async delete(req, res) {
        await RecipesAdmin.delete(req.body.id)
        return res.redirect(`/admin/recipes`)
    },

}