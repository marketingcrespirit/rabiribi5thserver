const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Message {
  constructor(name, content) {
    this.name = name;
    this.content = content;
    this.time = new Date();
  }

  save() {
    const db = getDb();
    return db
      .collection("messages")
      .insertOne(this)
      .then((res) => {
        return res;
      });
  }

  static saveMany(data) {
    const db = getDb();
    return db
      .collection("messages")
      .insertMany(data)
      .then((res) => {
        return res;
      });
  }
  static getLastMessages(amount) {
    const db = getDb();
    return db
      .collection("messages")
      .find()
      .sort({ $natural: -1 })
      .limit(amount)
      .toArray();
  }

  static getMessages() {
    const db = getDb();
    return db
      .collection("messages")
      .find()
      .toArray();
  }
}

module.exports = Message;
