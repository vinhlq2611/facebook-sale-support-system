const { ProductService, UserService } = require('../services')
const { logError, logWarn, genKeyWord } = require('../utils/index')



const ProductController = {
    async create(req, res) {
        try {
            let title = req.body.title;
            let price = req.body.price;
            let username = req.body.username;
            if (!title || !price) {
                return res.json({ data: null, message: "Lack of information" })
            }
            if (!username) {
                return res.json({ data: null, message: "No user authen" })
            }

            let keyword = genKeyWord(title);
            let result = await ProductService.create({ title, price, keyword, username })
            return res.json({ data: result, message: "Create Product success" })
        } catch (error) {
            logError("Create Product Error", error)
            return res.json({ data: null, message: "Create Product Error" })
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
                return res.json({ data: null, message: "Product not existed !" })
            }
            return res.json({ data: result, message: "Get Product Success" })
        } catch (error) {
            logError("Get Product Error", error)
            return res.json({ data: error, message: "Get Product Error" })
        }
    },
    async edit(req, res) {
        try {
            let _id = req.body._id;
            let title = req.body.title;
            let price = req.body.price;
            let keyword = req.body.keyword;
            if (!_id) {
                return res.json({ data: null, message: "Not have id Product" })
            } else if (!title && !price && !keywords) {
                return res.json({ data: null, message: "Not have information" })
            }
            let result = await ProductService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Product not existed !" })
            } else {
                let updateAt = Date.now()
                result = await ProductService.updateOne({ _id }, { title, price, keyword, updateAt })
            }
            return res.json({ data: result, message: "Update  Success" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Update Error" })
        }
    },
    async delete(req, res) {
        try {
            let _id = req.body._id;
            console.log("Product Id: ", req.body);
            if (!_id) {
                return res.json({ data: null, message: "Not have id of product" })
            }
            let result = await ProductService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            } else {
                result = await ProductService.deleteOne({ _id })
            }
            return res.json({ data: result, message: "Delete  Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Delete Error" })
        }
    },
    async getProductNum(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({ _id });
            if (!user) {
                return res.json({ data: null, message: "Not have id user" })
            }
            let username = user[0].username
            let result = await ProductService.find({ username })
            if (!result) {
                return res.json({ data: null, message: "Product not existed !" })
            }
            return res.json({ data: result.length, message: "Get Number Product Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Get Number Product Error" })
        }
    }
}

module.exports = ProductController