const { CommentModel } = require('../models');
const { CommentService, PostService, UserService, FacebookService } = require('../services')
const { logError, logWarn } = require('../utils/index')
const CommentController =
{
    // Quét Comment bài viết trên facebook
    async scanComment(req, res) {
        try {
            // Nhận dữ liệu từ request
            let postId = req.body.postId;
            let username = req.body.username;
            let [selectedPost] = await PostService.find({ _id: postId });
            let [user] = await UserService.find({ username: username });
            if (!selectedPost || !user) {
                return res.json({ message: "Không tìm thấy bài viết phù hợp", data: null })
            }
            let userFB = user.facebook;
            if (!userFB || !userFB.cookie?.data || !userFB.dtsg || !userFB.uid) {
                return res.json({ message: "Cookie hết hạn, vui lòng nhập lại", data: null })
            }

            if (!selectedPost.group.groupId || !selectedPost.fb_id) {
                return res.json({ message: "Không tìm thấy bài viết trên facebook, vui lòng kiểm tra lại", data: null })
            }
            let scanData = await FacebookService.scanPostComment(selectedPost.group.groupId, selectedPost.fb_id, userFB.uid, userFB.dtsg, userFB.cookie.data)
            await handleScanComment(selectedPost.id, scanData)
            return res.json({ message: "Tìm comment thành công" });
        } catch (error) {
            console.log("Tìm comment thất bại", error)
            return res.json({ data: error, message: "Tìm comment Thất bại" })

        }
    },
    async getComment(req, res) {
        let condition = req.query
        let result = await find(condition);
        if (result.length == 0) {
            return res.json({ data: null, message: "Không tìm thấy comment nào" })
        }
        else return res.json({ data: result, message: "Quét comment thành công" })
    }

}
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! CÁCH FUNCTION HỖ TRỢ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
async function handleScanComment(postId, facebookCommentList) {
    let threadList = []
    for (let fbComment of facebookCommentList) {
        threadList.push(addComment(postId, fbComment, null))
        if (fbComment.childs.length > 0) {
            for (const child of fbComment.childs) {
                threadList.push(addComment(postId, child, fbComment.fb_id))
            }
        }
        if (threadList.length > 20) {
            await Promise.all(threadList);
            threadList = []
        }
    }
    await Promise.all(threadList);
    threadList = []
}
async function addComment(postId, comment, parentId) {
    let doc = {
        fb_id: comment.fb_id,
        post_id: postId,
        author: comment.author,
        content: comment.content,
        parentId: parentId,
        type: 0
    }
    let isExist = await CommentModel.find({ fb_id: doc.fb_id })
    if (isExist.length > 0) {
        if (isExist[0].content != doc.content) {
            await CommentModel.updateOne({ fb_id: doc.fb_id }, { content: doc.content, type: 0 })
        }
        return
    } else {
        await CommentModel.create(doc)
        return
    }
}
async function find(condition) {
    return CommentModel.find(condition)
}

module.exports = CommentController