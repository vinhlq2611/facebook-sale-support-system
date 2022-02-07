const axios = require('axios');
const { logError } = require('../../utils')
const getGroupPost = async (token, limit, groupId) => {
    try {
        let postData = await axios(
            `https://graph.facebook.com/${groupId}/feed?limit=${limit}&access_token=${token}`
        ).then(response => response.data.data);
        let postId = postData.map((post) => post.id.split('_')[1]);
        console.log("Post Data: ", postId);
        return postId;
    } catch (error) {
        logError("Lỗi tại Facebook.getGroupPost ", { input: { token, limit, groupId }, error })
        return [];
    }
};
module.exports = {
    getGroupPost
}