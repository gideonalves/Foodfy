const User = require('../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    // Lista de usuario
    async list(req, res) {
        const results = await User.list()
        const users = results.rows
    
        return res.render("admin/users/list", { users })
    },
    // Cria usuario
    registerForm(req, res) {
        return res.render("admin/users/register")
    },

    create(req, res) {
        return res.render("admin/users/create")
    },

    //post envia as informações do formulario para o banco
    async post(req, res) {
    
    },

}


















