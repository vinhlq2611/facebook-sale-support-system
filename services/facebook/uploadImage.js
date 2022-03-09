var FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
// const { AttachmentModel } = require('../../models')
const uploadImage = async (cookie, fdtsg, uid, url) => {
    try {
        const form = new FormData();
        let query = [
            "av" + "=" + uid,
            "__user" + "=" + uid,
            "__a" + "=" + 1,
            "fb_dtsg" + "=" + fdtsg,
        ];
        form.append("source", 8)
        form.append("profile_id", uid)
        form.append("upload_id", 'jsc_c_7h')

        const rp = await axios(url);
        let dataBlob = await rp.blob()
        let metadata = {
            type: fileGet.fileType
        };
        let file = new File([dataBlob], fileGet.fileName, metadata);
        appendForm(form, _string.__farr.__decode(), file);
        const response = await axios({
            method: _string.__method_post.__decode(),
            url: _url.__fb_upload_ajax_react.__decode() + query.join('&'),
            header: { Cookie: cookie },
            data: form,
        })
        const dataImage = JSON.parse(response.data.replace('for (;;);', ''))
        return dataImage.payload.photoID

        // console.log(response.data.data)
        // const dataFile = JSON.parse(response.data.replace("for (;;);", ""));
        // console.log(dataFile.payload.group_file_revision_id)
        // return dataFile.payload.group_file_revision_id;
    } catch (error) {
        console.log("Upload Image Facebook Fail", error)
    }
};
const cookie = 'sb=oQUmYpp26HKsxp2q-gjF4V9A;datr=oQUmYikJzLMFR5Fvp_flQlL3;locale=vi_VN;c_user=100004337133436;wd=1536x772;xs=47%3AVXsLMaak5gf7RA%3A2%3A1646660366%3A-1%3A6383%3A%3AAcVM6c_RlEbtxh08jR5vPaLe2QYi0Kg-WZypo5-f4Tw;fr=0rKHCjHwxQXbcjwkh.AWW2R0ZdPfEKFMdajNwj0i7MS70.BiKCXY.Lg.AAA.0.0.BiKCXY.AWX1jA_y07Y;dpr=1.25;presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22u.100004324981408%22%7D%2C%7B%22i%22%3A%22g.4516967591697103%22%7D%2C%7B%22i%22%3A%22u.100012194797702%22%7D%2C%7B%22i%22%3A%22u.100006114153848%22%7D%2C%7B%22i%22%3A%22g.4871142552965040%22%7D%2C%7B%22i%22%3A%22u.100003908182982%22%7D%2C%7B%22i%22%3A%22u.100006061596896%22%7D%2C%7B%22i%22%3A%22u.105275368375267%22%7D%2C%7B%22i%22%3A%22u.100004337133436%22%7D%2C%7B%22i%22%3A%22u.100007966030347%22%7D%2C%7B%22i%22%3A%22g.4832067653507691%22%7D%5D%2C%22utc3%22%3A1646801662784%2C%22lm3%22%3A%22u.100005946405019%22%2C%22v%22%3A1%7D;'
uploadImage(cookie, 'AQFuH5_bphZSEDk:47:1646660366', '100004337133436', "https://i.pinimg.com/736x/78/90/e1/7890e13d8985d3a5360e3e62831575fd.jpg")
// module.exports = { UploadImage }