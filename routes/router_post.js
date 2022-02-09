const PostController = require('../controller/controller_post')

module.exports = [
  {
    method: 'post',
    route: '/post/create',
    controller: PostController,
    middleware: [],
    action: PostController.create
  }, {
    method: 'get',
    route: '/post/getAll',
    controller: PostController,
    middleware: [],
    action: PostController.getPost
  },{
    method: 'put',
    route: '/post/edit',
    controller: PostController,
    middleware: [],
    action: PostController.edit
  },{
    method: 'delete',
    route: '/post/delete',
    controller: PostController,
    middleware: [],
    action: PostController.delete
  }
]
