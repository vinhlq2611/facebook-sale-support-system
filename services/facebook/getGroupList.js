const { logError, parseData, btoa, atob } = require('../../utils')
const axios = require('axios')

const getGroupList = async (fbDtsg, uid, cookie) => {
    try {
        let hasNextPage = true;
        let groupList = []
        let cursor = null;
        while (hasNextPage) {
            let dataObject = {
                av: uid,
                __user: uid,
                __a: 1,
                fb_dtsg: fbDtsg,
                fb_api_caller_class: 'RelayModern',
                fb_api_req_friendly_name: 'GroupsLeftRailGroupsYouManagePaginatedQuery',
                doc_id: '5082539561756946',
                variables: { "count": 5, "scale": 1 }
            }
            if (cursor != null) {
                dataObject.variables.cursor = cursor
            }
            let formData = await parseData(dataObject);
            const axiosOption = {
                url: "https://www.facebook.com/api/graphql/",
                method: "POST",
                headers: {
                    accept: "*/*",
                    Cookie: cookie,
                    "accept-language": "en-US,en;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded",
                    pragma: "no-cache",
                    "viewport-width": "1920",
                    proxy: [],
                },
                data: formData,
                maxRedirects: 0,
            };
            const response = await axios.request(axiosOption);
            let responseData = response.data.data.viewer.groups_tab.tab_groups_list;
            cursor = responseData.page_info.end_cursor;
            hasNextPage = responseData.page_info.has_next_page;
            for (const node of responseData.edges) {
                let group = node.node;
                groupList.push({
                    cover: {
                        source: group.profile_picture.uri
                    },
                    id: group.id,
                    name: group.name,
                });
            }
        }
        console.log("GET GROUP LIST RESPONSE: ", groupList)
        return groupList
    } catch (error) {
        logError("Lỗi tại Facebook.listGroup ", { input: { fbDtsg, uid, cookie }, error })
        console.log("Get Group List Fail: ", error);
        return [];
    }
};

module.exports = {
    getGroupList
}