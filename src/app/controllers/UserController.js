const User = require('../models/User')

const crypto = require("crypto");
const mailer = require("../../lib/mailer");
const { hash } = require("bcryptjs");

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

    async post(req, res) {
      const password = crypto.randomBytes(8).toString("hex")
  
      await mailer.sendMail({
        to: req.body.email, //para onde enviar o email
        from: "no-reply@foodfy.com.br", //da ond esta send enviado,
        subject: "Senha de acesso ao foodfy", //titulo
        html: `
        <h2>Olaa seja bem vindo(a)</h2>
        <p>Aqui esta sua senha para realizar o acesso ao foodfy.
        ${password}      
        </p>
      `, //corpo do email
      })
  
      let userId = await User.create(req.body, password)
  
      if (!req.session.userId) req.session.userId = userId
  
      return res.render("admin/users/register", {
        success: "Usuário cadastrado com secesso!",
        location: "/admin/users",
      })
    },

    create(req, res) {
        return res.render("admin/users/register")
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


















