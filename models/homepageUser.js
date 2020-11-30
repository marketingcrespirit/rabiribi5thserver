const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class HomepageUser {
  constructor(name, phone, period, hour, email) {
    this.name = name;
    this.phone = phone;
    this.period = period;
    this.hour = hour;
    this.email = email;
    this.time = new Date();
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db.collection("homepageUser").updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("homepageUser").insertOne(this);
    }
    return dbOp
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  static getGuests() {
    const db = getDb();
    return db
      .collection("homepageUser")
      .find()
      .toArray();
  }

  static findById(guestId) {
    const db = getDb();
    return db
      .collection("homepageUser")
      .findOne({ _id: new ObjectId(guestId) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => {
        console.log(err);
      });
  }
}

module.exports = HomepageUser;
