const axios = require('axios');
const fs = require('fs');
const { logError, parseData, btoa, atob } = require('../../utils')
const createComment = async (content, postId, uid, fbDtsg, cookie) => {
    const randomPrefix = () => Math.floor(Math.random() * 8999 + 1000) + ''
    const feedback_id = btoa(`feedback:${postId}`)
    const dataObject = {
        av: uid,
        __user: uid,
        __a: 1,
        fb_dtsg: fbDtsg,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "CometUFICreateCommentMutation",
        variables: {
            "displayCommentsFeedbackContext": null,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "feedLocation": "GROUP_PERMALINK",
            "feedbackSource": 2,
            "focusCommentID": null,
            "includeNestedComments": false,
            "input": {
                "attachments": null,
                "feedback_id": feedback_id,
                "formatting_style": null,
                "message": {
                    "ranges": [],
                    "text": content
                },
                "is_tracking_encrypted": true,
                "actor_id": uid,
                "client_mutation_id": "8"
            },
            "scale": 1.5,
            "useDefaultActor": false,
            "UFI2CommentsProvider_commentsKey": "CometGroupPermalinkRootFeedQuery"
        },
        doc_id: "5272800449420561",
        server_timestamps: true,
    };
    const data = await parseData(dataObject);
    let axiosOption = {
        url: "https://www.facebook.com/api/graphql/",
        method: "POST",
        headers: {
            Cookie: cookie,
            accept: "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            pragma: "no-cache",
            "viewport-width": "1920",
            proxy: [],
        },
        data: data,
        maxRedirects: 0,
    };
    let response = await axios.request(axiosOption);
    try {
        // HANDLE STRING RESPONSE
        try {
            if (typeof response.data == "string") {
                // console.log("Handle A String response: ", response.data);
                response.data = JSON.parse(response.data.split("\n")[0]);
                // console.log("New Response Data: ", response.data.data.feedback);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
        let replyCommentID = atob(response.data.data?.comment_create?.feedback?.id)
        return replyCommentID
    } catch (error) {
        console.log("Lỗi tại Facebook.replyComment ", error)
        if (
            error.message !=
            "TypeError: Cannot read properties of undefined (reading 'feedback')"
        ) {
            // console.error("Response Data: ", response.data.data);
        }
        return null;
    }
};




module.exports = { createComment }