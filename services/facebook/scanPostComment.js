const axios = require('axios');
const fs = require('fs');
const { logError, parseData, btoa, atob } = require('../../utils')
const scanPostComment = async (groupId, postId, uid, fbDtsg, cookie) => {
    let feedback_id = btoa("feedback:" + `${groupId}_${postId}`);
    const dataObject = {
        av: uid,
        __user: uid,
        __a: 1,
        fb_dtsg: fbDtsg,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "CometUFICommentsProviderPaginationQuery",
        variables: {
            after: null,
            before: null,
            displayCommentsFeedbackContext: null,
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            feedLocation: "GROUP_PERMALINK",
            feedbackID: feedback_id,
            feedbackSource: 2,
            first: null,
            focusCommentID: null,
            includeHighlightedComments: false,
            includeNestedComments: true,
            initialViewOption: null,
            isInitialFetch: false,
            isPaginating: false,
            last: null,
            scale: 1.5,
            topLevelViewOption: "RECENT_ACTIVITY",
            useDefaultActor: false,
            viewOption: "RECENT_ACTIVITY",
            UFI2CommentsProvider_commentsKey: "CometGroupPermalinkRootFeedQuery",
        },
        doc_id: "4254858264583055",
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
                console.log("Handle A String response: ", response.data);
                response.data = JSON.parse(response.data.split("\n")[0]);
                console.log("New Response Data: ", response.data.data.feedback);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
        console.log("Final Response:", response.data.data);
    } catch (error) {
        logError("Lỗi tại Facebook.scanComment ", { input: { groupId, postId, uid, fbDtsg, cookie }, error })
        if (
            error.message !=
            "TypeError: Cannot read properties of undefined (reading 'feedback')"
        ) {
            console.error("Response Data: ", response.data.data);
        }
        return [];
    }
};
module.exports = { scanPostComment }