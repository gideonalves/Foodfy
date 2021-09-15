const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

//Controllers
const PagesController = require('./app/controllers/PagesController')
const AdminController = require('./app/controllers/AdminController')
const ChefsController = require('./app/controllers/ChefsController')
const UserController = require('./app/controllers/UserController')
// const ProfileController = require('./app/controllers/ProfileController')
const SessionController = require('./app/controllers/SessionController')

// Validator
const UserValidator = require('./app/validators/user')
const SessionValidator = require('./app/validators/session')


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
routes.get('/admin/login', SessionController.loginForm)
routes.post('/admin/login', SessionValidator.login, SessionController.login)
// routes.post('/admin/login', SessionController.login)

// reset password / forgot
routes.get('/admin/forgot-password', SessionController.forgotForm)
routes.post('/admin/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.get('/admin/password-reset', SessionController.resetForm)
routes.post('/admin/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas de perfil de um usuário logado
//routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
//routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/admin/users/register', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/admin/users/register', UserController.registerForm)

routes.get('/admin/users/create', UserController.create) // Mostrar o formulário de criação de um usuário
//routes.put('/admin/users/:id', UserController.put) // Editar um usuário
//routes.get('/admin/users/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
//routes.delete('/admin/users/:id', UserController.delete) // Deletar um usuário


module.exports = routes


