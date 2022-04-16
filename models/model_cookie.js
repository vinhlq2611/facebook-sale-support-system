var mongoose = require("../config/DBConnect");
var cookieSchema = new mongoose.Schema({
  // table gom cac thuoc tinh sau:
  data: String,
  status: {
    type: Number,
    default: 1,
  },
  dtsg: String,
  uid: String,
  token: String,
});
//Model: tuong tac khi thuc hien lenh
var CookieModel = mongoose.model("cookie", cookieSchema); //Ten cua table = AccountModel
module.exports = CookieModel;
