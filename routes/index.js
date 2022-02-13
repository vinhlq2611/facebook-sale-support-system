const AccountRouter = require("./router_account");
const PostRouter = require("./router_post");
const UserRouter = require("./router_users");
const ProductRouter = require("./router_product");
const mergeRouter = [...UserRouter, ...PostRouter, ...ProductRouter];
module.exports = mergeRouter;
