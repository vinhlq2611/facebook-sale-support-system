const { getGroupPost } = require('./getGroupPost')
const { getGroupList } = require('./getGroupList')
const { getUserInfo } = require('./getUserInfo')
const { scanPostComment } = require('./scanPostComment')
const { uploadPost } = require('./uploadPost')
module.exports = {
    getGroupPost, getGroupList, getUserInfo, scanPostComment, uploadPost
}