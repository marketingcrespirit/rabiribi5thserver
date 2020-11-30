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

  static getMessages() {
    const db = getDb();
    return db
      .collection("messages")
      .find()
      .toArray();
  }
}

module.exports = Message;
