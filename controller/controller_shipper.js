const {UserService,FacebookService}= require("../services");
const { logError, logWarn, isVietnamesePhoneNumber } = require("../utils/index");
const jwt = require("jsonwebtoken");
const ShipperController ={
    async findShipper(req, res) {
        try {
            let shopkeeper=req.body.username
            let keyword=req.query.keyword
            let result=null
            console.log(keyword)
            if (keyword == null || keyword == ""){
                 result=await UserService.find({owner:{$nin:[shopkeeper]},type:0})
            }else{
                result=await UserService.find({owner:{$nin:[shopkeeper]},type:0,username:{$regex: keyword}})
            }
            
            return res.json({ data: result, message: "Get Shipper Success" })
        } catch (error) {
            return res.json({ data: error, message: "Get Shipper Error" });
        }
    },
    async addShipper(req, res){
        try {
            let shopkeeper = req.body.username;
            let id=req.body.id;
            let result=await UserService.updateOne({_id: id},{ $push: { owner: shopkeeper } })
            return res.json({ data: result, message: "Get Shipper Success" })
        } catch (error) {
            
            return res.json({ data: error, message: "Get Shipper Error" });
        }
    },
    async getShipper(req, res) {
        try {
            let keyword=req.query.keyword
            
            let shopkeeper = req.body.username;
            let result=await UserService.find({owner: shopkeeper,username:{$regex: keyword}})
            return res.json({ data: result, message: "Get Shipper Success" })
        } catch (error) {
            
            return res.json({ data: error, message: "Get Shipper Error" });
        }
              

    },
    async getShipperDetails(req, res) {
        try {
            let id = req.body.id;
            let result=await UserService.find({_id: id})
            return res.json({ data: result, message: "Get Shipper Success" })
        } catch (error) {
            
            return res.json({ data: error, message: "Get Order Error" });
        }
    },
    async deleteShipper(req, res) {
        try {
            let shopkeeper = req.body.username;
            let id=req.body.id;
            let result=await UserService.updateOne({_id: id},{ $pull: { owner: shopkeeper } })
            return res.json({ data: result, message: "Delete Shipper Success" })
        } catch (error) {
            
            return res.json({ data: error, message: "Delete Shipper Error" });
        }
    },
    
}
module.exports = ShipperController
