const { ProductService } = require('../services')
const { logError, logWarn, genKeyWord } = require('../utils/index')



const ProductController = {
    async create(req,res){
        try {
            let title = req.body.title;
            let price = req.body.price;
            if (!title || !price) {
                return res.json({ data: null, message: "Lack of information" })
            }
            console.log(req.body);

            let keyword = genKeyWord(title);
            let result = await ProductService.create({ title, price, keyword})
            return res.json({ data: result, message: "Create Product success" })
        } catch (error) {
            logError("Create Product Error", error)
            return res.json({ data: error, message: "Create Product Error" })
        }
    },
    async getProduct(req,res){
        try {
            let result = await ProductService.find({req})
            // console.log('result' + util.inspect(result ,false, null, true))
            if ((await result).length == 0){
                return res.json({ data: null, message: "Product not existed !" })
            }
            return res.json({ data: result, message: "Get Product Success" })
        } catch (error) {
            logError("Get Product Error", error)
            return res.json({ data: error, message: "Get Product Error" })
        }
    },
    async edit(req,res){
        try {
            let _id = req.body._id;
            let title = req.body.title;
            let price = req.body.price;
            let keyword = req.body.keyword;
            if (!_id) {
                return res.json({ data: null, message: "Not have id Product" })
            }else if(!title && !price && !keywords){
                return res.json({ data: null, message: "Not have information" })
            }
            let result = await ProductService.find({_id})
            if (!result){
                return res.json({ data: null, message: "Product not existed !" })
            }else{
                let updateAt = Date.now()
                result = await ProductService.updateOne({_id}, {title,price,keyword,updateAt})
            }
            return res.json({ data: result, message: "Update  Success" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Update Error" })
        }
    },
    async delete(req,res){
        try {
            let _id = req.body._id;
            if (!_id) {
                return res.json({ data: null, message: "Not have id post" })
            }
            let result = await ProductService.find({_id})
            if (!result){
                return res.json({ data: null, message: "Post not existed !" })
            }else{
                result = await ProductService.deleteOne({_id})
            }
            return res.json({ data: result, message: "Delete  Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Delete Error" })
        }
    }
}

module.exports = ProductController