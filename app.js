require("dotenv").config(); // Đọc các biến môi trường từ file .env
const express = require("express");
const bodyParser = require("body-parser");
const configViewEngine = require("./src/config/viewEngine");
const initWebRoutes = require("./src/routers/web");
const chatbotServices = require("./src/services/chatbotServices");
const app = express();
const PORT = process.env.PORT || 3000;

// engine
configViewEngine(app);

// routers
initWebRoutes(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

app.post("/test", (req, res) => {
  console.log(req.body);
  return res.send("ok");
});

app.post("/webhook", (req, res) => {
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
});

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
