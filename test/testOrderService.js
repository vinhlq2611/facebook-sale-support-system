const OrderService = require('../services')

async function run() {
    let result = await OrderService.find({ status: "Done" })
    console.log("Test Result: ", result)
}
run()