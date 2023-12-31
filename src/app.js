require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { db } = require("./db");
const path = require("node:path");
app.use(express.json());
app.use(cors());
const { router } = require("./routes");
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", router);

db.on("error", (err) => {
  console.log(err);
});
db.on("open", () => {
  console.log("Database Connected");
});

if (process.env.NODE_ENV === "local") {
  app.listen(5000, () => {
    console.log("server started at port 5000");
  });
}
module.exports = {
  app,
};
