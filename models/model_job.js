var mongoose = require("../config/DBConnect");
var jobSchema = new mongoose.Schema({
    // table gom cac thuoc tinh sau:
    shopkeeper: Object,
    shipper: Object,
    content: "String",
    status: {
        type: String,
        default: "pending"
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    },

});
//Model: tuong tac khi thuc hien lenh
var JobModel = mongoose.model("jobs", jobSchema); //Ten cua table = AccountModel
module.exports = JobModel;