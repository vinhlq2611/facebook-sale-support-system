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
function isVietnamesePhoneNumber(number) {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/g.test(number);
}
function btoa(data) {
    return Buffer.from(data).toString('base64')
};
function atob(data) {
    return Buffer.from(data, 'base64').toString();

}
function genKeyWord(productName) {
    let nameSplit = productName.trim().split(' ');
    let keywords = [];
    let keyword = '';
    //1st case : not change
    keywords.push(productName);
    //2nd case : all short form
    nameSplit.forEach(name => {
        keyword += name.charAt(0);
    })
    keywords.push(keyword);
    keyword = '';
    //3rd case : first word short (include space)
    for (let index = 0; index < nameSplit.length; index++) {
        keyword += index == 0 ? nameSplit[index].charAt(0) : " " + nameSplit[index];
    }
    if (keywords.indexOf(keyword) == -1) {
        keywords.push(keyword);
    }
    if (keywords.indexOf(keyword.replace(" ", '')) == -1) {
        keywords.push(keyword.replace(" ", ''));
    }
    keyword = '';
    //4th case : only last word not change (include space)
    for (let index = 0; index < nameSplit.length; index++) {
        keyword += index != nameSplit.length - 1 ? nameSplit[index].charAt(0) : " " + nameSplit[index];
    }
    if (keywords.indexOf(keyword) == -1) {
        keywords.push(keyword);
    }
    if (keywords.indexOf(keyword.replace(" ", '')) == -1) {
        keywords.push(keyword.replace(" ", ''));
    }
    return keywords;
}

module.exports = {
    logError, logWarn, parseData, btoa, atob, genKeyWord, isVietnamesePhoneNumber
}