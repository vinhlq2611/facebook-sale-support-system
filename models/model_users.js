var mongoose = require("../config/dbConnect");
var accountSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    fullname: String,
    username: String,
    password: String,
    birthdate: String,
    address: String,
    email: String,
    type: Number,
    isActive: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    type: {
        type: Number,
        default: 0,
    },
    phone: {
        type: String,
        default: '123456789'
    },
    facebook: {
        type: Object,
        default: {}
    },
    post: {
        type: Array,
    },
    product: {
        type: Array,

    },
    jobs: {
        type: Array,
        default: []

    },
    shippers: {
        type: Array,
        default: []
    },
    replySyntaxs: {
        type: Array,
        default: ["cho mình xin địa chỉ", "cho mình xin số điện thoại", "bạn order gì?", "ok"]
    },
});
//Model: tuong tac khi thuc hien lenh
var UserModel = mongoose.model("user", accountSchema); //Ten cua table = AccountModel
module.exports = UserModel;