require("dotenv").config();

const chatbotServices = require("../services/chatbotServices");

let getHomePage = (req, res) => {
  return res.send("Hello world!!!");
};

let getDevPage = (req, res) => {
  return res.send("Hello Dev!!!");
};

let getWebHook = (req, res) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

let postWebHook = (req, res) => {
  console.log("postWebHook");
  let body = req.body;
  console.log(body);
  // Checks if this is an event from a page subscription
  if (body) {
    if (body.object === "page") {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the body of the webhook event
        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);

        // Get the sender PSID
        let senderPsid = webhookEvent.sender.id;
        console.log("Sender PSID: " + senderPsid);

        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhookEvent.message) {
          console.log("message");
          handleMessage(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
          handlePostback(senderPsid, webhookEvent.postback);
        }
      });

      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  } else {
    console.log("body is empty hahahah");
    res.sendStatus(404);
  }
};

let handleMessage = async (sender_psid, received_message) => {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  }

  await chatbotServices.sendMessage(sender_psid, response);
};

module.exports = {
  getHomePage: getHomePage,
  getWebHook: getWebHook,
  postWebHook: postWebHook,
  getDevPage: getDevPage,
};
