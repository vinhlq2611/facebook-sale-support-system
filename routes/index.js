const AccountRouter = require("./router_account");
const PostRouter = require("./router_post");
const UserRouter = require("./router_users");
const ProductRouter = require("./router_product");
const CommentRouter = require("./router_comment");
const OrdertRouter =  require("./router_order")
const mergeRouter = [...UserRouter, ...PostRouter, ...ProductRouter, ...CommentRouter, ...OrdertRouter];
module.exports = mergeRouter;
