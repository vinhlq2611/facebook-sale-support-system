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

Routers.forEach(function (router) {
    app[router.method](router.route, router.middleware, function (request, response) {
        return router.action(request, response)
    })
})

module.exports = app;
