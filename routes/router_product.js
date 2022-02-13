const ProductController = require('../controller/controller_product')

module.exports = [
  {
    method: 'post',
    route: '/product/create',
    controller: ProductController,
    middleware: [],
    action: ProductController.create
  }, {
    method: 'get',
    route: '/product/getAll',
    controller: ProductController,
    middleware: [],
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