require("dotenv").config();
const express = require("express");
const https = require("node:https");
const app = express();
const cors = require("cors");
const { router } = require("./routes/index");
const { db } = require("./db");
app.use(express.json());
app.use(cors());

const fs = require("fs");
const { InvoiceModel, UserModel } = require("./models");

app.use("/api", router);
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("certificate.pem"),
};

const PORT_SSL = 400;

const server = https.createServer(options, app);
server.listen(PORT_SSL, () => {
  db.on("error", (err) => {
    console.log(err);
  });
  db.on("open", () => {
    console.log("Database Connected");
    console.log(`Server Started: https://localhost`);
  });
});
