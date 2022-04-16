
var mongoose = require("../config/DBConnect");
var Schema = mongoose.Schema; //Gom cac title vao
var commentSchema = new mongoose.Schema({//F2 sửa nhanh tên biến
    // table gom cac thuoc tinh sau:
    fb_id: String,
    post_id: String,
    author: Object,

    content: String,
    parentId: String,
    orderID: String,
    type: Number,
    customerId: String,//Facebook id
    data: Object,
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    }
});
//Model: tuong tac khi thuc hien lenh
var OrderModel = mongoose.model("comment", commentSchema); //Ten cua table = AccountModel
module.exports = OrderModel;