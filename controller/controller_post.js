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
                return res.json({ data: createdPost, message: "Create post success" })
            }
            else return res.json({
                data: null, message: "Tạo Post Thất Bại"
            })
        } catch (error) {
            console.log("Create Post Error", error)
            return res.json({ data: null, message: "Create Post Error" })
        }
    },
    async getPost(req, res) {
        try {
            let condition = req.query;
            let selectedPostList = await PostService.find(condition)
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
            logError("Get Post Error", error)
            return res.json({ data: error, message: "Get Post Error" })
        }
    },
    async edit(req, res) {
        try {
            let id = req.body.id;
            let fb_id = req.body.fb_id;
            let content = req.body.content;
            let attachment = req.body.attachment;
            let status = req.body.status;
            let order = req.body.order;
            if (!id) {
                return res.json({ data: null, message: "Not have id post" })
            } else if (!fb_id && !content && !attachment && !status && !order) {
                return res.json({ data: null, message: "Not have information" })


            }
            let result = await PostService.find({ id })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            } else {
                result = await PostService.updateOne({ id }, { fb_id, content, attachment, status, order })
            }
            return res.json({ data: result, message: "Update  Success" })
        } catch (error) {
            logError("Edit Post Error", error)
            return res.json({ data: error, message: "Update Error" })
        }
    },
    async delete(req, res) {
        try {
            let id = req.body.id;
            if (!id) {
                return res.json({ data: null, message: "Not have id post" })
            }
            let result = await PostService.find({ id })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            } else {
                result = await PostService.delete({ id })
            }
            return res.json({ data: result, message: "Delete  Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Delete Error" })
        }
    },
    async getPostNum(req, res) {
        try {
            let _id = req.query.id;
            let user = await UserService.find({_id});
            if (!user) {
                return res.json({ data: null, message: "Not have id post" })
            }
            let username = user[0].username
            let result = await PostService.find({ username })
            if (!result) {
                return res.json({ data: null, message: "Post not existed !" })
            }
            return res.json({ data: result.length, message: "Get Number Post Success" })
        } catch (error) {
            logError("Delete Post Error", error)
            return res.json({ data: error, message: "Get Number Post Error" })
        }
    }
}

module.exports = PostController