
var mongoose = require("../config/dbConnect");
var Schema = mongoose.Schema; //Gom cac title vao
var orderSchema = new mongoose.Schema({//F2 sửa nhanh tên biến
    // table gom cac thuoc tinh sau:
    comment_id: String,
    shopkeeper: String,
    status: {
        type: String,
        default: 'created'
    },
    product: {
        type: Array
    },
    shipper: {
        type: String,
        default: ""
    },
    customerName: String,
    address: String,
    phone: String,
    customerId: String,//Facebook id
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    }, 
    shipCost: {
        type: Number,
        default:3000
    },
    postId: String
});
//Model: tuong tac khi thuc hien lenh
var OrderModel = mongoose.model("order", orderSchema); //Ten cua table = AccountModel
module.exports = OrderModel;