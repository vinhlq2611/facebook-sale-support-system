const ProductController = require('../controller/controller_product')
const Middleware = require('../middleware/auth')
module.exports = [
  {
    method: 'post',
    route: '/product/create',
    controller: ProductController,
    middleware: [Middleware.needLogin],
    action: ProductController.create
  }, {
    method: 'get',
    route: '/product/get',
    controller: ProductController,
    middleware: [Middleware.needLogin],
    action: ProductController.getProduct
  },{
    method: 'put',
    route: '/product/edit',
    controller: ProductController,
    middleware: [],
    action: ProductController.edit
  },{
    method: 'delete',
    route: '/product/delete',
    controller: ProductController,
    middleware: [],
    action: ProductController.delete
  }
]