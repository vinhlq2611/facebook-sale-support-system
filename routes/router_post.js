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
    method: 'put',
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
  }
]
