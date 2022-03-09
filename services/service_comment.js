const { CommentModel } = require('../models')// {key}=> Ông chỉ lấy đúng cái key ra thôi => tôi lấy thuộc tính OrderModel của obj Models
// const  OrderModel = require('../models')// key=> Ông lấy cả cái object ra => Tôi lấy obj Models 
const { logError } = require('../utils')

async function find(condition) {//
    try {
        return CommentModel.find(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.Find ", { input: condition, error })
    }
}

async function create(data) {
    try {
        return CommentModel.create(data)
    } catch (error) {
        logError("Lỗi tại OrderService.create ", { input: data, error })
    }
}

async function deleteOne(condition) {
    try {
        return CommentModel.deleteOne(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteOne ", { input: condition, error })
    }
}

async function deleteMany(condition) {
    try {
        return CommentModel.deleteMany(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteMany ", { input: condition, error })
    }
}

async function updateOne(condition, newData) {
    try {
        return CommentModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateOne ", { input: condition, error })
    }
}

async function updateMany(condition, newData) {
    try {
        return CommentModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateMany ", { input: condition, error })
    }
}

async function handleScanComment(postId, facebookCommentList, products) {
    let threadList = []
    for (let fbComment of facebookCommentList) {
        threadList.push(addComment(postId, fbComment, null, products))
        if (fbComment.childs.length > 0) {
            for (const child of fbComment.childs) {
                threadList.push(addComment(postId, child, fbComment.fb_id, products))
            }
        }
        if (threadList.length > 20) {
            await Promise.all(threadList);
            threadList = []
        }
    }
    await Promise.all(threadList);
    threadList = []
}

async function addComment(postId, comment, parentId, products) {
    let doc = {
        fb_id: comment.fb_id,
        post_id: postId,
        author: comment.author,
        content: comment.content,
        parentId: parentId,
        type: 0
    }
    let isExist = await CommentModel.find({ fb_id: doc.fb_id })
    if (isExist.length > 0) {
        if (isExist[0].content != doc.content) {
            let commentData = analyzeComment(comment, products)
            await CommentModel.updateOne({ fb_id: doc.fb_id }, { content: doc.content, type: 0, data: commentData })
        }
        return
    } else {
        doc.data = analyzeComment(comment, products)
        // console.log("Dữ liệu cuối:", doc.data)
        await CommentModel.create(doc)
        return
    }
}



function analyzeComment(comment, products) {
    let data = {
        phone: null,
        address: null,
        products: null,
        isCancelled: false,
    }
    try {
        let content = comment.content.toLowerCase();
        // Xác định xem có phải hủy đơn không
        if (content.indexOf(' hủy') > -1) {
            data.isCancelled = true
            return data
        }
        // Xác định sản phẩm
        let productData = getProduct(content, products)
        // console.log("Xác định sản phẩm: ", productData.selectedProduct.length)
        //Xác định sđt
        let phoneData = getPhoneNumber(content)
        // Xác định địa chỉ
        let addressData = getAddress(content, productData.endOfProducts, phoneData.startOfPhone, phoneData.endOfPhone)

        if (productData.selectedProduct.length > 0) {

            data.products = productData.selectedProduct
            // console.log("Thêm sản phẩm: ", data.products)
        }
        if (phoneData.phoneNumber != null) {
            data.phone = phoneData.phoneNumber
        }
        if (addressData.isAddress) {
            data.address = addressData.addressStr
        }
    } catch (error) {
        // console.log("Phân tích comment thất bại, ", error)
    }
    return data
}

//Xác định địa chỉ 
function getAddress(content, endOfProducts, startOfPhone, endOfPhone) {
    //Case1: sản phẩm - địa chỉ - sđt
    try {
        let isAddress = false;
        let addressKey = ['trọ', 'nhà', 'phòng', 'cửa hàng', 'nhà hàng', 'sảnh', 'quán', 'công ty']
        let domRegex = /([a-h])+([0-9]{3})+[r|l]\b/g
        let addressStr = content.substring(endOfProducts, startOfPhone)
        for (const key of addressKey) {
            if (addressStr.indexOf(key) > -1 || addressStr.match(domRegex)) {
                isAddress = true;
            }
        }
        // Case2: sản phẩm - sđt - địa chỉ
        if (!isAddress)
            addressStr = content.substring(endOfPhone, content.length)
        for (const key of addressKey) {
            if (addressStr.indexOf(key) > -1 || addressStr.match(domRegex)) {
                isAddress = true;
            }
        }
        return {
            isAddress,
            addressStr
        }
    } catch (error) {
        // console.log("Không thể xác định địa chỉ của: ", content, error)
        return {
            isAddress: null,
            addressStr: null
        }
    }
}

function getPhoneNumber(content) {
    try {
        let phoneRegex = /(84|0|[1-9])+([0-9]{8})\b/g
        let startOfPhone = -1, endOfPhone = -1;
        let phoneNumber = null
        let havePhone = content.match(phoneRegex)
        if (havePhone.length > 0) {
            // console.log("Số điện thoại:", havePhone)
            phoneNumber = havePhone[0]
            startOfPhone = content.indexOf(phoneNumber);
            endOfPhone = startOfPhone + 9;

        }
        return {
            phoneNumber, startOfPhone, endOfPhone
        }
    } catch (error) {
        // console.log("Không thể lấy số điện thoại của:", content, error)
        return {
            phoneNumber: null, startOfPhone: -1, endOfPhone: -1
        }
    }
}

function getProduct(content, products) {
    let endOfProducts = -1
    let selectedProduct = []
    // console.log("Xử lý comment: ", content)
    try {
        for (let product of products) {
            for (let keyword of product.keyword) {
                keyword = keyword.toLowerCase().trim()
                // console.log("Xử lý keyword: ", keyword)
                if (content.indexOf(keyword) > -1) {
                    let quantity = 1;
                    // console.log("Độ dài keyword: ", keyword.length)
                    let evidence = content.substring(content.indexOf(keyword), keyword.length + 2)
                    // console.log("Bằng chứng: ", evidence)
                    let subStr = content.substring(0, content.indexOf(keyword)).split(' ');
                    subStr = subStr.filter(text => text != '' && text != ' ')
                    // console.log("Chuỗi tìm số lượng: ", subStr)
                    if (!isNaN(subStr[subStr.length - 1])) {
                        quantity = subStr[subStr.length - 1]
                    }
                    // console.log("Dữ liệu phân tích: ", quantity, evidence)
                    // console.log(product)
                    selectedProduct.push({
                        quantity,
                        evidence: keyword,
                        product
                    })
                    let endOfProduct = content.indexOf(keyword) + keyword.length;
                    if (endOfProduct > endOfProducts) {
                        endOfProducts = endOfProduct
                    }
                }
            }
        }
    } catch (error) {
        console.log("Phân tích sản phẩm thất bại:", error, comment)
    }
    return {
        selectedProduct, endOfProducts
    }
}
module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany, handleScanComment
}