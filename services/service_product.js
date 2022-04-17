const { ProductModel } = require('../models')
const { logError } = require('../utils')

async function find(condition) {
    try {
        return ProductModel.find(condition)
    } catch (error) {
        console.error("Lỗi tại ProductService.Find ", { input: condition, error })
    }
}

async function create(data) {
    try {
        return ProductModel.create(data)
    } catch (error) {
        console.error("Lỗi tại ProductService.create ", { input: data, error })
    }
}

async function deleteOne(condition) {
    try {
        return ProductModel.deleteOne(condition)
    } catch (error) {
        console.error("Lỗi tại ProductService.deleteOne ", { input: condition, error })
    }
}

async function deleteMany(condition) {
    try {
        return ProductModel.deleteMany(condition)
    } catch (error) {
        console.error("Lỗi tại ProductService.deleteMany ", { input: condition, error })
    }
}

async function updateOne(condition, newData) {
    try {
        return ProductModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại ProductService.updateOne ", { input: condition, error })
    }
}

async function updateMany(condition, newData) {
    try {
        return ProductModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại ProductService.updateMany ", { input: condition, error })
    }
}

// Phân trang

module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany
}