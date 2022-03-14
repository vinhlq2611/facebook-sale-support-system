const ProductController = require('../controller/controller_product')
const AuthMiddleware = require('../middleware/auth')
module.exports = [
  {
    method: 'post',
    route: '/product/create',
    controller: ProductController,
    middleware: [AuthMiddleware.needLogin],
    action: ProductController.create
  }, {
    method: 'get',
    route: '/product/get',
    controller: ProductController,
    middleware: [AuthMiddleware.needLogin],
    action: ProductController.getProduct
  },{
    method: 'put',
    route: '/product/edit',
    controller: ProductController,
    middleware: [AuthMiddleware.needLogin],
    action: ProductController.edit
  },{
    method: 'delete',
    route: '/product/delete',
    controller: ProductController,
    middleware: [AuthMiddleware.needLogin],
    action: ProductController.delete
  },{
    method: 'get',
    route: '/product/count',
    controller: ProductController,
    middleware: [AuthMiddleware.needLogin],
    action: ProductController.getProductNum
  }
]