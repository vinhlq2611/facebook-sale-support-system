const CookieController = require("../controller/controller_cookie");
const AuthMiddleware = require("../middleware/auth")
module.exports = [ 
  {
    method: "post",
    route: "/cookie/create",
    middleware: [AuthMiddleware.needLogin],
    action: CookieController.addCookie,
  },
  {
    method: "post",
    route: "/cookie/delete",
    middleware: [AuthMiddleware.needLogin],
    action: CookieController.deleteCookie,
  },
  {
    method: "post",
    route: "/cookie/getAll",
    middleware: [AuthMiddleware.needLogin],
    action: CookieController.getAllCookie,
  },
  {
    method: "put",
    route: "/cookie/update",
    middleware: [AuthMiddleware.needLogin],
    action: CookieController.updateCookie,
  },
  {
    method: "post",
    route: "/cookie/getOne",
    middleware: [AuthMiddleware.needLogin],
    action: CookieController.getOneCookie,
  },
 
];
