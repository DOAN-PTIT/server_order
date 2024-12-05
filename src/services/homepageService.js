require("dotenv").config();
const axios = require("axios");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendTypingOn = (sender_psid) => {
  console.log("start send typing on");
  return new Promise(async (resolve, reject) => {
    try {
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        sender_action: "typing_on",
      };

      let url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
      await axios
        .post(url, request_body)
        .then((res) => resolve("done!"))
        .catch((err) => reject("Unable to send message:" + err));
    } catch (e) {
      reject(e);
    }
  });
};

let markMessageRead = (sender_psid) => {
  console.log("start mark message read");
  return new Promise(async (resolve, reject) => {
    try {
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        sender_action: "mark_seen",
      };

      let url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
      axios
        .post(url, request_body)
        .then((res) => resolve("done!"))
        .catch((err) => reject("Unable to send message:" + err));
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  sendTypingOn: sendTypingOn,
  markMessageRead: markMessageRead,
};
