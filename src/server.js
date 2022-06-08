const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const routes = require("./routes") // chama o arquivo routes.js
const session = require('./config/session') // configura a session

const server = express() // recipes guarda todos as informações que ta dentro o arquivo data.js

server.use(session) // a session fica disponivel para toda a aplicação
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public')) // server.use(express.static('public/css'))
server.use(methodOverride('_method'))
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})
server.use(routes)

server.set("view engine", "njk")

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function () {
    console.log("server is running")
})






