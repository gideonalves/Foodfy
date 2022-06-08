const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')

//Controllers
const HomeController = require('./app/controllers/HomeController')
const RecipeController = require('./app/controllers/RecipeController')
const ChefsController = require('./app/controllers/ChefsController')
const UserController = require('./app/controllers/UserController')
const ProfileController = require('./app/controllers/ProfileController')
const SessionController = require('./app/controllers/SessionController')

// Validator
const UserValidator = require('./app/validators/user')
const ProfileValidator = require('./app/validators/profile')
const SessionValidator = require('./app/validators/session')
const RecipeValidator = require('./app/validators/recipe')
const chefValidator = require('./app/validators/chef')

const { onlyUsers, isAdmin, isCreator, isLoggedRedirectToUsers } = require('./app/middlewares/session')

// Rotas Recipes Principais
routes.get("/", HomeController.index) //ROTA INDEX
routes.get("/about", HomeController.about) // ROTA SOBRE
routes.get("/recipes", HomeController.recipes) // ROTA DE RECEITAS
routes.get("/recipe/:id", HomeController.recipe) //  ROTA DE RECIPES
routes.get('/chefs', HomeController.chefs)

// Rotas Administração
routes.get("/admin/recipes", onlyUsers, RecipeController.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/my-recipes", onlyUsers, RecipeController.userRecipes); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", onlyUsers, RecipeController.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", onlyUsers, RecipeController.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", onlyUsers, isCreator, RecipeController.edit); // Mostrar formulário de edição de receita
routes.post("/admin/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.post, RecipeController.post); // Cadastrar nova receita
routes.put("/admin/recipes", onlyUsers, multer.array("photos", 5), RecipeValidator.put, RecipeController.put); // Editar uma receita
routes.delete("/admin/recipes", onlyUsers, RecipeController.delete); // Deletar uma receita

// Rotas Chefs
routes.get("/admin/chefs", onlyUsers, ChefsController.index); // Mostrar a lista de chefs
routes.get("/admin/chefs/create", onlyUsers, isAdmin, ChefsController.create); // Mostrar formulário de nova chefs
routes.get("/admin/chefs/:id", onlyUsers, ChefsController.show); // Exibir detalhes de uma chefs
routes.get("/admin/chefs/:id/edit", onlyUsers, isAdmin, ChefsController.edit); // Mostrar formulário de edição de chefs
routes.post("/admin/chefs", onlyUsers, isAdmin, multer.array("photos", 1), chefValidator.post, ChefsController.post); // Cadastrar nova chefs
routes.put("/admin/chefs", onlyUsers, isAdmin, multer.array("photos", 1), chefValidator.put, ChefsController.put); // Editar uma chefs
routes.delete("/admin/chefs", onlyUsers, isAdmin, ChefsController.delete); // Deletar uma chefs

// Rotas Users
// Login/logout
routes.get('/admin/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/admin/login', SessionValidator.login, SessionController.login)
routes.post('/admin/logout', SessionController.logout)

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, ProfileValidator.show, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', onlyUsers, ProfileValidator.update, ProfileController.update);
// reset password / forgot
routes.get('/admin/forgot-password', SessionController.forgotForm)
routes.get('/admin/password-reset', SessionController.resetForm)
routes.post('/admin/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/admin/password-reset', SessionValidator.reset, SessionController.reset)

// User register
routes.get('/admin/users/register', onlyUsers, isAdmin, UserController.registerForm)//Mostrar formulário de novo usuários 
routes.post('/admin/users/register', onlyUsers, isAdmin, UserValidator.post, UserController.post) // Cadastrar um usuário

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', onlyUsers, isAdmin, UserController.list) // Mostrar a lista de usuários cadastrados
routes.get('/admin/users/:id/edit', onlyUsers, UserValidator.edit, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.put('/admin/users', onlyUsers, isAdmin, UserValidator.update, UserController.update) // Editar um usuário
routes.delete('/admin/users/', onlyUsers, isAdmin, UserValidator.exclude, UserController.delete) // Deletar um usuário

module.exports = routes

// onlyUsers = bloquea todas as rotas de admin
// isLoggedRedirectToUsers = essa função serve para bloquear o usuario que não tiver logado