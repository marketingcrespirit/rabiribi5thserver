const express = require("express");
const router = express.Router();
const indexController = require("../controllers/index");

router.get("/votes", indexController.getVotes);

router.post("/vote", indexController.postVote);

router.post("/code", indexController.postCode);

router.get("/messages", indexController.getMessages);

router.post("/message", indexController.postMessage);

module.exports = router;
