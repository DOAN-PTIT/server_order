const express = require('express');
const chatboxController = require('../controller/chatboxController');

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", chatboxController.getHomePage);
    router.post("/", chatboxController.postHomePage);

    router.get("/dev", chatboxController.getDevPage);

    router.get("/webhook", chatboxController.getWebHook);
    router.post("/webhook", (req, res) => {
        return chatboxController.postWebHook(req, res);
    });

    return app.use("/", router);
}

module.exports = initWebRoutes;