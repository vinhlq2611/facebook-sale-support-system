const uploadPost = async (message) => {
    try {
        const data = message.data;
        const form = new FormData();
        const id = getUserId()
        appendForm(form, _string.__av.__decode(), id)
        appendForm(form, _string.__user.__decode(), id)
        appendForm(form, _string.__a.__decode(), 1)
        appendForm(form, _string.__fb_dtsg.__decode(), getDtsgFromStorage())
        appendForm(form, _string.__fb_api_caller_class.__decode(), _string.__replay_modern)
        appendForm(form, _string.__fb_api_req_friendly_name.__decode(), _string.__ComposerStoryCreateMutation)
        appendForm(form, _string.__doc_id.__decode(), '5593037244070807')

        let variables = JSON.parse(_string.__variables_post.__decode());

        if (data.attachment === 'images' && data.attachmentData.length) {
            for (let i = 0; i < data.attachmentData.length; i++) {
                const file = data.attachmentData[i]
                const imageId = await uploadImage(message, file)
                variables.input.attachments.push({
                    'photo': {
                        "id": imageId
                    }
                })
            }
        }

        if (data.attachment === 'files' && data.attachmentData) {
            const fileId = await uploadFile(message, data.attachmentData)
            variables.input.attachments.push({
                'file': {
                    'files': [
                        {
                            "group_file_revision_id": fileId
                        }
                    ]
                }
            })
        }

        if (data.attachment === 'stream' && data.attachmentData) {
            variables.input.attachments.push({
                link: {
                    share_scrape_data: '{\"share_type\":11,\"share_params\":[' + data.attachmentData + ']}'
                }
            })
        }

        if (data.attachment === 'link' && data.attachmentData) {
            const linkPw = await uploadLink(data)
            variables.input.attachments.push({
                link: {
                    share_scrape_data: linkPw
                }
            })
        }

        variables.input.message.text = data.content;
        variables.input.audience.to_id = data.group.id;
        variables.input.actor_id = id;

        appendForm(form, _string.__variables.__decode(), JSON.stringify(variables))
        const response = await _sendRequest({
            method: _string.__method_post.__decode(),
            url: _url.__fb_graphql_api.__decode(),
            data: form,
        })
        const dataResponse = JSON.parse(response.data.split('\n')[0])
        return {
            error: dataResponse.errors || false,
            url: dataResponse.data.story_create.group_feed_story_edge.node.url
        }
    } catch (e) {
        return {
            error: true
        }
    }
}