var mongoose = require("../config/dbConnect");
var errorSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    code: {
        type: String,
        default: 'UNKNOWN'
    },
    message: String,
    input: Object,
    output: Object,
    stack: String,
    create_at: {
        type: String,
        default: new Date().toLocaleDateString()
    }
}, { supressReservedKeysWarning: true });
//Model: tuong tac khi thuc hien lenh
var ErrorModel = mongoose.model("error_log", errorSchema); //Ten cua table = AccountModel




module.exports = ErrorModel;
