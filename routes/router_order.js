const OrderController = require('../controller/controller_order')
const AuthMiddleware = require("../middleware/auth")

module.exports = [
  {
    method: 'post',
    route: '/order/create',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.create
  }, {
    method: 'get',
    route: '/order/get-order',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.getOrder
  }, {
    method: 'get',
    route: '/order/get-order-detail',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.getOrderDetail
  }, {
    method: 'post',
    route: '/order/get-shipper-order',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.getShipperOrder
  }, {
    method: 'post',
    route: '/order/edit',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.edit
  }, {
    method: 'put',
    route: '/order/changeStatus',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.changeStatus
  }, {
    method: 'post',
    route: '/order/shipper-change-status',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.shipperChangeStatus
  }, {
    method: 'delete',
    route: '/order/delete',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.delete
  }, {
    method: 'get',
    route: '/order/totalEarn',
    controller: OrderController,
    middleware: [AuthMiddleware.needLogin],
    action: OrderController.getTotalEarn
  }
]
