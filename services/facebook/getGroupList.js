const { logError, parseData, btoa, atob } = require('../../utils')
const axios = require('axios')

const getGroupList = async (token) => {
    try {

        let groupList = []
        let api = `https://graph.facebook.com/me/groups?access_token=${token}`
        let responseData = await axios.get(api)
        responseData.data.data.map(group => {
            groupList.push({ name: group.name, groupId: group.id })
        })
        console.log("GET GROUP LIST RESPONSE: ", groupList)
        return groupList
    } catch (error) {
        logError("Lỗi tại Facebook.listGroup ", { input: { token }, error })
        console.log("Get Group List Fail: ", token, error);
        return [];
    }
};

module.exports = {
    getGroupList
}