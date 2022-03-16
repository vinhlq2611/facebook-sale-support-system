const { OrderService } = require("../services");
const { CustomerService } = require("../services");
const { logError, logWarn, genKeyWord } = require("../utils/index");

const CustomerController = {
  async getCustomer(req, res) {
    try {
      let keyword = req.query.keyword;
      let data = {};
      if (keyword == null || keyword == "") {
        data = await CustomerService.find();
        console.log("haha");
      } else {
        data = await CustomerService.find({ facebook_id: { $regex: keyword } });
      }
      return res.json({ data: data, message: "Get Order Success" });
    } catch (error) {
      logError("Get Order Error", error);
      return res.json({ data: error, message: "Get Order Error" });
    }
  },

  async getOrder(req, res) {
    //req.body.name
    try {
      let customerId=req.body.facebook_id
      console.log(customerId);
      let result = await OrderService.find({ customerId: customerId });
      if (result.length == 0) {
        return res.json({ data: null, message: "Order not existed !" });
      }
      return res.json({ data: result, message: "Get Order Success" });
    } catch (error) {
      console.log("Get Order Error", error);
      return res.json({ data: error, message: "Get Order Error" });
    }
  },
};

module.exports = CustomerController;
