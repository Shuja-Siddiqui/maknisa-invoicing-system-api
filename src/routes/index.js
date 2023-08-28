const { Auth } = require("../handlers");
const { authenticate } = require("../middlewares");
const { auths } = require("./auth");
const { invoice } = require("./invoice");
const router = require("express").Router();
const handler = new Auth();
router.use("/auths", auths);
router.use("/invoice", handler.refresh, invoice);

module.exports = { router };
