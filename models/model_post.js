var mongoose = require('../config/DBConnect');
let date = new Date(Date.now);
var PostModel = mongoose.model("post", new mongoose.Schema({
    username: String,
    content: String,
    fb_id: String,
    fb_url: String,
    attachment: {
        type: Array,
        default: [],
    },
    group: Object,
    status: {
        type: Number,
        default: 1,
    },
    order: {
        type: Array,
        default: []
    },
    products: {
        type: Array,
        default: []
    },
    commentList: {
        type: Array,
        default: []
    },
    shipper: {
        type: Array,
        default: []
    },
    config: {
        type: Object,
        default: {
            autoComment: 60,
            autoReply: false,
            autoCreateOrder: false,
            scanDuration: 120
        }
    },
    shipCost: {
        type: Number,
        default: 3000
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    endAt: {
        type: Date,
    }
}))
module.exports = PostModel;
