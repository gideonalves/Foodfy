const User = require('../models/User')
const { compare } = require('bcryptjs')

async function login(req, res, next) {
    // veriicar se o usuário está cadastrado
    const { email, password } = req.body

    if (!email || !password) return res.render('session/login', {
        user: req.body,
        error: 'Por favor, entre com seu email e senha.'
    });

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailFormat)) return res.render('session/login', {
        user: req.body,
        error: 'Formato de email inválido!'
    });

    const user = await User.findOne({ where: { email } });

    if (!user) return res.render("session/login", {
        user: req.body,
        error: "Usuário não esta cadastrado!",
    })

    // verificar se o password bate
    const passed = await compare(password, user.password)
    // const passed = password === user.password
    if (!passed) {
        return res.render("session/login", {
            user: req.body,
            error: 'Senha incorreta! Tente novamente.'
        })
    }

    req.user = user

    next()
}

async function forgot(req, res, next) {
    try {
        const { email } = req.body
        let user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/forgot-password", {
            user: req.body,
            error: "Email não esta cadastrado!",
        })

        req.user = user

        next()

    } catch (err) {
        console.error(err);
    }
}

async function reset(req, res, next) {
    try {
        // procurar o usuário
        // veriicar se o usuário está cadastrado
        const { email, password, token, password_repeat } = req.body
        const user = await User.findOne({ where: { email } })

        if (!user) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Usuário não esta cadastrado!",
        })

        // ver se a senha bate
        if (password != password_repeat) return res.render('session/password-reset', {
            user: req.body,
            token,
            error: 'Os campos nova senha e repetir senha precisam ser iguais'
        })

        // verificar se o token bate
        if (token != user.reset_token) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Token inválido! Solicite uma nova recuperação de senha."
        })

        // verificar se o token não expirou
        let now = new Date()
        now = now.setHours(now.getHours())

        if (now > user.reset_token_expires) return res.render("session/password-reset", {
            user: req.body,
            token,
            error: "Token expirado! Por favor Solicite uma nova recuperação de senha."
        })

        req.user = user
        next()
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    login,
    forgot,
    reset
}

