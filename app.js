require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Routers = require('./routes/index')
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// SET UP GIAO DIỆN MOCKUP ĐỂ TEST
app.set("view engine", "ejs");
app.set("views", "./views");
// SET UP ROUTER
Routers.forEach(function (router) {
    app[router.method](router.route, router.middleware, function (request, response) {
        return router.action(request, response)
    })
})
// SET UP UI
// Test login
app.get('/test/login', function (req, res) {
    res.render('login')
})
// Test Đăng Ký
app.get('/test/register', function (req, res) {
    res.render('register')
})
// Test Đăng Xuất
app.get('/test/home', function (req, res) {
    res.render('home')
})
// Test Edit Profile
app.get('/test/profile', function (req, res) {
    res.render('profile')
})
// Test CRUD product
app.get('/test/product-manage', function (req, res) {
    res.render('productManager')
})
// Test Đăng bài
app.get('/test/upload-post', function (req, res) {
    res.render('uploadPost')
})
module.exports = app;
