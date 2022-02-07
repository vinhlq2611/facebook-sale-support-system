const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { logError } = require('../../utils')
const getDtsg = async (cookie) => {
    try {
        const dtsgRegex = /\[\"dtsg\"\,\[\]\,\{\"token\"\:\"([^\"]+)\"\}/m;
        data = await axios("https://m.facebook.com/me", {
            headers: {
                Cookie: cookie
            }
        }).then(
            async (response) => {
                let dom = response.data + "";
                const dtsgMatch = dom.match(dtsgRegex);
                let $ = cheerio.load(dom);
                console.log("Response: ", $('input[name=fb_dtsg]').attr('value'))
                return $('input[name=fb_dtsg]').attr('value');
            }
        );
        console.log("DSTG: ", data)
        return data;
    } catch (error) {
        logError("Lỗi tại Facebook.getDtsg ", { input: cookie, error })
        return null;

    }
};

const getToken = async (cookie) => {
    try {
        let token = await axios(
            "https://business.facebook.com/business_locations", {
            headers: {
                Cookie: cookie
            }
        }
        ).then(async (response) => {
            let dom = response.data + "";
            fs.writeFileSync('facebook_business.html', dom)
            let startIndex = dom.indexOf("EAAG");
            let endIndex = dom.indexOf('"', startIndex);
            return dom.slice(startIndex, endIndex);
        });
        console.log("Token: ", token);
        return token
    } catch (error) {
        logError("Lỗi tại Facebook.getToken ", { input: cookie, error })
        return null
    }
}

const getUid = (cookie) => {
    try {
        let array = cookie.split(';')
        let [uid] = array.filter((attr) => { return (attr + "").indexOf("c_user=") > -1 })
        uid = uid.replace('c_user=', '')
        console.log("UID: ", uid);
        return uid
    } catch (error) {
        logError("Lỗi tại Facebook.getUid ", { input: cookie, error })
        return null
    }
}

const getUserInfo = async (cookie) => {
    if (cookie.status === 1) {
        try {
            let dtsg = await getDtsg(cookie)
            let token = await getToken(cookie)
            let uid = await getUid(cookie)
            let isSuccess = (dtsg == null || token == null || uid == null) ? false : true
            return {
                isSuccess, data: { dtsg, token, uid }
            }
        } catch (error) {
            logError("Lỗi tại Facebook.getUserInfo ", { input: cookie, error })
            return { isSuccess: false, data: null }
        }
    }
}

module.exports = {
    getUserInfo
}