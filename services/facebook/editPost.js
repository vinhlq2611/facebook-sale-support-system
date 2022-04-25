const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')
const path = require('path')
const { parseData, btoa, atob } = require('../../utils')

const randomPrefix = () => Math.floor(Math.random() * 8999 + 1000) + ''


const editPost = async (dtsg, uid, cookie, content, photoList, postId) => {
    const story_id = btoa(`S:_I${uid}:VK:${postId}`)
    let attachments = [];

    for (const id of photoList) {
        attachments.push({
            "photo": {
                "id": id
            }
        })
    }
    const dataObject = {
        'av': uid,
        '__user': uid,
        '__a': 1,
        'fb_dtsg': dtsg,
        'fb_api_caller_class': 'RelayModern',
        'fb_api_req_friendly_name': 'ComposerStoryEditMutation',
        'doc_id': '4958118517634793',
        'variables': {
            "input": {
                "composer_entry_point": "inline_composer",
                "composer_source_surface": "group",
                "composer_type": "edit",
                "logging": {
                    "composer_session_id": uuidv4()
                },
                "story_id": story_id,
                "attachments": attachments || [],
                "message": {
                    "ranges": [],
                    "text": content
                },
                "with_tags_ids": [],
                "inline_activities": [],
                "explicit_place_id": "0",
                "text_format_preset_id": "0",
                "editable_post_feature_capabilities": [
                    "CONTAINED_LINK",
                    "CONTAINED_MEDIA",
                    "POLL"
                ],
                "actor_id": uid,
                "client_mutation_id": "3"
            },
            "displayCommentsFeedbackContext": null,
            "displayCommentsContextEnableComment": null,
            "displayCommentsContextIsAdPreview": null,
            "displayCommentsContextIsAggregatedShare": null,
            "displayCommentsContextIsStorySet": null,
            "feedLocation": "GROUP",
            "feedbackSource": 1,
            "focusCommentID": null,
            "scale": 1,
            "privacySelectorRenderLocation": "COMET_STREAM",
            "renderLocation": "group_permalink",
            "useDefaultActor": false,
            "UFI2CommentsProvider_commentsKey": null,
            "isGroupViewerContent": false,
            "isSocialLearning": false,
            "isWorkDraftFor": false
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
        const dataResponse = response.data
        console.log("RESPONSE DATA: ", dataResponse)
        let id = dataResponse.data.story_edit.story.id
        if (id)
            return true
        else return false
    } catch (e) {
        console.log("Edit Post Error Input: ", dtsg, uid,'\n' ,content,'\n',attachments)
        console.log("Cookie: \n", cookie)
        console.log("-------------------------------------------------------")
        console.log("Upload Post Error Response: ", response.data)
        console.log("Upload Post Error: ", e)
        return false
    }
}

module.exports = { editPost } 