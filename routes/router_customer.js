const CustomerController = require('../controller/controller_customer')
const AuthMiddleware = require("../middleware/auth")

module.exports = [
   {
    method: 'post',
    route: '/customer/get-order',
    controller: CustomerController,
    middleware: [AuthMiddleware.needLogin],
    action: CustomerController.getOrder
  },
  {
    method: 'post',
    route: '/customer/get-customer',
    controller: CustomerController,
    middleware: [AuthMiddleware.needLogin],
    action: CustomerController.getCustomer
  }
]
