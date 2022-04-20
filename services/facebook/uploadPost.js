const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const { logError, parseData, btoa, atob } = require('../../utils')
const ModelError = require('../../models/model_error')
const postConfig = '{"input":{"composer_entry_point":"inline_composer","composer_source_surface":"group","composer_type":"group","logging":{"composer_session_id":"882f304f-eedb-4a4a-9628-39905ee99e9b"},"source":"WWW","attachments":[],"message":{"ranges":[],"text":"kkk"},"with_tags_ids":[],"inline_activities":[],"explicit_place_id":"0","text_format_preset_id":"0","tracking":[null],"audience":{"to_id":"817850779114525"},"actor_id":"100058261795026","client_mutation_id":"2"},"displayCommentsFeedbackContext":null,"displayCommentsContextEnableComment":null,"displayCommentsContextIsAdPreview":null,"displayCommentsContextIsAggregatedShare":null,"displayCommentsContextIsStorySet":null,"feedLocation":"GROUP","feedbackSource":0,"focusCommentID":null,"gridMediaWidth":null,"scale":1,"privacySelectorRenderLocation":"COMET_STREAM","renderLocation":"group","useDefaultActor":false,"isFeed":false,"isFundraiser":false,"isFunFactPost":false,"isGroup":true,"isTimeline":false,"isSocialLearning":false,"isPageNewsFeed":false,"isProfileReviews":false,"prefetchRecentMediaPhotos":false,"UFI2CommentsProvider_commentsKey":"CometGroupDiscussionRootSuccessQuery","useCometPhotoViewerPlaceholderFrag":false,"hashtag":null}';
const uploadPost = async (dtsg, uid, cookie, content, groupId) => {
    const randomPrefix = () => Math.floor(Math.random() * 8999 + 1000) + ''
    const dataObject = {
        'av': uid,
        '__user': uid,
        '__a': 1,
        'fb_dtsg': dtsg,
        'fb_api_caller_class': 'RelayModern',
        'fb_api_req_friendly_name': 'ComposerStoryCreateMutation',
        'doc_id': '7323568114335090',
        'variables': {
            "input": {
                "composer_entry_point": "inline_composer",
                "composer_source_surface": "group",
                "composer_type": "group",
                "source": "WWW",
                "attachments": [],
                "message": {
                    "ranges": [],
                    "text": "đăng postman 2 :v \n"
                },
                "with_tags_ids": [],
                "inline_activities": [],
                "explicit_place_id": "0",
                "text_format_preset_id": "0",
                "tracking": [
                    null
                ],
                "audience": {
                    "to_id": `${groupId}`
                },
                "actor_id": `${uid}`,
                "client_mutation_id": "5"
            },
            "displayCommentsFeedbackContext": null,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "feedLocation": "GROUP",
            "feedbackSource": 0,
            "focusCommentID": null,
            "gridMediaWidth": null,
            "groupID": null,
            "scale": 1,
            "privacySelectorRenderLocation": "COMET_STREAM",
            "renderLocation": "group",
            "useDefaultActor": false,
            "inviteShortLinkKey": null,
            "isFeed": false,
            "isFundraiser": false,
            "isFunFactPost": false,
            "isGroup": true,
            "isEvent": false,
            "isTimeline": false,
            "isSocialLearning": false,
            "isPageNewsFeed": false,
            "isProfileReviews": false,
            "isWorkSharedDraft": false,
            "UFI2CommentsProvider_commentsKey": "CometGroupDiscussionRootSuccessQuery",
            "hashtag": null,
            "canUserManageOffers": false
        }
    }
    const data = await parseData(dataObject);
    const axiosOption = {
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

    const response = await axios.request(axiosOption)
    try {
        const dataResponse = JSON.parse(response.data.split('\n')[0])
        console.log("RESPONSE DATA: ", dataResponse)
        let url = dataResponse.data.story_create.story.url
        let urlArr = url.split('/')
        postId = urlArr[urlArr.length - 2]
        return {
            error: false,
            data: {
                postId: postId,
                url: url
            }
        }
    } catch (error) {
        ModelError.create({
            code: "UPLOAD_POST_FAIL",
            message: error.message,
            stack: error.stack,
            input: { dtsg, uid, content, groupId, cookie, dataObject },
            output: response.data
        })
        console.log("Upload Post Error Input: ", dtsg, uid, content, groupId)
        console.log("Cookie: \n", cookie)
        console.log("-------------------------------------------------------")
        console.log("Upload Post Error Response: ", response.data)
        console.log("Upload Post Error: ", error)
        return {
            error: true,
            data: null
        }
    }
}

module.exports = { uploadPost } 