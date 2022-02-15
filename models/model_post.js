var mongoose = require('../config/DBConnect');
let date = new Date(Date.now);
var PostModel = mongoose.model("post", new mongoose.Schema({
    username: String,
    content: String,
    fb_id: String,
    attachment: {
        type: Array,
        default: [],
    },
    groupId: String,
    status: {
        type: Number,
        default: 'created',
    },
    order: {
        type: Array,
        default: []
    },
    products: {
        type: Array,
        default: []
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
}))
module.exports = PostModel;
