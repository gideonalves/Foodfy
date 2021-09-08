const User = require('../../models/User')

module.exports = {
    async list(req, res) {
        const results = await User.list()
        const users = results.rows
    
        return res.render("admin/users/index", { users })
    },

    registerForm(req, res) {
        return res.render("admin/users/register")
    }

}


















