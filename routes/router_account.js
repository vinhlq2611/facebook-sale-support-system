const AccountController = require('../controller/controller_account')

module.exports = [
  {
    method: 'post',
    route: '/accounts/login',
    middleware: [],
    action: AccountController.login
  }, {
    method: 'post',
    route: '/accounts/register',
    middleware: [],
    action: AccountController.register
  }
]
