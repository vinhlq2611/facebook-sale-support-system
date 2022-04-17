const ShipperController = require('../controller/controller_shipper')
const AuthMiddleware = require("../middleware/auth")

module.exports = [
  {
    method: 'post',
    route: '/shipper/get-shipper',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.getShipper
  },
  {
    method: 'post',
    route: '/shipper/delete-shipper',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.deleteShipper
  },
  {
    method: 'post',
    route: '/shipper/find-shipper',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.findShipper
  },
  {
    method: 'post',
    route: '/shipper/add-shipper',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.inviteShipper
  },
  {
    method: 'post',
    route: '/shipper/shipper-detail',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.getShipperDetails
  },
  {
    method: 'post',
    route: '/shipper/get-job',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.getJob
  },
  {
    method: 'post',
    route: '/shipper/update-job',
    controller: ShipperController,
    middleware: [AuthMiddleware.needLogin],
    action: ShipperController.updateJob
  }
]