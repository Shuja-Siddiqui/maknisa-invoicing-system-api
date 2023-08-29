const { Files } = require("../handlers");
const { Auth } = require("../handlers");
const router = require("express").Router();
const auth = new Auth();
const handler = new Files();

router.post("/", handler.upload);
module.exports = {
  files: router,
};
