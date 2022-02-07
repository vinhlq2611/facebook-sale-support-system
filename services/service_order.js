const { OrderModel } = require('../models')// {key}=> Ông chỉ lấy đúng cái key ra thôi => tôi lấy thuộc tính OrderModel của obj Models
// const  OrderModel = require('../models')// key=> Ông lấy cả cái object ra => Tôi lấy obj Models 
const { logError } = require('../utils')

async function find(condition) {//
    try {
        return OrderModel.find(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.Find ", { input: condition, error })
    }
}

async function create(data) {
    try {
        return OrderModel.create(data)
    } catch (error) {
        logError("Lỗi tại OrderService.create ", { input: data, error })
    }
}

async function deleteOne(condition) {
    try {
        return OrderModel.deleteOne(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteOne ", { input: condition, error })
    }
}

async function deleteMany(condition) {
    try {
        return OrderModel.deleteMany(condition)
    } catch (error) {
        logError("Lỗi tại OrderService.deleteMany ", { input: condition, error })
    }
}

async function updateOne(condition, newData) {
    try {
        return OrderModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateOne ", { input: condition, error })
    }
}

async function updateMany(condition, newData) {
    try {
        return OrderModel.updateOne(condition, newData)
    } catch (error) {
        logError("Lỗi tại OrderService.updateMany ", { input: condition, error })
    }
}

module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany
}