const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const indexController = require("../controllers/index");

router.get("/votes", indexController.getVotes);

router.get("/votesamount", indexController.getVotesAmount);

router.post("/vote", [check("email").isEmail(), check("name").isLength({ min: 1, max: 10 }), check("code").isLength(4), check("votes").isArray({ min: 1, max: 5 })], indexController.postVote);

router.post("/code", [check("email").isEmail()], indexController.postCode);

router.post("/deleteemail/dangerdonttouch", indexController.deleteEmail);

router.get("/messages", indexController.getMessages);
router.get("/getLastMessages", indexController.getLastMessages);

router.post("/message", [check("name").isLength({ min: 1, max: 10 }), check("content").isLength({ min: 1, max: 25 })], indexController.postMessage);
router.post("/messages", indexController.postMessages);

module.exports = router;
