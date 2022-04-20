const FormData = require('form-data')
const requestFile = require('request')
const axios = require('axios')
// const ModelError = require('../../models/model_error')

const parseData = async (dataObject) => {
    let data = '';
    Object.entries(dataObject).forEach(entry => {
        let [key, value] = entry;
        data += '&' + key + '=' + (typeof (value) == "object" ? encodeURIComponent(JSON.stringify(value)) : value);
    });
    if (data.charAt(0) === '&') {
        data = data.slice(1)
    }
    return data
};

const uploadImage = async (dtsg, uid, groupId, cookie, imageUrl) => {
    const queryStringUrlImage = await parseData({
        av: uid,
        profile_id: groupId,
        target_id: groupId,
        __user: uid,
        __a: 1,
        fb_dtsg: dtsg,
        source: 10,
    })
    let dataImage = new FormData();
    dataImage.append('file', requestFile(imageUrl))
    let headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": `multipart/form-data; boundary=${dataImage['_boundary']}`,
        "pragma": "no-cache",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "viewport-width": "1104",
        cookie: cookie,
        common: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        },
    };
    const getImageUrl = `https://www.facebook.com/ajax/ufi/upload/?${queryStringUrlImage}`;

    let response = await axios.request({
        url: getImageUrl,
        method: 'post',
        headers: headers,
        data: dataImage,
        mode: 'cors',
        referrerPolicy: 'strict-origin-when-cross-origin',
    });
    try {
        data = JSON.parse(response.data.replace('for (;;);', ''));
        return data.payload.fbid;
    } catch (error) {
        console.log(error)
        console.log(response.data)
        // ModelError.create({
        //     code: "UPLOAD_IMAGE_FAIL",
        //     message: error.message,
        //     stack: error.stack,
        //     input: { dtsg, uid, cookie, imageUrl },
        //     output: comment.data
        // })

        return null
    }
}

// (async () => {
//     const postId = await getImageID(
//         "AQHmAYxpR4IFja4:42:1650167204",
//         "100004337133436",
//         "877660292889767",
//         "sb=xkcxYlupEOw5l_8n-7i09J_2; oo=v1; m_pixel_ratio=1; usida=eyJ2ZXIiOjEsImlkIjoiQXJhYnBydXVrcTd5aiIsInRpbWUiOjE2NDk5Mjk1MzB9; wd=1536x722; datr=fI1bYpICd6tzLlqUgOj1SwT-; c_user=100004337133436; dpr=1; xs=42%3ABWbDeyvjzEQ_ww%3A2%3A1650167204%3A-1%3A6382%3A%3AAcVj0oqQhC3eDoEkBrJwekIvRge_oYMtuikTGBr2Dvc; presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22u.100271182674491%22%7D%2C%7B%22i%22%3A%22u.100003908182982%22%7D%2C%7B%22i%22%3A%22u.100007270537619%22%7D%2C%7B%22i%22%3A%22u.100004603997082%22%7D%2C%7B%22i%22%3A%22u.100009911523867%22%7D%2C%7B%22i%22%3A%22g.4516967591697103%22%7D%5D%2C%22utc3%22%3A1650460715332%2C%22lm3%22%3A%22u.100006061596896%22%2C%22v%22%3A1%7D; fr=0MrcbHS5EgIGMpjzX.AWUMGE24ZmjWZtyYMRebbY6__S0.BiYAbc.5K.AAA.0.0.BiYAgs.AWUdPGV0I38",
//         "https://api-3sf.amaitechnology.com/images/165046054580982b64deba17ba8fa7424462bd75fadfc.jpg"
//     )
//     console.log(test)

// })()

module.exports = { uploadImage }