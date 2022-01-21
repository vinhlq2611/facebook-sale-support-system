const AccountRouter = require('./router_account')
const mergeRouter = [
  ...AccountRouter,
]
module.exports = mergeRouter;
