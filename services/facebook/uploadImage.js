var FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const { AttachmentModel } = require('../../models')
const uploadImage = async (fdtsg, uid, fileId) => {
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
        let [file] = await AttachmentModel.find({ _id: fileId })
        let url = file.name
        console.log("File URL: ", url)
        let myFile = fs.readFileSync(url)
        console.log("My file: ", typeof myFile)
        form.append("farr", myFile)

        // console.log(response.data.data)
        // const dataFile = JSON.parse(response.data.replace("for (;;);", ""));
        // console.log(dataFile.payload.group_file_revision_id)
        // return dataFile.payload.group_file_revision_id;
    } catch (error) {
        console.log("Upload Image Facebook Fail", error)
    }
};
uploadImage('AQE3iLT5_1k3wh4:1:1643709527', '100004337133436', "6208c8936c230aac7f5cc9f9")
// module.exports = { UploadImage }