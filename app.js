const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const mongoConnect = require("./util/database").mongoConnect;
const indexRoutes = require("./routes/index");
const app = express();

const port = process.env.PORT || 3001;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


app.use(indexRoutes);
// app.use(errorController.get404);

mongoConnect(() => {
  app.listen(port, () => console.log(`listening to port ${port}`));
});
