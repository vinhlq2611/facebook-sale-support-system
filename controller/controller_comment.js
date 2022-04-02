const { CommentService, PostService, UserService, FacebookService } = require('../services')
const constrain = require('../constraint')
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
            if (scanData.length == 0) {
                return res.json({ data: null, message: "Cookie Hết Hạn, Vui lòng cập nhật" });

            }
            await CommentService.handleScanComment(selectedPost.id, scanData, selectedPost.products)
            // console.log("Scan Comment Response: ", scanData)
            return res.json({ data: true, message: "Tìm comment thành công" });
        } catch (error) {
            console.log("Tìm comment thất bại", error)
            return res.json({ data: null, message: "Tìm comment Thất bại" })

        }
    },
    // Reply comment trên facebook
    async replyComment(req, res) {
        try {
            let content = req.body.content
            let postId = req.body.postId
            let commentId = req.body.commentId
            let [user] = await UserService.find({ username: req.body.username })

            let fb = user.facebook
            if (fb.cookie.status != constrain.CookieStatus.LIVE) {
                return res.json({ data: null, message: "Cập nhật lại cookie và token nha " })

            }
            let result = await FacebookService.createReplyComment(content, postId, commentId, fb.uid, fb.dtsg, fb.cookie.data)
            if (result == null) {
                await UserService.updateOne({ username: req.body.username }, { "facebook.cookie.status": constrain.CookieStatus.DIE })
                return res.json({ data: null, message: "Phản hồi comment thất bại" })
            }
            return res.json({ data: { commentId: result }, message: "Phản hồi thành công" })
        } catch (error) {
            console.log("Tạo replyComment thất bại: ", error)
            return res.json({ data: null, message: "Phản hồi không thành công, vui lòng cập nhật cookie" })
        }

    },
    //  Comment lên bài viết facebook
    async createComment(req, res) {
        let content = req.body.content
        let postId = req.body.postId
        let user = await UserService.find({ username: req.body.username });
        if (user.length == 0) {
            return res.json({ data: null, message: "Không tìm thấy tài khoản" })
        } else {
            let fb = user[0].facebook
            if (fb.cookie.status != constrain.CookieStatus.LIVE) {
                return res.json({ data: null, message: "Cookie hết hạn, vui lòng cập nhật" })
            }
            let result = await FacebookService.createComment(content, postId, fb.uid, fb.dtsg, fb.cookie.data)
            if (result == null) {
                return res.json({ data: null, message: "Cookie hết hạn, vui lòng cập nhật" })
            } else {
                return res.json({ data: result, message: "Chấm thành công" })

            }
        }

    },
    // Lấy Comment Đã lưu trong DB
    async getComment(req, res) {
        let condition = req.query
        let result = await CommentService.find(condition);
        if (result.length == 0) {
            return res.json({ data: null, message: "Không tìm thấy comment nào" })
        }
        else return res.json({ data: result, message: "Quét comment thành công" })
    }

}


module.exports = CommentController