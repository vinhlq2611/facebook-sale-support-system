const { logError, parseData, btoa, atob } = require('../../utils')
const axios = require('axios')

const getGroupList = async (cookie, token) => {
    try {
        let header = {
            'Cookie': cookie
        }
        let groupList = []
        let api = `https://graph.facebook.com/me/groups?limit=500&access_token=${token}`
        let responseData = await axios({
            method: 'GET',
            url: api,
            headers: header
        })
        responseData.data.data.map(group => {
            groupList.push({ name: group.name, groupId: group.id })
        })
        return groupList
    } catch (error) {
        console.error("Lỗi tại Facebook.listGroup ", { input: { token }, error })
        console.log("Get Group List Fail: ", token, error.message);
        return [];
    }
};

module.exports = {
    getGroupList
}