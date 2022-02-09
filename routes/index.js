const AccountRouter = require("./router_account");
const PostRouter = require("./router_post");
const UserRouter = require("./router_user");
const mergeRouter = [...UserRouter, ...PostRouter];
module.exports = mergeRouter;
