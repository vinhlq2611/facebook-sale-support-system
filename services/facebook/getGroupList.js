const { logError, parseData, btoa, atob } = require('../../utils')
const axios = require('axios')

const getGroupList = async (token, cookie) => {

    let groupList = []
    let api = `https://graph.facebook.com/me/groups?limit=500&access_token=${token}`

    try {
        let responseData = await axios({
            method: 'GET',
            url: api,
            headers: { 'Cookie': cookie }
        })
        responseData.data.data.map(group => {
            groupList.push({ name: group.name, groupId: group.id })
        })
        return groupList
    } catch (error) {
        logError("Lỗi tại Facebook.listGroup ", { input: { token }, error })
        console.log("Get Group List Fail: ", error.message, api);
        return [];
    }
};

module.exports = {
    getGroupList
}