const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const path = require('path')
const { logError, parseData, btoa, atob } = require('../../utils')
const postConfig = '{"input":{"composer_entry_point":"inline_composer","composer_source_surface":"group","composer_type":"group","logging":{"composer_session_id":"882f304f-eedb-4a4a-9628-39905ee99e9b"},"source":"WWW","attachments":[],"message":{"ranges":[],"text":"kkk"},"with_tags_ids":[],"inline_activities":[],"explicit_place_id":"0","text_format_preset_id":"0","tracking":[null],"audience":{"to_id":"817850779114525"},"actor_id":"100058261795026","client_mutation_id":"2"},"displayCommentsFeedbackContext":null,"displayCommentsContextEnableComment":null,"displayCommentsContextIsAdPreview":null,"displayCommentsContextIsAggregatedShare":null,"displayCommentsContextIsStorySet":null,"feedLocation":"GROUP","feedbackSource":0,"focusCommentID":null,"gridMediaWidth":null,"scale":1,"privacySelectorRenderLocation":"COMET_STREAM","renderLocation":"group","useDefaultActor":false,"isFeed":false,"isFundraiser":false,"isFunFactPost":false,"isGroup":true,"isTimeline":false,"isSocialLearning":false,"isPageNewsFeed":false,"isProfileReviews":false,"prefetchRecentMediaPhotos":false,"UFI2CommentsProvider_commentsKey":"CometGroupDiscussionRootSuccessQuery","useCometPhotoViewerPlaceholderFrag":false,"hashtag":null}';
const uploadPost = async (dtsg, uid, cookie, content, groupId) => {
    try {
        const form = new FormData();
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
                    "logging": {
                        "composer_session_id": "882f304f-eedb-4a4a-9628-39905ee99e9b"
                    },
                    "source": "WWW",
                    "attachments": [],
                    "message": {
                        "ranges": [],
                        "text": content,
                    },
                    "with_tags_ids": [],
                    "inline_activities": [],
                    "explicit_place_id": "0",
                    "text_format_preset_id": "0",
                    "tracking": [
                        null
                    ],
                    "audience": {
                        "to_id": groupId
                    },
                    "actor_id": uid,
                    "client_mutation_id": "2"
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
                "scale": 1,
                "privacySelectorRenderLocation": "COMET_STREAM",
                "renderLocation": "group",
                "useDefaultActor": false,
                "isFeed": false,
                "isFundraiser": false,
                "isFunFactPost": false,
                "isGroup": true,
                "isTimeline": false,
                "isSocialLearning": false,
                "isPageNewsFeed": false,
                "isProfileReviews": false,
                "prefetchRecentMediaPhotos": false,
                "UFI2CommentsProvider_commentsKey": "CometGroupDiscussionRootSuccessQuery",
                "useCometPhotoViewerPlaceholderFrag": false,
                "hashtag": null
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

        const response =await axios.request(axiosOption)
        const dataResponse = JSON.parse(response.data.split('\n')[0])
        console.log("RESPONSE DATA: ", dataResponse)
        return {
            error: dataResponse.errors || false,
            url: dataResponse.data.story_create.group_feed_story_edge.node.url
        }
    } catch (e) {
        console.log("Error: ", e)
        return {
            error: true
        }
    }
}
const dtsg = 'AQG_BHIum8npVQY: 1: 1643709527';
const uid = '100004337133436';
const cookie = 'sb=aHiMYYGRsqvWxwm3YV-BJTVT;datr=aHiMYYOMQTsYCgecigGVZUo4;x-referer=eyJyIjoiL2hvbWUucGhwIiwiaCI6Ii9ob21lLnBocCIsInMiOiJtIn0%3D;_fbp=fb.1.1641782271340.356732230;m_pixel_ratio=1;usida=eyJ2ZXIiOjEsImlkIjoiQXI1dW9lZzR4ZHU2OSIsInRpbWUiOjE2NDI0MTYxMzZ9;c_user=100004337133436;wd=1282x727;dpr=1;xs=1%3A_OnexapEDANlKw%3A2%3A1643709527%3A-1%3A6383%3A%3AAcV1mFPf9k8AzwNq6NzEy5rabByPs-OsBwlrExZjegYJ;fr=0ktNlU1Pq0TpraKVw.AWWQjNUj3YBy1JGTxQA4XReu5b4.BiB1Jd.7s.AAA.0.0.BiB1Jd.AWXKM37cyAM;presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22u.100005034960485%22%7D%2C%7B%22i%22%3A%22u.100055385240288%22%7D%2C%7B%22i%22%3A%22u.100071224120309%22%7D%2C%7B%22i%22%3A%22g.4516967591697103%22%7D%2C%7B%22i%22%3A%22u.100004603997082%22%7D%2C%7B%22i%22%3A%22u.1102833123165800%22%7D%2C%7B%22i%22%3A%22u.100074995766237%22%7D%2C%7B%22i%22%3A%22u.1567937303521672%22%7D%2C%7B%22i%22%3A%22u.7239642769409877%22%7D%2C%7B%22i%22%3A%22u.100011894925946%22%7D%2C%7B%22i%22%3A%22u.100004667070554%22%7D%2C%7B%22i%22%3A%22g.4884438074997377%22%7D%2C%7B%22i%22%3A%22u.100028967077621%22%7D%2C%7B%22i%22%3A%22g.3210958252310647%22%7D%2C%7B%22i%22%3A%22u.100007932159620%22%7D%2C%7B%22i%22%3A%22u.619751094730053%22%7D%2C%7B%22i%22%3A%22u.100033444703034%22%7D%2C%7B%22i%22%3A%22u.100012194797702%22%7D%2C%7B%22i%22%3A%22u.100005580900183%22%7D%2C%7B%22i%22%3A%22u.100005946405019%22%7D%2C%7B%22i%22%3A%22u.100007098244541%22%7D%5D%2C%22utc3%22%3A1644647935626%2C%22lm3%22%3A%22u.100006061596896%22%2C%22v%22%3A1%7D;';
uploadPost(dtsg, uid, cookie, "Test Lan 1", '877660292889767').then(data => {
    console.log('Data: ', data)
})
// module.export = { uploadPost }