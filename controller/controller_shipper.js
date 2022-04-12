const { UserService, FacebookService, OrderService } = require("../services");
const { logError, logWarn, isVietnamesePhoneNumber } = require("../utils/index");
const jwt = require("jsonwebtoken");
const ShipperController = {
    async findShipper(req, res) {
        try {
            let shopkeeper = req.body.username
            let keyword = req.query?.keyword ? req.query?.keyword : ""
            let result = null
            console.log(keyword)
            if (keyword == null || keyword == "") {
                result = await UserService.find({ "jobs.owner": { $nin: [shopkeeper] }, type: 0 })
            } else {
                result = await UserService.find({ "jobs.owner": { $nin: [shopkeeper] }, type: 0, username: { $regex: keyword } })
            }

            return res.json({ data: result, message: "Tìm shiper thành công" })
        } catch (error) {
            console.log("Find Shipper Error:", error)
            return res.json({ data: null, message: "Lỗi tìm shipper" });
        }
    },
    async addShipper(req, res) {
        try {
            let shopkeeper = req.body.username;
            let id = req.body.id;
            console.log("ID Shipper: ", id)
            let selectedShipper = await UserService.find({ _id: id });
            if (selectedShipper.length == 0 || selectedShipper[0]?.type != 0) {
                return res.json({ data: null, message: "Shipper không tồn tại" });
            }
            if (selectedShipper[0].jobs && selectedShipper[0].jobs.filter(job => job.owner == shopkeeper).length > 0) {
                return res.json({ data: null, message: "Shipper đang làm việc cho bạn" });
            }

            let result = await UserService.updateOne({ _id: id }, { $push: { jobs: { owner: shopkeeper, createAt: Date.now() } } })
            await UserService.updateOne({ username: shopkeeper }, { $push: { shippers: `${selectedShipper[0].fullname}---${selectedShipper[0].username}` } })
            return res.json({ data: result, message: "Thêm shipper thành công" })
        } catch (error) {
            console.log("Add Shipper Error:", error)
            return res.json({ data: null, message: "Thêm shipper thất bại" });
        }
    },
    async getShipper(req, res) {
        try {
            let keyword = req.query?.keyword ? req.query?.keyword : ""
            let shopkeeper = req.body.username;
            let result = await UserService.find({ "jobs.owner": shopkeeper, username: { $regex: keyword } })
            for (let i = 0; i < result.length; i++) {
                const shipper = result[i];
                let [job] = shipper.jobs.filter(job => job.owner == shopkeeper)
                result[i].jobs = job;
            }
            return res.json({ data: result, message: "Lấy shipper thành công" })
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
    },
    async deleteShipper(req, res) {
        try {
            let shopkeeper = req.body.username;
            let id = req.body.id;
            let [selectedShipper] = await UserService.find({ _id: id })
            let [selectedShopkeeper] = await UserService.find({ username: shopkeeper })
            let newJobs = selectedShipper.jobs.filter(job => job.owner != shopkeeper)
            let newShipper = selectedShopkeeper.shippers.filter(shipper => shipper != `${selectedShipper.fullname}---${selectedShipper.username}`)
            let result = await UserService.updateOne({ _id: id }, { jobs: newJobs })
            await UserService.updateOne({ username: shopkeeper }, { shippers: newShipper })
            return res.json({ data: result, message: "Xóa shipper thành công" })
        } catch (error) {
            console.error("Delete Shipper Error: ", error)
            return res.json({ data: null, message: "Lỗi xóa shipper" });
        }
    },

}
module.exports = ShipperController
