const axios = require('axios');
const fs = require('fs');
const { logError, parseData, btoa, atob } = require('../../utils')
const disableComment = async (postId, uid, fbDtsg, cookie) => {
    const feedback_id = btoa(`feedback:${postId}`)
    const dataObject = {
        av: uid,
        __user: uid,
        __a: 1,
        fb_dtsg: fbDtsg,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "useCometFeedStoryDisableCommentingMutation",
        variables: {
            "input": {
                "feedback_id": feedback_id,
                "actor_id": uid,
                "client_mutation_id": "17"
            }
        },
        doc_id: "3747579715350638",
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
        return response.data?.data?.feedback_disable_commenting?.feedback?.have_comments_been_disabled
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


// const cookie = `sb=oQUmYpp26HKsxp2q-gjF4V9A; datr=oQUmYikJzLMFR5Fvp_flQlL3; locale=vi_VN; m_pixel_ratio=1.25; c_user=100004337133436; cppo=1; xs=47%3AkFcXAgSU3UMpyA%3A2%3A1646918541%3A-1%3A6383%3A%3AAcXQjcPp0i4Jvsw9FmxS4Jc93qLcRZkZQHrmP49amg; fr=0AUAyKiI76JoRc3Gy.AWUHXtube1Z-XHb4Jc8YieUl9SY.BiKgMd.Lg.AAA.0.0.BiKgMd.AWVpVYCYI28; usida=eyJ2ZXIiOjEsImlkIjoiQXI4ajc3OGdvbHhkcCIsInRpbWUiOjE2NDY5MjA3MjF9; wd=1282x727; dpr=1.25; presence=C%7B%22t3%22%3A%5B%7B%22i%22%3A%22u.100056832580522%22%7D%2C%7B%22i%22%3A%22u.100006061596896%22%7D%2C%7B%22i%22%3A%22u.100005946405019%22%7D%2C%7B%22i%22%3A%22g.4516967591697103%22%7D%2C%7B%22i%22%3A%22u.100009167150397%22%7D%2C%7B%22i%22%3A%22u.100005034960485%22%7D%5D%2C%22utc3%22%3A1646923008446%2C%22v%22%3A1%7D`
// disableComment('901992960456500', '100004337133436', 'AQHeYAlflBtFl08:47:1646918541', cookie)

module.exports = { disableComment }