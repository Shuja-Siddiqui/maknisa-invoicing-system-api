const { auths } = require("./auth");
const { invoice } = require("./invoice");
const { files } = require("./file");
const router = require("express").Router();
router.use("/auths", auths);
router.use("/invoice", invoice);
router.use("/files", files);

module.exports = { router };
