const { Files } = require("../handlers");
const router = require("express").Router();
const handler = new Files();
router.post("/", handler.upload);
module.exports = {
  files: router,
};
