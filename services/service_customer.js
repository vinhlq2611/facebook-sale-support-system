const { CustomerModel } = require('../models')// {key}=> Ông chỉ lấy đúng cái key ra thôi => tôi lấy thuộc tính UserModel của obj Models
// const  UserModel = require('../models')// key=> Ông lấy cả cái object ra => Tôi lấy obj Models 
const { logError } = require('../utils')

async function find(condition) {//
    try {
        return CustomerModel.find(condition)
    } catch (error) {
        console.error("Lỗi tại OrderService.Find ", { input: condition, error })
        return null
    }
}

async function create(data) {
    try {
        return CustomerModel.create(data)
    } catch (error) {
        console.error("Lỗi tại OrderService.create ", { input: data, error })
        return null
    }
}

async function deleteOne(condition) {
    try {
        return CustomerModel.deleteOne(condition)
    } catch (error) {
        console.error("Lỗi tại OrderService.deleteOne ", { input: condition, error })
        return null
    }
}

async function deleteMany(condition) {
    try {
        return CustomerModel.deleteMany(condition)
    } catch (error) {
        console.error("Lỗi tại OrderService.deleteMany ", { input: condition, error })
        return null
    }
}

async function updateOne(condition, newData) {
    try {
        return CustomerModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại OrderService.updateOne ", { input: condition, error })
        return null
    }
}

async function updateMany(condition, newData) {
    try {
        return CustomerModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại OrderService.updateMany ", { input: condition, error })
        return null
    }
}
async function aggregate(condition){
    try {
        return CustomerModel.aggregate(condition);
    } catch (error) {
        console.error("Lỗi tại CustomerService.updateMany ", { input: condition, error })
        return null
    }
}
// Phân trang

module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany,aggregate,
}