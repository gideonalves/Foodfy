const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

const PagesController = require('./app/controllers/PagesController')
const AdminController = require('./app/controllers/AdminController')
const ChefsController = require('./app/controllers/ChefsController')
const SessionController = require('./app/controllers/SessionController')


// Rotas Recipes Principais
routes.get("/", PagesController.index ) //ROTA INDEX
routes.get("/about", PagesController.about) // ROTA SOBRE
routes.get("/recipes", PagesController.recipes ) // ROTA DE RECEITAS
routes.get("/recipe/:id", PagesController.recipe) //  ROTA DE RECIPES
routes.get('/chefs', PagesController.pagesChefs)
routes.get('/recipes/search', PagesController.filterRecipesByTitle)



// Rotas Administração
routes.get("/admin/recipes", AdminController.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", AdminController.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", AdminController.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", AdminController.edit); // Mostrar formulário de edição de receita
routes.post("/admin/recipes", multer.array("photos", 5), AdminController.post); // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5),  AdminController.put); // Editar uma receita
routes.delete("/admin/recipes", AdminController.delete); // Deletar uma receita

// Rotas Chefs
routes.get("/admin/chefs", ChefsController.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", ChefsController.create); // Mostrar formulário de nova chefs
routes.get("/admin/chefs/:id", ChefsController.show); // Exibir detalhes de uma chefs
routes.get("/admin/chefs/:id/edit", ChefsController.edit); // Mostrar formulário de edição de chefs
routes.post("/admin/chefs", multer.array("photos", 1), ChefsController.post); // Cadastrar nova chefs
routes.put("/admin/chefs",  multer.array("photos", 1), ChefsController.put); // Editar uma chefs
routes.delete("/admin/chefs", ChefsController.delete); // Deletar uma chefs


// Login/logout
routes.get('/admin/users/login', SessionController.loginForm)
// routes.post('/login', SessionController.login)
// routes.post('/logout', SessionController.logout)

module.exports = routes


