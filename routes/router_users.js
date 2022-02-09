const UserController = require('../controller/controller_users')

module.exports = [
  {
    method: 'post',
    route: '/account/login',
    middleware: [],
    action: UserController.login
  }, {
    method: 'post',
    route: '/account/register',
    middleware: [],
    action: UserController.register
  }
]