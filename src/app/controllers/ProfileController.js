const User = require('../models/User')

module.exports = {
  index(req, res) {
    const { user } = req;
    const { error } = req.session;

    req.session.error = "";

    let success = `Bem vindo(a), ${user.name}!`

    if (error) { success = "" }
    return res.render("admin/users/index", {
      user,
      success,
      error,
    });
  },
  async update(req, res) {
    try {
      const { user } = req;
      const { name, email } = req.body;

      await User.update(user.id, { name, email });

      return res.render('admin/users/index', {
        user: req.body,
        success: 'Sua conta foi atualizada com sucesso!'
      });
    } catch (err) {
      console.error(err);
    }
  }
}





















