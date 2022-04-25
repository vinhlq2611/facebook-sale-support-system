const logger = require('../config/logger')

function logError(message, data) {
    console.error(`>>> ${message} <<< \n${JSON.stringify(data)}`)
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

function encode(round, data) {
    for (var i = 0; i < round; i++) {
        data = btoa(data)
    }
    return data
}

function decode(round, data) {
    for (var i = 0; i < round; i++) {
        data = atob(data)
    }
    return data
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

    //Remove Vietnamese expression
    keywords.forEach(key => {
        let keyTemp = key;
        keyTemp = keyTemp.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        keyTemp = keyTemp.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        keyTemp = keyTemp.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        keyTemp = keyTemp.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        keyTemp = keyTemp.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        keyTemp = keyTemp.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        keyTemp = keyTemp.replace(/đ/g, "d");
        keyTemp = keyTemp.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        keyTemp = keyTemp.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        keyTemp = keyTemp.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        keyTemp = keyTemp.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        keyTemp = keyTemp.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        keyTemp = keyTemp.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        keyTemp = keyTemp.replace(/Đ/g, "D");
        if (key !== keyTemp) {
            keywords.push(keyTemp);
        }
    });
    console.log(keywords);
    return keywords;
}

module.exports = {
    logError, logWarn, parseData, btoa, atob, genKeyWord, isVietnamesePhoneNumber, encode, decode
}