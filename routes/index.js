const AccountRouter = require('./router_account');
const PostRouter = require('./router_post');
const mergeRouter = [
  ...AccountRouter,
  ...PostRouter
]
module.exports = mergeRouter;
