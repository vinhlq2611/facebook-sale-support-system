const FormData = require('form-data')
const requestFile = require('request')
const axios = require('axios')

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

const getImageID = async () => {
    const queryStringUrlImage = await parseData({
        av: '100008151106819',
        profile_id: '100008151106819',
        target_id: '100008151106819',
        __user: '100008151106819',
        __a: 1,
        fb_dtsg: 'AQFYHvlBEtHm5Qk:36:1646126834',
        source: 19,
    })
    let dataImage = new FormData();
    dataImage.append('file', requestFile('https://pe-images.s3.amazonaws.com/basics/cc/image-size-resolution/resize-images-for-print/image-cropped-8x10.jpg'))
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
        cookie: 'sb=Ok3pX2JLbOwCAhwzChOl6ruC; _fbp=fb.1.1613443429116.1159479348; datr=hY2TYFesawmFk7eXitiiorbG; dpr=0.8999999761581421; c_user=100008151106819; xs=36%3AohpX9SPHZ3t7tA%3A2%3A1646126834%3A-1%3A6381%3A%3AAcU89Vg0gxR1qqJGhkXWbP0Ey4iPEea0-LKBHZvVvUE; cppo=1; wd=1920x902; fr=0GvO75y8B2U3jTE97.AWVYznOra_EJKEVzK0-npJq2EhU.BiKWO9.cL.AAA.0.0.BiKWo4.AWVHyKodA8A; presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1646881469539%2C%22v%22%3A1%7D; usida=eyJ2ZXIiOjEsImlkIjoiQXI4aWNvczF3amk0bWMiLCJ0aW1lIjoxNjQ2ODgxNTk3fQ%3D%3D',
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
    comment = JSON.parse(comment.data.replace('for (;;);', ''));
    return comment.payload.fbid;
}

(async () => {
    const test = await getImageID()
    console.log(test)

})()

