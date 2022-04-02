var mongoose = require("../config/dbConnect");
var customerSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    fullname: {
        type: Array,
    },
    phone:{
        type:Array,
    },
    address:{
        type: Array,
    },
    order:{
        type: Array,
    },
    facebook_id:String,
});
//Model: tuong tac khi thuc hien lenh
var CustomerModel = mongoose.model("customer", customerSchema); //Ten cua table = AccountModel
module.exports = CustomerModel;