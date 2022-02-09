const logger = require('../config/logger')

function logError(message, data) {
    logger.error(`>>> ${message} <<< \n${JSON.stringify(data)}`)
}

function logWarn(message, data) {
    logger.warn(`>>> ${message} <<< \n${JSON.stringify(data)}`)
}
const parseData = async (dataObject) => {
    let data = "";
    Object.entries(dataObject).forEach((entry) => {
        let [key, value] = entry;
        data +=
            "&" +
            key +
            "=" +
            (typeof value == "object"
                ? encodeURIComponent(JSON.stringify(value))
                : value);
    });
    if (data.charAt(0) === "&") {
        data = data.slice(1);
    }
    return data;
};
function btoa(data) {
    return Buffer.from(data).toString('base64')
};
function atob(data) {
    return console.log(Buffer.from(data, 'base64').toString());

}
module.exports = {
    logError, logWarn, parseData, btoa, atob
}