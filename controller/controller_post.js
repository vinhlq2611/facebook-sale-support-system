const { PostService } = require('../services')
const { logError, logWarn } = require('../utils/index')
const { uploadFile } = require('../middleware/upload');
const { Console } = require('winston/lib/winston/transports');
const utils = require('nodemon/lib/utils');

const util = require('util')
const path = require('path')

const PostController = {
    async create(req, res) {
        try {
            let username = req.body.username;
            let content = req.body.content;
            let attachments = req.body.attachments;
            let groupId = req.body.groupId;
            let product = req.body.product;
            console.log(req.body)
            // CHECK EMPTY INPUT
            if (!username || !content || !groupId || !product) {
                return res.json({ data: null, message: "Lack of information" })
            }
            let result = await PostService.create({ username, content, attachment: attachments, groupId })
            return res.json({ data: result, message: "Create post success" })
        } catch (error) {
            logError("Create Post Error", error)
            return res.json({ data: null, message: "Create Post Error" })
        }
    },
    async getPost(req, res) {
        try {
            let result = await PostService.find(req)
            console.log('result' + util.inspect(result, false, null, true))
            if ((await result).length == 0) {
                return res.json({ data: null, message: "Post not existed !" })
            }
            return res.json({ data: result, message: "Get Post Success" })
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
    }
}

module.exports = PostController