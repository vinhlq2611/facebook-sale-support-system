var mongoose = require("../config/dbConnect");
var attachmentSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    name: String,
    contentType: String,
});
//Model: tuong tac khi thuc hien lenh
var AttachmentModel = mongoose.model("attachment", attachmentSchema); //Ten cua table = AccountModel
module.exports = AttachmentModel;