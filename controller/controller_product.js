const { ProductService, UserService } = require('../services')
const { logError, logWarn, genKeyWord } = require('../utils/index')



const ProductController = {
    async create(req, res) {
        try {
            let title = req.body.title;
            let price = req.body.price;
            let username = req.body.username;
            if (!title || !price) {
                return res.json({ data: null, message: "Chưa đủ thông tin" })
            }
            if (!username) {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }

            let keyword = genKeyWord(title);
            let result = await ProductService.create({ title, price, keyword, username })
            return res.json({ data: result, message: "Tạo sản phẩm thành công" })
        } catch (error) {
            logError("Create Product Error", error)
            return res.json({ data: null, message: "Lỗi tạo sản phẩm" })
        }
    },//FE truyền dữ liệu -> BE nhận dữ liệu -> BE xử lý dữ liệu -> BE trả dữ liệu
    async getProduct(req, res) {//req.body.name 
        try {
            let condition = {};
            if (req.body.username) {
                condition.username = req.body.username
            }
            if (req.query.id) {
                condition._id = req.query.id
            }
            let result = await ProductService.find(condition)
            console.log('Condition: ', req.body)
            // console.log('result' + util.inspect(result ,false, null, true))
            if (result.length == 0) {
                return res.json({ data: null, message: "Sản phẩm không tồn tại!" })
            }
            return res.json({ data: result, message: "Lấy sản phẩm thành công" })
        } catch (error) {
            logError("Get Product Error", error)
            return res.json({ data: error, message: "Lỗi lấy sản phẩm" })
        }
    },
    async edit(req, res) {
        try {
            let _id = req.body._id;
            let title = req.body.title;
            let price = req.body.price;
            let keyword = req.body.keyword;
            if (!_id) {
                return res.json({ data: null, message: "Không có id sản phẩm" })
            } else if (!title && !price && !keywords) {
                return res.json({ data: null, message: "Chưa đủ thông tin" })
            }
            let result = await ProductService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Sản phẩm không tồn tại !" })
            } else {
                let updateAt = Date.now()
                result = await ProductService.updateOne({ _id }, { title, price, keyword, updateAt })
            }
            return res.json({ data: result, message: "Cập nhật thành công" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Lỗi cập nhật" })
        }
    },
    async delete(req, res) {
        try {
            let _id = req.body._id;
            console.log("Product Id: ", req.body);
            if (!_id) {
                return res.json({ data: null, message: "Không có id sản phẩm" })
            }
            let result = await ProductService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Sản phẩm không tồn tại!" })
            } else {
                result = await ProductService.deleteOne({ _id })
            }
            return res.json({ data: result, message: "Xóa sản phẩm thành công" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi xóa sản phẩm" })
        }
    },
    async getProductNum(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({ _id });
            if (!user) {
                return res.json({ data: null, message: "Không có id người dùng" })
            }
            let username = user[0].username
            let result = await ProductService.find({ username })
            if (!result) {
                return res.json({ data: null, message: "Sản phẩm không tồn tại!" })
            }
            return res.json({ data: result.length, message: "Lấy số sản phẩm thành công" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi lấy số sản phẩm" })
        }
    }
}

module.exports = ProductController