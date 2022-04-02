const AccountRouter = require("./router_account");
const PostRouter = require("./router_post");
const UserRouter = require("./router_users");
const ProductRouter = require("./router_product");
const CommentRouter = require("./router_comment");
const OrdertRouter =  require("./router_order");
const CookieRouter = require("./router_cookie");
const CustomerRouter = require("./router_customer")
const mergeRouter = [...UserRouter, ...PostRouter, ...ProductRouter, ...CommentRouter, ...OrdertRouter,...CookieRouter,...CustomerRouter];
module.exports = mergeRouter;
