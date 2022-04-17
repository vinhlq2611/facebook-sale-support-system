const { PostService, UserService, FacebookService, ProductService, OrderService } = require('../services')
const { logError, logWarn } = require('../utils/index')
const { uploadFile } = require('../middleware/upload');
const { Console } = require('winston/lib/winston/transports');
const utils = require('nodemon/lib/utils');
const { AttachmentModel } = require('../models')
const util = require('util')
const path = require('path')

const PostController = {
    async create(req, res) {
        try {
            let username = req.body.username;
            let content = req.body.content;
            let attachments = req.body.attachments;
            let group = req.body.group;
            let products = req.body.products;
            let shipCost = req.body.shipCost ? req.body.shipCost : 3000;
            console.log(req.body)
            // CHECK EMPTY INPUT
            if (!username || !content || !group.groupId || !products) {
                return res.json({ data: null, message: "Chưa đủ thông tin" })
            }
            let product = await ProductService.find({ _id: { $in: products } })
            let activePost = await PostService.find({ status: 1 });
            if (activePost.lenght > 3) {
                return res.json({ data: null, message: "Đã Đạt Số Lượng Chiến Dịch Tối Đa, Không Thể Tạo THêm!" })
            }

            let [UserData] = await UserService.find({ username });
            let fbData = await UserData.facebook
            console.log("User Facebook Data: ", fbData)
            let UploadData = await FacebookService.uploadPost(fbData.dtsg, fbData.uid, fbData.cookie.data, content, group.groupId)
            if (UploadData.data != null) {
                console.log("Facebook Post Upload Response: ", { UploadData })
                let createdPost = await PostService.create(
                    {
                        username,
                        content,
                        attachment: attachments.length > 0 ? attachments : [],
                        group,
                        products: product,
                        shipCost,
                        fb_id: UploadData.data.postId,
                        fb_url: UploadData.data.url
                    })
                // await PostService.updateOne({ _id: createdPost.id }, {})
                return res.json({ data: createdPost, message: "Tạo bài đăng thành công" })
            }
            else return res.json({
                data: null, message: "Tạo Post Thất Bại"
            })
        } catch (error) {
            console.log("Create Post Error", error)
            return res.json({ data: null, message: "Lỗi tạo bài đăng" })
        }
    },
    async getPost(req, res) {
        try {
            let condition = req.query;
            let selectedPostList = await PostService.find({ ...condition, username: req.body.username })
            if (selectedPostList.length == 0) {
                return res.json({ data: null, message: "Không  tìm thấy bài viết nào" })
            }
            for (let i = 0; i < selectedPostList.length; i++) {
                let post = selectedPostList[i];
                for (let j = 0; j < post.attachment.length; j++) {
                    let image = post.attachment[j];
                    let imageData = await AttachmentModel.findOne({ _id: image })
                    let splitOn = String.fromCharCode(0134);
                    post.attachment[j] = imageData.name.split(splitOn).join("/");
                }
            }
            // console.log('Post Found Data: ', selectedPostList)

            return res.json({ data: selectedPostList, message: "Tìm bài viết thành công" })
        } catch (error) {
            console.error("Get Post Error", error)
            return res.json({ data: error, message: "Lỗi nhận bài đăng" })
        }
    },
    async edit(req, res) {
        try {
            let fb_id = req.body.fb_id;
            let content = req.body.content;
            let attachments = req.body.attachments;
            let username = req.body.username;
            if (!fb_id | !content && !attachments) {
                return res.json({ data: null, message: "Bài đăng chưa đủ thông tin " })
            }
            let [result] = await PostService.find({ fb_id })
            if (!result) {
                return res.json({ data: null, message: "Bài đăng không tồn tại !" })
            } else {
                if (result.editCount > 2) {
                    return res.json({ data: null, message: "Chỉ có thể chính sửa tối đa 2 lần !" })
                }
                let [user] = await UserService.find({ username })
                let fbData = user.facebook
                let isSuccess = await FacebookService.editPost(fbData.dtsg, fbData.uid, fbData.cookie.data, content, attachments, fb_id)
                if (isSuccess) {
                    result = await PostService.updateOne({ fb_id }, { content, attachment: attachments, editCount: result.editCount + 1 })
                    return res.json({ data: result, message: "Cập nhật thành công" })
                } else {
                    return res.json({ data: result, message: "Cập nhật thất bại, vui lòng cập nhật cookie facebook" })
                }
            }
        } catch (error) {
            console.log("Edit Post Error", error)
            return res.json({ data: null, message: "Cập nhật bài viết thất bại" })
        }
    },
    async delete(req, res) {
        try {
            let id = req.body.id;
            if (!id) {
                return res.json({ data: null, message: "Không có id bài đăng" })
            }
            let result = await PostService.find({ id })
            if (!result) {
                return res.json({ data: null, message: "Bài đăng không tồn tại !" })
            } else {
                result = await PostService.delete({ id })
            }
            return res.json({ data: result, message: "Xóa thành công" })
        } catch (error) {
            console.error("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi xóa bài đăng" })
        }
    },
    async disable(req, res) {
        try {
            let postId = req.body.postId;
            console.log("PostID: ", postId)
            if (!postId) {
                return res.json({ data: null, message: "Không tìm thấy bài viết" })
            }
            let user = await UserService.find({ username: req.body.username })
            if (user.length > 0) {
                if (user[0].facebook.cookie && user[0].facebook.cookie.status != 1)
                    return res.json({ data: null, message: "Vui lòng cập nhật lại cookie" })
                else if (user[0].facebook.cookie) {
                    let fbData = user[0].facebook
                    let result = await FacebookService.disableComment(postId, fbData.uid, fbData.dtsg, fbData.cookie.data)
                    if (result) {
                        await PostService.updateOne({ fb_id: postId }, { status: -1 })
                        return res.json({ data: null, message: "Cập nhật bài viết thành công" })
                    } else {
                        return res.json({ data: null, message: "Cập nhật bài viết thất bại" })
                    }
                }
            }
            return res.json({ data: null, message: "Cập nhật thất bại" })
        } catch (error) {
            console.log("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi xóa bài đăng" })
        }
    },
    async getPostNum(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({ _id });
            if (!user) {
                return res.json({ data: null, message: "Không có id bài đăng" })
            }
            let username = user[0].username
            let result = await PostService.find({ username })
            if (!result) {
                return res.json({ data: null, message: "Bài đăng không tồn tại!" })
            }
            return res.json({ data: result.length, message: "Lấy số bài đăng thành công" })
        } catch (error) {
            console.error("Delete Post Error", error)
            return res.json({ data: error, message: "Lỗi lấy số bài đăng" })
        }
    }
}

module.exports = PostController