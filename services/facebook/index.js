const { getGroupPost } = require('./getGroupPost')
const { getGroupList } = require('./getGroupList')
const { getUserInfo } = require('./getUserInfo')
const { scanPostComment } = require('./scanPostComment')
const { uploadPost } = require('./uploadPost')
const { createReplyComment } = require('./createReplyComment')
const { createComment } = require('./createComment')
const { disableComment } = require('./disableComment')
module.exports = {
    getGroupPost, getGroupList, getUserInfo, scanPostComment, uploadPost, createReplyComment, createComment, disableComment
}