const User = require('../../models/User')

const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {

    loginForm(req, res) {  

        return res.render("session/login")
    },

    login(req, res) {  
        return res.send('passou')

       req.session.userId = req.user.id

       return res.redirect("/admin/profile")

    },

    forgotForm(req, res) {  

        return res.render("session/forgot-password")
    },

    async forgot(req, res) {
        const user = req.user

        try {
            // criar um token para esse usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar uma expiração do token
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Esqueceu a senha?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar a sua senha</p>
            <p>
                <a href="http://localhost:3000/admin/password-reset?token=${token}" tarket="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `,
            })

            // avisar o usuário que enviamos o email
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar a sua senha!"
            })
        } catch (error) {
            console.error(error)
            return res.render("session/forgot-password", {
                error: "Erro inesperado. Tente novamente!"
            })
        }

    },
    
  
}


















