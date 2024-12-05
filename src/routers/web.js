const express = require('express');
const chatboxController = require('../controller/chatboxController');

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", chatboxController.getHomePage);

    router.get("/webhook", chatboxController.getWebHook);
    router.post("/webhook", chatboxController.postWebHook);

    return app.use("/", router);
}

module.exports = initWebRoutes;