module.exports = {

    loginForm(req, res) {  

        return res.render("session/login")
    },

    login(req, res) {  
        return res.send('passou')

       req.session.userId = req.user.id

       return res.redirect("/admin/profile")

    },
  
}


















