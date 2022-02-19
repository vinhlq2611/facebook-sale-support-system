const CommentController = require('../controller/controller_comment')
const AuthMiddleware = require('../middleware/auth')
module.exports = [
    {
        method: 'post',
        route: '/comment/scan-comment',
        middleware: [AuthMiddleware.needLogin],
        action: CommentController.scanComment
    },
    {
        method: 'get',
        route: '/comment/get-comment',
        middleware: [AuthMiddleware.needLogin],
        action: CommentController.getComment
    }
]
