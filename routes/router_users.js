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
    middleware: [],
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
    middleware: [],
    action: UserController.updateProfile,
  },
];
