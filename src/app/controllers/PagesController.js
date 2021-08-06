const Recipes = require('../../models/Recipes')
const Chefs = require('../../models/ChefsAdmin')

module.exports = {
    async index(req, res) {
        // return res.send("Formulario vazio Preencha o formulario")        
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 3

        let offset = limit * (page - 1)

        const params = {
            filter,
            limit,
            offset,
        }
        const results = await Recipes.paginate(params)
        const recipes = results.map(recipe => ({
            ...recipe,
            image: `${req.protocol}://${req.headers.host}${recipe.path.replace(
                "public",
                ""
            )}`
        }))

        const pagination = {
            total: recipes.length > 0 ? Math.ceil(recipes[0].totapages / limit) : 0,
            page
        }
        return res.render("pages/index", { recipes, pagination, filter })
    },

    about(req, res) {
        return res.render("pages/about")
    },

    async recipe(req, res) {
        const result = await Recipes.find(req.params.id)
        const recipe = {
            ...result,
            image: `${req.protocol}://${req.headers.host}${result.path.replace(
                "public",
                ""
            )}`
        }

        if (!recipe) return res.send("Recipes not found!")
        return res.render("pages/recipe", { items: recipe })
    },

    recipes(req, res) {
        Recipes.all(function (recipes) {
            return res.render("pages/recipes", { items: recipes })
        })
    },

    pagesChefs(req, res) {
        Chefs.findAllChefsCountRecipes(chefs => {
            return res.render("pages/chefs", { chefs })
        })
    },

    filterRecipesByTitle(req, res) {
        const { filter } = req.query
        Recipes.findAllByTitle(filter, recipes => {

            return res.render("pages/filter", { recipes, filter })
        })
    }

}