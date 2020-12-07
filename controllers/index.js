const Vote = require("../models/votes");
const Message = require("../models/message");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SG);
var path = require("path");

const { check, validationResult } = require("express-validator");

exports.getMessages = (req, res, next) => {
  Message.getMessages()
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getLastMessages = (req, res, next) => {
  const amount = req.query.amount;
  Message.getLastMessages(amount)
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postMessage = (req, res, next) => {
  const { name, content } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errorMessage: errors.array() });
  }
  const message = new Message(name, content);
  message
    .save()
    .then((result) => {
      if (result) {
        console.log(result);
        return res.status(201).send("one message added");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postMessages = (req, res, next) => {
  const message = req.body;
  Message.saveMany(message)
    .then((result) => {
      if (result) {
        console.log(result);
        return res.status(201).send("many message added");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const arrangeVotes = (votes) => {
  const votesNoEmpty = votes.filter((vote) => vote.voted);
  let voteBoard = new Map();
  votesNoEmpty.map((votes) => {
    votes.votes.map((vote) => {
      if (voteBoard.has(vote)) {
        let currentValue = voteBoard.get(vote);
        currentValue++;
        voteBoard.set(vote, currentValue);
      } else {
        voteBoard.set(vote, 1);
      }
      return voteBoard;
    });
    return voteBoard;
  });
  return voteBoard;
};

exports.getVotes = (req, res, next) => {
  Vote.getVotes()
    .then((result) => {
      let votes = [];
      result.map((el) => {
        votes.push(el.votes);
      });
      return result;
    })
    .then((result) => {
      const countedVotes = arrangeVotes(result);
      let finalResult = [];
      countedVotes.forEach(function(val, key) {
        finalResult.push({ number: key, amount: val });
      });
      const finalResultSorted = finalResult.sort((a, b) => {
        if (a.amount < b.amount) {
          return 1;
        }
        if (a.amount > b.amount) {
          return -1;
        }
        return a - b;
      });
      return res.status(200).send(finalResultSorted);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postVote = (req, res, next) => {
  const { email, name, phone, code, votes } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errorMessage: errors.array() });
  }
  const voted = true;
  const vote = new Vote(email, name, phone, code, votes, voted);
  vote
    .vote()
    .then((result) => {
      if (result) {
        console.log(result);
        return res.status(201).send("one vote updated");
      } else {
        console.log(result);
        return res.status(204).send("already exist");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCode = (req, res, next) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errorMessage: errors.array() });
  }
  const vote = new Vote(email);
  vote
    .save()
    .then((result) => {
      if (result) {
        res.status(201).send("one email added");
        const msg = {
          to: email, // Change to your recipient
          from: "jim@crespirit.com", // Change to your verified sender
          subject: "Rabi-Ribi五週年徵稿活動投票認證信",
          text: "Rabi-Ribi五週年徵稿活動投票認證",
          html: `<strong>您好：</strong><p>您的認證碼為： ${vote.code}</p>`,
        };
        return sgMail.send(msg);
      } else {
        res.status(204).send("already exist");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
