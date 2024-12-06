require("dotenv").config();
const axios = require("axios/dist/node/axios.cjs"); // node

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendTypingOn = async (sender_psid) => {
  console.log("start send typing on");
  let url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
  };
  return axios
    .post(url, request_body)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

let markMessageRead = async (sender_psid) => {
  console.log("start mark message read");
  let url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  return axios
    .post(url, {
      recipient: {
        id: sender_psid,
      },
      sender_action: "mark_seen",
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

module.exports = {
  sendTypingOn: sendTypingOn,
  markMessageRead: markMessageRead,
};
