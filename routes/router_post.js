const PostController = require('../controller/controller_post')
const AuthMiddleware = require("../middleware/auth")

module.exports = [
  {
    method: 'post',
    route: '/post/create',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.create
  }, {
    method: 'get',
    route: '/post/get-post',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.getPost
  }, {
    method: 'post',
    route: '/post/edit',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.edit
  }, {
    method: 'delete',
    route: '/post/delete',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.delete
  }, {
    method: 'post',
    route: '/post/disable',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.disable
  },
  {
    method: 'get',
    route: '/post/count',
    controller: PostController,
    middleware: [AuthMiddleware.needLogin],
    action: PostController.getPostNum
  },
  {
    method: 'get',
    route: '/post/admin-get-post',
    controller: PostController,
    middleware: [AuthMiddleware.needAdmin],
    action: PostController.adminGetAllPost
  }
]
