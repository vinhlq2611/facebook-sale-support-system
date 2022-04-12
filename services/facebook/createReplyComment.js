const axios = require('axios');
const fs = require('fs');
const { logError, parseData, btoa, atob } = require('../../utils')
const createReplyComment = async (content, postId, commentId, uid, fbDtsg, cookie) => {
    const randomPrefix = () => Math.floor(Math.random() * 8999 + 1000) + ''
    const feedback_id = btoa(`feedback:${postId}_${commentId}`)
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
            "feedLocation": "GROUP",
            "feedbackSource": 0,
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
                "attribution_id_v2": "CometGroupDiscussionRoot.react,comet.group,tap_search_bar,1646549095333,570102,2361831622",
                "is_tracking_encrypted": true,
                "feedback_source": "PROFILE",
                "idempotence_token": `client:df8a9d4b-${randomPrefix()}-485c-89d2-${randomPrefix()}a84d88e0`,
                "session_id": `30880aad-f281-46a6-${randomPrefix()}-8e6c0e7${randomPrefix()}`,
                "actor_id": uid,
                "client_mutation_id": "7"
            },
            "scale": 1.5,
            "useDefaultActor": false,
            "UFI2CommentsProvider_commentsKey": "CometGroupDiscussionRootSuccessQuery"
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
              //  console.log("Handle A String response: ", response.data);
                response.data = JSON.parse(response.data.split("\n")[0]);
                console.log("New Response Data: ", response.data.data.feedback);
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
            console.error("Response Data: ", response.data.data);
        }
        return null;
    }
};



function convertData(rawComment) {
    try {
        let node = rawComment.node
        // console.log("Node: ", node)
        let id = node.legacy_fbid;
        let author = {
            id: node.author.id,
            name: node.author.name,
            gender: node.author.gender,
            url: node.author.url
        }
        let level = node.feedback.display_comments?.comment_order
        let rawChilds = node.feedback.display_comments?.edges
        let childComments = []
        let content = node.body.text
        if (rawChilds) {
            for (let rawChild of rawChilds) {
                let childComment = convertData(rawChild)
                // console.log(`Child Comment of "${content}":\n`, childComment)
                childComments.push(childComment)
            }
        }
        let total_child = node.feedback.comment_count?.total_count

        return {
            fb_id: id,
            author,
            level,
            childs: childComments,
            content,
            total_child

        }
    } catch (error) {
        console.error("Get comment Fail: ", error)
        return {
        }

    }
}

module.exports = { createReplyComment }