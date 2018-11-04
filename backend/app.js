//const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const usersRoutes = require("./routes/users");
const congregationsRoutes = require("./routes/congregations");
//const config = require('./config/default.json');

const app = express();



//Connect database
mongoose.set('useCreateIndex', true) //DeprecationWarning ensureIndex eliminated

mongoose
  .connect(process.env.DB,{ useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/congregations", congregationsRoutes);

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"));
// });

module.exports = app;
