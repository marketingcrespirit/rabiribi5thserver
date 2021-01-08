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

exports.getVotesAmount = (req, res, next) => {
  Vote.getVotesAmount()
    .then((result) => {
      return res.sendStatus(result);
    })
    .catch((err) => {
      console.log(err);
    });
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
  const { email, name, code, votes } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ errorMessage: errors.array() });
  }
  const voted = true;
  const vote = new Vote(email, name, code, votes, voted);
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
          from: "rabiribi5th@crespirit.com", // Change to your verified sender
          subject: "Rabi-Ribi 5th徵稿活動投票認證信 | Verification code",
          text: "Rabi-Ribi 5th徵稿活動投票認證信 | Verification code",
          html: `<p>親愛的UPRPRC會員們，感謝你們的熱烈參與！</p>
          <br/>
          <p>在此提醒我們投票時間為：台灣時間 2021年 1/6（三）~1/13（三）。</p>
          <p>抽獎名單公布時間為：台灣時間 2021年 1/18（一）。</p>
          <p>收到驗證碼後，請再幫我們回到投票網頁，填寫個人資料與驗證碼，才算完成整個投票流程唷！</p>
          <p>您的認證碼為： ${vote.code}</p>
          <p>在此預祝您幸運中獎！</p>
          <br/>
          <br/>
          <p>酷思特文創股份有限公司</p>
          <br/>
          <br/>
          <br/>
          <p>Dear UPRPRC members,</p>
          <br/>
          <p>Thanks for join us for Rabi-Ribi 5th Anniversary Celebration!</p>
          <p>This letter is reminding you that the voting time is start from Jan. 6, 2021 . to Jan. 13, 2021 11:59 p.m. (GMT+8)</p>
          <p>Once completed the vote, each voter can earn a change for giveaway prize.</p>
          <br/>
          <p>To complete voting, here is your verification code: ${vote.code}</p>
          <p>Thanks again for your joining and wish you have good luck!</p>
          <br/>
          <br/>
          <p>CreSpirit</p>

          `,
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

exports.deleteEmail = (req, res, next) => {
  const { email } = req.body;
  Message.deleteMessage(email)
    .then((result) => {
      if (result) {
        console.log(result);
        return res.status(201).send("one message deleted");
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
