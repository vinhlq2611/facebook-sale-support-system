const AccountController = require('../controller/controller_account')

module.exports = [
  {
    method: 'post',
    route: '/account/login',
    controller: AccountController,
    middleware: [],
    action: AccountController.login
  }, {
    method: 'post',
    route: '/account/register',
    controller: AccountController,
    middleware: [],
    action: AccountController.register
  }
]
