const User = require('../../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    // Lista de usuario
    async list(req, res) {
        const results = await User.list()
        const users = results.rows
    
        return res.render("admin/users/index", { users })
    },
    // Cria usuario
    registerForm(req, res) {
        return res.render("admin/users/register")
    },
    //post envia as informações do formulario para o banco
    async post(req, res) {

        const userId = await User.create(req.body)

        req.session.userId = userId

        // let { name, email, is_admin } = req.body;

        // const password = crypto.randomBytes(8).toString("hex");
  
        // await mailer.sendMail({
        //   to: email,
        //   from: "no-reply@foodfy.com.br", //da ond esta send enviado,
        //   subject: "Cadastrado com sucesso!",
        //   html: `
        //       <h2>Bem vindo, ${name}</h2>
        //       <p>A partir de agora você pode criar, editar e visualizar suas receitas na plataforma Foodfy.</p>
        //       <p>Utilize os seguintes dados para login:</p>
        //       <p>E-mail: <strong>${email}</strong></p>
        //       <p>Senha: <strong>${password}</strong></p>
        //       <p>Para realizar seu login na plataforma, clique nesse link:<p/>
        //       <p>
        //           <a href="http://localhost:3000/admin/login" tarket="_blank" style="text-decoration: none; color: red;">
        //               Acesse sua conta!
        //           </a>
        //       </p>
        //       `,
        // });
        

        return res.send('Passou')
        // Parei aqui

    }

}


















