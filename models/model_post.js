var mongoose = require('../config/DBConnect');
let date = new Date(Date.now);
var PostModel = mongoose.model("post", new mongoose.Schema({
    fb_id : String,
    content : String,
    attachment : {
        type : Array,
        default : [],
    },
    status : {
        type : Number,
        default : 'reated',
    },
    order : Array,
    createAt: {
        type : Date,
        default :  date.getFullYear + "-" + date.getMonth + "-" + date.getDate + "-" + date.getHours + ":" + date.getMinutes
    }
}))
module.exports = PostModel;
