const { PostModel } = require('../models')
const { logError } = require('../utils')

async function find(condition) {
    try {
        return PostModel.find(condition)
    } catch (error) {
        console.error("Lỗi tại PostService.Find ", { input: condition, error })
    }
}

async function create(data) {
    try {
        return PostModel.create(data)
    } catch (error) {
        console.error("Lỗi tại PostService.create ", { input: data, error })
    }
}

async function deleteOne(condition) {
    try {
        return PostModel.deleteOne(condition)
    } catch (error) {
        console.error("Lỗi tại PostService.deleteOne ", { input: condition, error })
    }
}

async function deleteMany(condition) {
    try {
        return PostModel.deleteMany(condition)
    } catch (error) {
        console.error("Lỗi tại PostService.deleteMany ", { input: condition, error })
    }
}

async function updateOne(condition, newData) {
    try {
        return PostModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại PostService.updateOne ", { input: condition, error })
    }
}

async function updateMany(condition, newData) {
    try {
        return PostModel.updateOne(condition, newData)
    } catch (error) {
        console.error("Lỗi tại PostService.updateMany ", { input: condition, error })
    }
}

// Phân trang

module.exports = {
    find, create, deleteOne, deleteMany, updateOne, updateMany
}