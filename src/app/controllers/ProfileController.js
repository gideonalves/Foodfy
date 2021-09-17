const User = require('../models/User')

module.exports = {
    index(req, res) {
        const { user } = req;
        const error = req.session.error;
        req.session.error = "";
    
        let success = `Bem vindo(a), ${user.name}!`
        if( error ) {success = ""}
    
        return res.render("admin/users/index", {
          user,
          success,
          error,
        });
    },

    async put(req, res) {
     
    },
   

}


















