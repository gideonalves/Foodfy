const ChefsAdmin = require('../../models/ChefsAdmin')
const Recipes = require('../../models/Recipes')

module.exports = {

    async indexChef(req, res) {
       const results = await ChefsAdmin.all()
       const chefs = results.rows
            return res.render("admin/chefs/indexChef", { chefs })        
    },

    createChef(req, res) {
        return res.render("admin/chefs/createChef")
    },

    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos!')
            }
        }

        const result = await ChefsAdmin.create(req.body)
        const chef = result.rows[0]
       
            return res.redirect(`/admin/chefs/${chef.id}`)        
    },

    async showChef(req, res) {

           let results = await ChefsAdmin.find(req.params.id) 
           const chef = results.rows[0] 
                if (!chef) return res.send("Chefe não encontrado!")

           results = await ChefsAdmin.findRecipes(req.params.id) 
           const recipes = results.rows
                if (!recipes) return res.send("Recipes não encontrado!")

                res.render("admin/chefs/showChef", { chef, recipes })          
        
    },

   async editChef(req, res) {
       const result = await ChefsAdmin.find(req.params.id)
       const chef = result.rows[0] 
            if (!chef) return res.send("Chef not found!")

            return res.render("admin/chefs/editChef", { chef })        
   },

    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }

       const result = await ChefsAdmin.updade(req.body)
       const chef = result.rows[0]
            return res.redirect(`/admin/chefs/${req.body.id}`)
        
    },    

    delete(req, res) {
            
        Recipes.findOneByChef(req.body.id, recipes => {

            ChefsAdmin.delete(req.body.id, function () {
                ChefsAdmin.all(function (chefs) {
                    return res.render("admin/chefs/indexChef", { chefs })
                })
            })
        })
    }
    
}
















