const { auths } = require("./auth");
const { invoice } = require("./invoice");
const router = require("express").Router();

router.use("/auths", auths);
router.use("/invoice", invoice);

module.exports = { router };
