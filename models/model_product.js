var mongoose = require('../config/DBConnect');
let date = new Date(Date.now);
var ProductModel = mongoose.model("product", new mongoose.Schema({
    title: String,
    price: Number,
    username: String,
    keyword: {
        type: Array,
        default: [],
    },
    createAt: {
        type: Number,
        default: Date.now()
    },
    updateAt: {
        type: Number,
        default: Date.now()
    }
}))
module.exports = ProductModel;
