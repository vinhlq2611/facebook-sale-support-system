const AccountRouter = require("./router_account");
const PostRouter = require("./router_post");
const UserRouter = require("./router_users");
const ProductRouter = require("./router_product");
const CommentRouter = require("./router_comment");
const mergeRouter = [...UserRouter, ...PostRouter, ...ProductRouter, ...CommentRouter];
module.exports = mergeRouter;
