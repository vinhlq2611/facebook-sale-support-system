const { AccountModel } = require('../models')
const { logError } = require('../utils')

async function find(condition) {
    try {
        return AccountModel.find(condition)
    } catch (error) {
        console.error("Lỗi tại AccountService.Find ", { input: condition, error })
    }
}

async function create(data) {
    try {
        return AccountModel.create(data)
    } catch (error) {
        console.error("Lỗi tại AccountService.create ", { input: data, error })
    }
}
module.exports = {
    find, create
}