require('dotenv').config()
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var Routers = require('./routes/index');
var AttachmentModel = require('./models/model_attachment')
const { uploadImage } = require('./middleware/upload')
var cors = require('cors')
var app = express();
const { needGuest, needLogin } = require('./middleware/auth')
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(cors())
// SET UP GIAO DIỆN MOCKUP ĐỂ TEST
app.set("view engine", "ejs");
app.set("views", "./views");
// SET UP MULTTER UPLOAD FILES
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./images"); //important this is a direct path fron our current file to storage location
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});




var upload = multer({ storage: fileStorageEngine })
app.post("/uploadfile", upload.array("images"), async (req, res) => {
    try {
        let imgList = req.files;
        let result = [];
        for (const img of imgList) {
            console.log(typeof img)
            console.log("Handle Image: ", img)
            let encode_image = img.toString('base64');
            let finalImg = {
                name: img.path,
                contentType: img.mimetype,
            };
            let response = await AttachmentModel.create(finalImg)
            // uploadImage(img, imgData)
            result.push(response.id);
        }
        res.json({ data: result, message: 'Uploaded file successfully' });
    } catch (error) {
        console.log("Upload File Fail: ", error)
        res.json({ data: null, message: 'Uploaded file fail' });

    }
});
app.get('/uploadfile/:id', async (req, res) => {
    try {
        var filename = req.params.id;
        let result = await AttachmentModel.findOne({ '_id': filename });
        let file = fs.readFileSync(result.name)
        // console.log("File Data: ", result.image.buffer)
        res.contentType(result.contentType);
        res.send(file)
    } catch (error) {
        console.log("Lấy ảnh thát bại, ", error.message)
        res.send(null)
    }
})
// SET UP ROUTER
Routers.forEach(function (router) {
    app[router.method](router.route, router.middleware, function (request, response) {
        return router.action(request, response)
    })
})
// SET UP UI
// Test login
app.get('/test/login', needGuest, function (req, res) {
    res.render('login')
})
// Test Đăng Ký
app.get('/test/register', needGuest, function (req, res) {
    res.render('register')
})
// Test Đăng Xuất
app.get('/test/home', needLogin, function (req, res) {
    res.render('home')
})
// Test Edit Profile
app.get('/test/profile', needLogin, function (req, res) {
    res.render('profile')
})
//Test change password
app.get('/test/changePassword', needLogin, function (req, res) {
    res.render('changePassword')
})
// Test CRUD product
app.get('/test/product-manage', needLogin, function (req, res) {
    res.render('productManager')
})
// Test Đăng bài
app.get('/test/upload-post', needLogin, function (req, res) {
    res.render('uploadPost')
})
// Test Chi tiết bài đăng
app.get('/test/sell-control/:postId', needLogin, function (req, res) {
    res.render('sellControl')
})
// Test Quản lý user
app.get('/test/manage-user', needLogin, function (req, res) {
    res.render('manageUser')
})
// Test Quản lý bài đăng
app.get('/test/post-manage', needLogin, function (req, res) {
    res.render('postManage')
})
// Test Quản lý bài đăng
app.get('/test/order-manage', needLogin, function (req, res) {
    res.render('orderManage')
})
app.get('/test/cookie-manage', needLogin, function (req, res) {
    res.render('cookiesManage')
})
module.exports = app;
