const logger = require('../config/logger')

function logError(message, data) {
    logger.error(`>>> ${message} <<< \n${JSON.stringify(data)}`)
}

function logWarn(message, data) {
    logger.warn(`>>> ${message} <<< \n${JSON.stringify(data)}`)
}
module.exports = {
    logError, logWarn
}