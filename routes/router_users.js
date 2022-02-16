const UserController = require("../controller/controller_users");
const AuthMiddleware = require("../middleware/auth")
module.exports = [
  {
    method: "post",
    route: "/account/login",
    middleware: [],
    action: UserController.login,
  },
  {
    method: "post",
    route: "/account/register",
    middleware: [],
    action: UserController.register,
  },
  {
    method: "post",
    route: "/account/logout",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.logout,
  },
  {
    method: "post",
    route: "/account/profile",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.getUserByUsername,
  },
  {
    method: "put",
    route: "/account/profile",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.updateProfile,
  },
  {
    method: "post",
    route: "/account/cookie",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.addCookie,
  },
  {
    method: "get",
    route: "/account/cookie",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.getCookie,
  }, {
    method: "get",
    route: "/account/group-list",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.getFacebookGroup,
  }, {
    method: "put",
    route: "/account/changePassword",
    middleware: [AuthMiddleware.needLogin],
    action: UserController.changePassword,
  }
];
