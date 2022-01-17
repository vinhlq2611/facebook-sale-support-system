
var mongoose = require("../config/dbConnect");
const { model } = require("../config/dbConnect");
var Schema = mongoose.Schema; //Gom cac title vao
var accountSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    username: String,
    password: String,
    age: Number,
    address: String,
    createAt: {
        type: Number,
        default: Date.now()
    }
});
//Model: tuong tac khi thuc hien lenh
var AccountModel = mongoose.model("account", accountSchema); //Ten cua table = AccountModel
module.exports = AccountModel;