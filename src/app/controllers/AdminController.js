const RecipesAdmin = require('../../models/RecipesAdmin')

module.exports = {

    async indexRecipe(req, res) {
       const results = await RecipesAdmin.all() 
       const recipes = results.rows
       return res.render("admin/recipes/indexRecipe", { recipes })        
    },

    async createRecipe(req, res) {
        const chefOptions = await RecipesAdmin.chefSelectOptions();
        // console.log(chefOptions)
        return res.render('admin/recipes/createRecipe', { chefOptions: chefOptions.rows });
        
    },  
  
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos!')
            }
        }
        
        const { rows } = await RecipesAdmin.create(req.body)
        const recipe = rows[0]
            return res.redirect(`/admin/recipes/${recipe.id}`)
    },

    async showRecipe(req, res) {
        const results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        if (!recipes) return res.send("Recipes not found!")

        return res.render("admin/recipes/showRecipe", { items: recipes })
    },

    async editRecipe(req, res) {
        let results = await RecipesAdmin.find(req.params.id)
        const recipes = results.rows[0]

        if (!recipes) return res.send("Recipes not found!")         

        const chefOptions = await RecipesAdmin.chefSelectOptions();

        return res.render("admin/recipes/editRecipe", { items: recipes, chefOptions: chefOptions.rows })
       
    },

    async put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
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
















