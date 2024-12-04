const axios = require('axios');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendMessage = (sender_psid, response) => {
    return new Promise(async (resolve, reject) => {
        try {
            await homepageService.markMessageRead(sender_psid);
            await homepageService.sendTypingOn(sender_psid);
            // Construct the message body
            let request_body = {
                "recipient": {
                    "id": sender_psid
                },
                "message": response
            };
            axios.post(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, request_body)
                .then((res) => {
                    resolve('message sent!')
                })
                .catch((error) => {
                    reject("Unable to send message:" + error);
                });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    sendMessage: sendMessage
}