const User = require('../../models/User')

async function post(req, res, next) {
    // Verifica se todos o campos estão preenchido
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "") {
            return res.render("admin/users/register", {
                user: req.body,
                error: "Preencha todos os campos!"
           })
        
        }
    }

    // Verifca se o email ja existe
    // pega o email do formulario
    const { email } = req.body

      // Faz a pesquisa do banco do user
      const user = await User.findOne({
        where: { email }
    })

   // renderiza para pagina messages.njk
   if (user) return res.render("admin/users/register", {
        user: req.body,
        error: "Usuário já cadastrado."
   })

  

    next()
}

module.exports = {
    post
}