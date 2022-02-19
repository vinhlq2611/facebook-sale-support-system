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

            let scanData = await FacebookService.scanPostComment(selectedPost.group.groupId, selectedPost.fb_id, userFb.uid, userFb.dtsg, userFb.cookie.data)
            console.log("Scan Data Response: ", scanData);
            return res.json({ data: scanData, message: "Tìm comment thành công" });
        } catch (error) {
            logError("Login Error", error)
            return res.json({ data: error, message: "Tìm comment Thất bại" })

        }
    },


}


module.exports = CommentController