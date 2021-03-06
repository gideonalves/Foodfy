const ChefsAdmin = require('../../models/ChefsAdmin')
const Recipes = require('../../models/Recipes')
const Files = require('../../models/Files') // Pega os files do model

module.exports = {

    async indexChef(req, res) {
        const results = (await ChefsAdmin.all()).rows
        const chefs = results.map(chef =>({
            ...chef,
            path: `${req.protocol}://${req.headers.host}${chef.path.replace(
                "public",
                ""
            )}`
        }))
        
        // return res.send(chefs)
        return res.render("admin/chefs/indexChef", { chefs })
    },

    createChef(req, res) {
        // res.send('teste')
        return res.render("admin/chefs/createChef")
    },

    async post(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Preencha todos os campos!')
            }
        }
        // verifica se tem files
        if (req.files.length == 0)
            return res.send('Por favor envie pelo menos uma imagem')



        const { filename, path } = req.files[0]

        const fileId = await Files.create({ filename, path })

        const chefData = {
            name: req.body.name,
            file_id: fileId
        }

        const result = await ChefsAdmin.create(chefData)
        const chef = result.rows[0]
        
        return res.redirect(`/admin/chefs/${chef.id}`)
    },

    async showChef(req, res) {
        // pega os chefs
        let results = await ChefsAdmin.find(req.params.id)
        const chefresult = results.rows[0]
        const chef = {
            ...chefresult,
            avatar_url: `${req.protocol}://${req.headers.host}${chefresult.path.replace("public", "")}`
        }
        
        if (!chef) return res.send("Chefe não encontrado!")
        // pega recipes
        results = (await ChefsAdmin.findRecipes(req.params.id)).rows        
        
        if (results[0].id === null) {           

           return res.render("admin/chefs/showChef", { chef })
        }else {
            const recipes = results.map(recipe =>({
                ...recipe,
                image: `${req.protocol}://${req.headers.host}${recipe.path.replace("public", "")}`
            }))
            
            if (!recipes) return res.send("Recipes não encontrado!")
            res.render("admin/chefs/showChef", { chef, recipes })
        }
    },

    async editChef(req, res) {
        let result = (await ChefsAdmin.find(req.params.id)).rows[0]
        const chef ={
             ...result,
             image: `${req.protocol}://${req.headers.host}${result.path.replace(
                "public\\images\\", "\\\\images\\\\"                 
            )}`
        }
        
        results = (await ChefsAdmin.findRecipes(req.params.id)).rows

        if (results[0].id === null) { 
            return res.render("admin/chefs/editChef", { chef })
        }else {
            const recipes = results.map(recipe =>({
                ...recipe,
                image: `${req.protocol}://${req.headers.host}${recipe.path.replace(
                    "public\\images\\", "\\\\images\\\\"                 
                )}`
            }))
            if (!chef) return res.send("Chef not found!")
            
            return res.render("admin/chefs/editChef", { chef })
        }
    },

    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send('Please, fill all fields!')
            }
        }
        // aqui verifica se ta vindo objeto do formulario
        // res.send({body:req.body, files:req.files})
        let result = await ChefsAdmin.findChef(req.body.id)
        const [{ file_id }] = result.rows
        if (req.files.length === 1) {

            const { filename, path } = req.files[0]
            const fileId = await Files.create({ filename, path })

            const chef = {
                ...req.body,
                file_id: fileId
            }

            result = await ChefsAdmin.updade(chef)
           
            await Files.delete(file_id)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }

        const chef = {
            ...req.body,
            file_id
        }

        result = await ChefsAdmin.updade(chef)
        
        return res.redirect(`/admin/chefs/${req.body.id}`)
    },

    async delete(req, res) {

        const chef = await ChefsAdmin.findOneByChef(req.body.id)
        const fileId = await chef.rows[0].file_id
        const result = await ChefsAdmin.delete(req.body.id)
        const files = await Files.delete(fileId)
        return res.redirect("/admin/chefs/")
    }

}

















