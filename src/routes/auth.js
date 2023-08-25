const { Auth } = require("../handlers");
const router = require("express").Router();
const handler = new Auth();

// router.get("/", handler.refresh);
router.post("/", handler.registerUSer);
router.post("/login", handler.login);

module.exports = {
  auths: router,
};
