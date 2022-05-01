const { UserService, FacebookService, OrderService } = require("../services");
const { logError, logWarn, isVietnamesePhoneNumber } = require("../utils/index");
const jwt = require("jsonwebtoken");
const { JobModel } = require("../models");
const ShipperController = {
    async findShipper(req, res) {
        try {
            let shopkeeper = req.body.username
            let keyword = req.query?.keyword || ""
            let result = null
            let userJob = await JobModel.find({ 'shopkeeper.username': shopkeeper })
            let ignoreList = userJob.map(job => job.shipper.username)
            result = await UserService.find({ username: { $nin: [ignoreList] }, type: 0, username: { $regex: keyword } })
            for (let shipper of result) {
                let JobCount = JobModel.find({ 'shipper.username': shipper.username })
                shipper.ownerCount = JobCount.length
            }
            return res.json({ data: result, message: "Tìm shiper thành công" })
        } catch (error) {
            console.log("Find Shipper Error:", error)
            return res.json({ data: null, message: "Lỗi tìm shipper" });
        }
    },
    async inviteShipper(req, res) {
        try {
            let shopkeeper = req.body.username;
            let id = req.body.id;
            let content = req.body.content;
            let selectedShipper = await UserService.find({ _id: id });
            let selectedShopkeeper = await UserService.find({ username: shopkeeper });
            if (selectedShipper.length == 0 || selectedShipper[0]?.type != 0) {
                return res.json({ data: null, message: "Shipper không tồn tại" });
            }
            if (selectedShopkeeper.length == 0 || selectedShopkeeper[0]?.type != 1) {
                return res.json({ data: null, message: "Người bán không tồn tại" });
            }
            let isExist = await JobModel.findOne({ 'shipper.username': selectedShipper[0].username, 'shopkeeper.username': shopkeeper });
            if (isExist) {
                return res.json({ data: isExist, message: "Bạn đã từng mời shipper này" })
            }
            let job = await JobModel.create({ shipper: selectedShipper[0], shopkeeper: selectedShopkeeper[0], content })
            return res.json({ data: job, message: "Mời shipper thành công" })
        } catch (error) {
            console.log("Add Shipper Error:", error)
            return res.json({ data: null, message: "Mời  shipper thất bại" });
        }
    },
    async updateJob(req, res) {
        try {
            let shopkeeper = req.body.shopkeeper || req.body.username;
            let shipper = req.body.shipper;
            let newStatus = req.body.status;
            console.log(req.body)
            let [selectedShipper] = await UserService.find({ username: shipper });
            let [selectedShopkeeper] = await UserService.find({ username: shopkeeper });
            if (!selectedShipper || selectedShipper.type != 0) {
                return res.json({ data: null, message: "Shipper không tồn tại" });
            }
            if (!selectedShopkeeper || selectedShopkeeper.type != 1) {
                return res.json({ data: null, message: "Chủ cửa hàng không tồn tại" });
            }
            let job = await JobModel.findOne({ 'shipper.username': shipper, 'shopkeeper.username': shopkeeper })
            if (!job) {
                return res.json({ data: null, message: "Không tìm thấy công việc phù hợp" });
            }
            switch (newStatus) {
                case 'reject':
                    let result = await JobModel.deleteOne({ _id: job.id });
                    return res.json({ data: result, message: "Từ chối công việc thành công" });

                case 'accepted':
                    let result1 = await JobModel.updateOne({ _id: job.id }, { status: 'accepted' });
                    return res.json({ data: result1, message: "Thêm công việc thành công" });
                default: return res.json({ data: null, message: "Trạng thái công việc không hợp lệ" })
            }
        } catch (error) {
            console.log("Add Shipper Error:", error)
            return res.json({ data: null, message: "Cập nhật công việc thất bại" });
        }
    },
    async getJob(req, res) {
        try {
            let username = req.body.username;
            let [user] = await UserService.find({ username });
            if (!user) {
                return res.json({ data: null, message: "Không tìm thấy người dùng" });
            }
            let result = []
            if (user.type == 0) {
                result = await JobModel.find({ 'shipper.username': username, status: 'accepted' })
            } else {
                result = await JobModel.find({ 'shopkeeper.username': username, status: 'accepted' })
            }
            return res.json({ data: result, message: "Lấy dữ liệu công việc thành công" });
        } catch (error) {
            console.log("Get job fail: ", error)
            return res.json({ data: result, message: "Lấy dữ liệu công việc thất bại" });

        }

    },
    async getShipper(req, res) {
        try {
            let keyword = req.query?.keyword ? req.query?.keyword : ""
            let shopkeeper = req.body.username;
            let result = await JobModel.find({ "shopkeeper.username": shopkeeper, "shipper.username": { $regex: keyword } })
            let shipperList = []
            for (let i = 0; i < result.length; i++) {
                let shipper = result[i].shipper;
                let [job] = shipper.jobs.filter(job => job.owner == shopkeeper)
                result[i].shipper.jobs = job;
                result[i].shipper.createAt = result[i].status == 'accepted' ? result[i].createAt : 'Chưa đồng ý'
                shipperList.push(shipper)
            }
            return res.json({ data: shipperList, message: "Lấy shipper thành công" })
        } catch (error) {
            console.log("Get Shipper Error:", error)
            return res.json({ data: null, message: "Lỗi lấy shipper" });
        }

    },
    // Total Order Of Shipper
    async getShipperDetails(req, res) {
        try {
            let id = req.body.id;
            let [selectedShipper] = await UserService.find({ _id: id })
            if (selectedShipper) {
                let orderList = await OrderService.find({ shipper: selectedShipper.username }, {})
                let totalSalary = 0;
                for (const order of orderList) {
                    totalSalary += order.shipCost
                }
                return res.json({ data: { orderCount: orderList.length, totalSalary }, message: "Lấy thông tin chi tiết shipper thành công" })
            }
            return res.json({ data: null, message: "Lấy thông tin chi tiết shipper thất bại" })
        } catch (error) {
            console.error("Get Shipper Detail Error: ", error)
            return res.json({ data: null, message: "Lỗi lấy thông tin chi tiết shipper" });
        }
    }

}
module.exports = ShipperController
