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

    //post envia as informações do formulario para o banco
    async post(req, res) {
      // return res.send(req.body)    
      
      const userId = await User.create(req.body)

      req.session.userId = userId

      return res.redirect('admin/users')

    },

    create(req, res) {
        return res.render("admin/users/create")
    },

    async edit(req, res) {
        let result = await User.find(req.params.id)
        const user = result.rows[0]
    
        return res.render("admin/users/edit", { user })
    },



    async update(req, res) {
        try {
          await User.adminUpdate(req.body)
    
          return res.render("admin/users/list", {
            // users,
            success: "Usuário atualizado com sucesso!",
          });
        } catch (err) {
          console.error(err)
        }
      },

}


















