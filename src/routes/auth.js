const { Auth } = require("../handlers");
const router = require("express").Router();
const handler = new Auth();

router.post("/", handler.registerUSer);
router.post("/login", handler.login);
router.patch("/change-password", handler.changePassword);

module.exports = {
  auths: router,
};
