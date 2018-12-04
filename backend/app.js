const path = require("path");
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const beginRoutes = require("./routes/begin");
const usersRoutes = require("./routes/users");
const congregationsRoutes = require("./routes/congregations");
const hospitalsRoutes = require("./routes/hospitals");
const accommodationsRoutes = require("./routes/accommodations");
const assistantsRoutes = require("./routes/assistants");
const patientsRoutes = require("./routes/patients");
const reportsRoutes = require("./routes/reports");
//const config = require('./config/default.json');

const app = express();



//Connect database
mongoose.set('useCreateIndex', true) //DeprecationWarning ensureIndex eliminated

// use encodeURIComponent because the password has special characters
mongoose
  .connect(`mongodb://${process.env.USER_DATABASE}:${encodeURIComponent(process.env.PASS_DATABASE)}@ds137267.mlab.com:37267/gvpdatabase`,{ useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((e) => {
    console.log(e);
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.options('*', cors()); // include before other routes
app.use("/images", express.static(path.join("images")));
app.use("/", express.static(path.join(__dirname, "angular")));

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
app.use("/api/begin", beginRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/congregations", congregationsRoutes);
app.use("/api/hospitals", hospitalsRoutes);
app.use("/api/accommodations", accommodationsRoutes);
app.use("/api/assistants", assistantsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/reports", reportsRoutes);

 app.use((req, res, next) => {
   res.sendFile(path.join(__dirname, "angular", "index.html"));
 });

module.exports = app;
