const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const randomCode = () => {
  let code = [];
  for (let i = 0; i < 4; i++) {
    code.push(Math.floor(Math.random() * 10));
  }
  return code.join("");
};

class Votes {
  constructor(email, name, phone, code, votes, activated, voted) {
    this.email = email;
    this.name = name;
    this.phone = phone;
    this.code = code;
    this.votes = votes;
    this.activated = false;
    this.voted = false;
    this.time = new Date();
  }

  save() {
    const db = getDb();
    this.activated = true;
    this.code = randomCode();
    return db
      .collection("votes")
      .findOne({ email: this.email })
      .then((res) => {
        if (res) {
          return false;
        } else {
          return db.collection("votes").updateOne({ email: this.email }, { $setOnInsert: this }, { upsert: true });
        }
      });
  }
  vote() {
    const db = getDb();
    return db
      .collection("votes")
      .findOne({ email: this.email })
      .then((res) => {
          console.log(res)
        if (res && !res.voted && this.code === res.code) {
          this.voted = true;
          this.activated = true;
          return db.collection("votes").updateOne({ email: this.email }, { $set: this });
        } else {
          return false;
        }
      });
  }

  static getVotes() {
    const db = getDb();
    return db
      .collection("votes")
      .find()
      .toArray();
  }

}

module.exports = Votes;
