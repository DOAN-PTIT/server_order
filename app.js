require("dotenv").config(); // Đọc các biến môi trường từ file .env
const express = require("express");
const bodyParser = require("body-parser");
const configViewEngine = require("./src/config/viewEngine");
const initWebRoutes = require("./src/routers/web");
const chatbotServices = require("./src/services/chatbotServices");
const homepageService = require("./src/services/homepageService");
const app = express();
const PORT = process.env.PORT || 3000;

// engine
configViewEngine(app);

// enable cors  
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// routers
initWebRoutes(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});

app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body) {
    if (body.object === "page") {

      body.entry.forEach(function (entry) {

        let webhookEvent = entry.messaging[0];
        console.log(webhookEvent);


        let senderPsid = webhookEvent.sender.id;
        console.log("Sender PSID: " + senderPsid);

        if (webhookEvent.message) {
          handleMessage(senderPsid, webhookEvent.message);
        } else if (webhookEvent.postback) {
          handlePostback(senderPsid, webhookEvent.postback);
        } else if (webhookEvent.order) {
          handleOrder(senderPsid, webhookEvent.order);
        }
      });
      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
  }
});

app.post("/order", (req, res) => {
  let body = req.body;
  res.status(200).send("EVENT_RECEIVED");
  handleMessage(body.sender_psid, body.message, true);
});

let handleMessage = async (sender_psid, received_message, is_create_order_success = false) => {
  let response;
  const { id } = await homepageService.getPageInfo();

  if (is_create_order_success) {
    response = {
      text: received_message,
    };
    await chatbotServices.sendMessage(sender_psid, response);
    return;
  }

  if (received_message.text == "order") {
    response = {
      text: `Cảm ơn bạn đã liên hệ với chúng tôi, vui lòng nhấn vào được link dưới đây để đặt hàng: http://localhost:3888/${id}?sender_psid=${sender_psid}`,
    };
  } else {
    response = {
      text: "Bạn muốn đặt hàng? Vui lòng gõ 'order' để được hỗ trợ",
    };
  }

  await chatbotServices.sendMessage(sender_psid, response);
};

let handlePostback = (sender_psid, received_postback) => {
  console.log("ok");
};

let handleOrder = (sender_psid, received_order) => {
  console.log(received_order);
};
