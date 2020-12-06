const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const tunnel = require("tunnel-ssh");

const podcasts = require("./routes/api/podcasts");

const app = express();

// Bodyparser Middleware
app.use(bodyParser.json());

// DB Config
const SSHconfig = require("./config/keys").SSHconfigs;

// Connect to Mongo
tunnel(SSHconfig, function (error) {
  if (error) {
    console.log("SSH connection error: " + error);
  }
  mongoose.connect("mongodb://localhost:30000/AppCloud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  var db = mongoose.connection;
  db.on("error", console.error.bind(console, "DB connection error:"));
  db.once("open", function () {
    console.log("DB connection successful");
  });

  // Use Routes
  app.use("/api", podcasts);

  const port = 5000 || process.env.PORT;

  app.listen(port, () => console.log(`Server started on port ${port}`));
});
