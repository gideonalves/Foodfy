module.exports = {

    loginForm(req, res) {  

        return res.render("session/login")
    },

    login(req, res) {  
        return res.send('Chegou')

       req.session.userId = req.user.id

       return res.redirect("/users")

    },
  
}


















