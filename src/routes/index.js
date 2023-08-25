const { auths } = require("./auth");

const router = require("express").Router();



router.use("/auths", auths);


module.exports = { router };
