
const { UserService, CustomerService, OrderService, CommentService } = require('../services')
const { logError, logWarn, genKeyWord } = require('../utils/index')


const OrderController = {
    async create(req, res) {
        try {
            console.log("Order Data: ", req.body)
            let comment_id = req.body.comment_id;
            let shopkeeper = req.body.username;
            let product = req.body.product;
            let customerName = req.body.customerName;
            let address = req.body.address;
            let phone = req.body.phone;
            let customerId = req.body.customerId;
            let postId = req.body.postId;
            let createAt = req.body?.createAt ? req.body?.createAt : Date.now();
            if (!comment_id || !product || product.length < 1 || !customerName || !address || !phone || !customerId || !postId) {
                return res.json({ data: null, message: "Thiếu Thông Tin" })
            }
            if (!shopkeeper) {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }
            let isExist = await OrderService.find({ comment_id: comment_id })
            if (isExist.length > 0) {
                return res.json({ data: null, message: "Đơn hàng Đã tồn tại" })
            }
            let result = await OrderService.create({ comment_id, shopkeeper, product, customerName, address, phone, customerId, postId, createAt, updateAt: createAt })
            await CommentService.updateOne({ fb_id: comment_id }, { type: 1 })
            // console.log(result);
            let order = result._id;
            let customer_exist = await CustomerService.find({ facebook_id: customerId });
            if (customer_exist.length > 0) {
                let address_exist = await CustomerService.find({ address: address, facebook_id: customerId });
                let name_exist = await CustomerService.find({ fullname: customerName, facebook_id: customerId })
                let phone_exist = await CustomerService.find({ phone: phone, facebook_id: customerId },)
                if (phone_exist.length == 0) {
                    let phone_update = await CustomerService.updateOne({ facebook_id: customerId }, { $push: { phone: phone } })
                }
                if (name_exist.length == 0) {
                    let name_update = await CustomerService.updateOne({ facebook_id: customerId }, { $push: { name: customerName } })
                }
                if (address_exist.length == 0) {
                    let address_update = await CustomerService.updateOne({ facebook_id: customerId }, { $push: { address: address } })
                }
            } else {
                let customer = await CustomerService.create({ fullname: customerName, phone, address, order, facebook_id: customerId });
            }

            return res.json({ data: result, message: "Tạo đơn hàng thành công" })
        } catch (error) {
            console.log("Create Order Error", error)
            return res.json({ data: null, message: "Create Order Error" })
        }
    },//FE truyền dữ liệu -> BE nhận dữ liệu -> BE xử lý dữ liệu -> BE trả dữ liệu
    async getOrder(req, res) {//req.body.name 
        try {
            let condition = {};
            if (req.body.username) {
                condition.shopkeeper = req.body.username
            } else {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }
            if (req.query.id) {
                condition._id = req.query.id
            }
            let result = await OrderService.find(condition)
            console.log('Condition: ', req.body)
            // console.log('result' + util.inspect(result ,false, null, true))
            if (result.length == 0) {
                return res.json({ data: null, message: "Đơn hàng không tồn tại !" })
            }
            return res.json({ data: result, message: "Lấy đơn hàng thành công" })
        } catch (error) {
            logError("Get Order Error", error)
            return res.json({ data: error, message: "Xảy ra lỗi lấy đơn hàng" })
        }
    },
    async getOrderDetail(req, res) {//req.body.name 
        try {
            let condition = {};
            condition._id = req.query.id
            let result = await OrderService.find(condition)
            console.log('Condition: ', req.body)
            // console.log('result' + util.inspect(result ,false, null, true))
            if (result.length == 0) {
                return res.json({ data: null, message: "Đơn hàng không tồn tại !" })
            }
            return res.json({ data: result[0], message: "Lấy đơn hàng thành công" })
        } catch (error) {
            logError("Get Order Error", error)
            return res.json({ data: null, message: "Xảy ra lỗi lấy đơn hàng" })
        }
    },
    async getShipperOrder(req, res) {
        try {
            let shopkeepers = req.body.shopkeepers;
            let shipper = req.body.username;
            let order = await OrderService.find({
                username: { $in: shopkeepers },
                shipper: { $in: [shipper, ""] },
                status: { $in: ['ready', 'shipping', 'done', 'cancel'] }
            })
            return res.json({ data: order, message: "Đã Tìm thấy order" })
        } catch (error) {
            console.log("Tìm order của shipper thất bại: ", error)
            return res.json({ data: null, message: "Tìm order của shipper thất bại" })
        }
    },
    async edit(req, res) {
        try {
            let _id = req.body._id;
            let product = req.body.product;
            let customerName = req.body.customerName;
            let address = req.body.address;
            let phone = req.body.phone;
            let shipper = req.body.shipper;
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Chưa có id sản phẩm" })
            }
            //  else if (!title && !price && !keywords) {
            //     return res.json({ data: null, message: "Not have information" })
            // }
            let result = await OrderService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Đơn hàng không tồn tại !" })
            } else {
                let updateAt = Date.now()
                result = await OrderService.updateOne({ _id }, { product, customerName, address, phone, shipper, updateAt })
            }
            return res.json({ data: result, message: "Cập nhật thành công" })
        } catch (error) {
            console.log("Edit Post Error", error)
            return res.json({ data: error, message: "Lỗi cập nhật" })
        }
    },
    async delete(req, res) {
        try {
            let _id = req.body._id;
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Chưa có id bài đăng" })
            }
            let result = await OrderService.find({ _id })
            if (!result) {
                return res.json({ data: null, message: "Bài đăng không tồn tại !" })
            } else {
                result = await OrderService.deleteOne({ _id })
            }
            return res.json({ data: result, message: "Xóa thành công" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi xóa bài đăng" })
        }
    },
    async shipperChangeStatus(req, res) {
        try {
            let validStatus = ['created', 'ready', 'shipping', 'done', 'cancel']
            let shipper = req.body.shipper;
            let status = req.body.status;
            let _id = req.body.orderId;
            let updateAt = req.body.updateAt;
            if (!validStatus.includes(status)) {
                return res.json({ data: null, message: "Trạng thái không hợp lệ." })
            }
            let [selectedOrder] = await OrderService.find({ _id });
            console.log(selectedOrder)

            if (selectedOrder.shipper != "" && selectedOrder.shipper != shipper) {
                return res.json({ data: null, message: "Đơn hàng thuộc về người khác" })
            }
            else {
                let result = await OrderService.updateOne({ _id }, { shipper, status, updateAt })
                return res.json({ data: result, message: "Cập nhật thành công" })
            }
        } catch (error) {
            console.log("Cập nhật đơn hàng thất bại: ", error)
            return res.json({ data: null, message: "Cập nhật đơn hàng thất bại" })
        }
    },
    async changeStatus(req, res) {
        try {
            let validStatus = ['created', 'ready', 'shipping', 'done', 'cancel']
            let _id = req.query.id;
            let status = req.query.status;
            let updateAt = req.query.updateAt
            if (!validStatus.includes(status)) {
                return res.json({ data: null, message: "Trạng thái không hợp lệ." })
            }
            let shopkeeper = req.body.username;
            if (!shopkeeper) {
                return res.json({ data: null, message: "Chưa xác thực người dùng" })
            }
            if (!_id) {
                return res.json({ data: null, message: "Chưa có id sản phẩm" })
            }
            let result = await OrderService.find({ _id })

            if (!result) {
                return res.json({ data: null, message: "Đơn hàng không tồn tại!" })
            } else {

                result = await OrderService.updateOne({ _id }, { status, updateAt })
            }
            return res.json({ data: result, message: "Cập nhật thành công" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Lỗi cập nhật" })
        }
    },
    async getTotalEarn(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({ _id });

            if (!user) {
                return res.json({ data: null, message: "Không có id người dùng" })
            }
            let shopkeeper = user[0].username
            let result = await OrderService.find({ shopkeeper })
            if (!result) {
                return res.json({ data: null, message: "Bài đăng không tồn tại !" })
            }
            let totalMoney = 0;
            if (result.length != 0) {
                for (let i = 0; i < result.length; i++) {
                    for (let j = 0; j < result[i].product.length; j++) {
                        totalMoney += parseInt(result[i].product[j].quantity) * result[i].product[j].product.price
                    }
                }
            }
            return res.json({ data: totalMoney, message: "Tính toán tổng tiền thu được thành công" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi tính toán tổng tiền thu được" })
        }
    }
}

module.exports = OrderController