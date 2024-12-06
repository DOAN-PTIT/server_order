require("dotenv").config();

const axios = require('axios'); // node
const homepageService = require("./homepageService");

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let sendMessage = async (sender_psid, response) => {
  console.log("start send message");
  try {
    await homepageService.markMessageRead(sender_psid);
    await homepageService.sendTypingOn(sender_psid);
    const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`
    const request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };

    return axios.post(url, request_body).then((result) => {
      console.log(result);
    }).catch((err) => {
      console.log(err);
    });
  } catch (error) {
    console.log("this is error" + " " + error);
  }
};

module.exports = {
  sendMessage: sendMessage,
};
