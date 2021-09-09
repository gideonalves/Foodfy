const User = require('../../models/User')

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

        return res.send('Passou')
        // Parei aqui

    }

}


















