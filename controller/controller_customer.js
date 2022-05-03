const { OrderService } = require("../services");
const { CustomerService } = require("../services");
const { logError, logWarn, genKeyWord } = require("../utils/index");

const CustomerController = {
  async getCustomer(req, res) {
    function getTotalMoney(orderList) {
      let sum = 0;
      for (const order of orderList) {
        sum += getOrderTotal(order);
      }
      return sum;
    }
    function getOrderTotal(order) {
      let sum = 0;
      for (const prd of order.product) {
        sum += parseInt(prd.quantity) * prd.product.price;
      }
      return sum;
    }

    try {
      let keyword = req.query.keyword;
      let shopkeeper = req.body.username;
      let data;
      let customerData = null;
      if (keyword == null || keyword == "") {
        data = await CustomerService.aggregate([
          {
            $lookup: {
              from: "orders",
              localField: "facebook_id",
              foreignField: "customerId",
              pipeline: req.body.type == 2 ? [] : [{ "$match": { "shopkeeper": shopkeeper } },],
              as: "order_detail",
            },
          },
          {
            $addFields: {
              numberOfOrders: {
                $cond: {
                  if: { $isArray: "$order_detail" },
                  then: { $size: "$order_detail" },
                  else: "0",
                },
              },
            },
          },
        ]);
        for (let i = 0; i < data.length; i++) {
          const customer = data[i];
          data[i].totalSpends = getTotalMoney(customer.order_detail);
        }
      } else {
        data = await CustomerService.find({ facebook_id: { $regex: keyword } }).lean();
      }
      let finalResponse = data.filter(customer => customer.order.length > 0)
      console.log(finalResponse)
      //data = customer + tất cả order
      // dùng vòng lặp -> xóa hết tất cả các order không phải của shopkeeper chỉ định
      //=> data = customer + order của shopkeeper
      /*Array.splice(index,1) = xóa phần tử tại vị trí i trong Array */

      return res.json({ data: finalResponse, message: "Lấy đơn hàng thành công" });
    } catch (error) {
      console.log(error);
      return res.json({ data: error, message: "Xảy ra lỗi lấy đơn hàng" });
    }
  },

  async getOrder(req, res) {
    function getOrderTotal(order) {
      let sum = 0;
      for (const prd of order.product) {
        sum += parseInt(prd.quantity) * prd.product.price;
      }
      return sum;
    }
    //req.body.name
    try {
      let data = req.body.data;
      let shopkeeper = req.body.username;
      let orderType = req.body.orderType;// 1 - Order by customerId >< 2 - Order by OrderID
      let result = null;
      let output = [];
      console.log("getOrder Body: ", req.body
      );
      if (orderType == 1) {
        if (req.body.type == 2) {
          result = await OrderService.find({ customerId: data });
        } else {
          result = await OrderService.find({ customerId: data, shopkeeper: shopkeeper });
        }

      } else if (orderType == 2) {
        console.log("in condition" + data);
        result = await OrderService.find({ _id: data });
      }
      if (result.length == 0) {
        return res.json({ data: null, message: "Đơn hàng không tồn tại !" });
      }
      for (let i = 0; i < result.length; i++) {
        const order = result[i];
        result[i].total = getOrderTotal(order);
        output.push({
          total: getOrderTotal(order),
          ...order._doc
        })
      }
      return res.json({ data: output, message: "Lấy đơn hàng thành công" });
    } catch (error) {
      console.log("Get Order Error", error);
      return res.json({ data: error, message: "Xảy ra lỗi lấy đơn hàng" });
    }
  },
};

module.exports = CustomerController;
