const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "33ea87daa83111",
        pass: "0de36aec8dbce8"
    }
});