var mongoose = require("mongoose");//Mongoose thuần chưa kết nối db
require('dotenv').config()
//kết nối đb
mongoose.connect("mongodb://localhost/"+process.env.DB_NAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;//Check xem có lỗi hay không
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log(`Kết nối database ${process.env.DB_NAME} thành công`);
});
module.exports = mongoose;//Mongoose t đã kết nối db