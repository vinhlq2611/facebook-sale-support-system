const FormData = require('form-data')
const requestFile = require('request')
const axios = require('axios')
const ModelError = require('../../models/model_error')

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

const getImageID = async (dtsg, uid, cookie, imageUrl) => {
    const queryStringUrlImage = await parseData({
        av: uid,
        profile_id: uid,
        target_id: uid,
        __user: uid,
        __a: 1,
        fb_dtsg: dtsg,
        source: 19,
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

    let comment = await axios.request({
        url: getImageUrl,
        method: 'post',
        headers: headers,
        data: dataImage,
        mode: 'cors',
        referrerPolicy: 'strict-origin-when-cross-origin',
    });
    try {
        commentcomment = JSON.parse(comment.data.replace('for (;;);', ''));
        return comment.payload.fbid;
    } catch (error) {
        ModelError.create({
            code: "UPLOAD_IMAGE_FAIL",
            message: error.message,
            stack: error.stack,
            input: { dtsg, uid, cookie, imageUrl },
            output: comment.data
        })
        return null
    }
}

(async () => {
    const test = await getImageID()
    console.log(test)

})()

