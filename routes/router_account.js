const AccountController = require('../controller/controller_account')

module.exports = [
  {
    method: 'post',
    route: '/account/login',
    middleware: [],
    action: AccountController.login
  }, {
    method: 'post',
    route: '/account/register',
    middleware: [],
    action: AccountController.register
  }
]
