const { Auth } = require("../handlers");
const router = require("express").Router();
const handler = new Auth();

router.post("/", handler.registerUSer);
router.post("/login", handler.login);
router.post("/forget-password", handler.forgotPassword);
router.post("/update-password", handler.refresh, handler.updatePassword);
router.get("/verify", handler.verify);

module.exports = {
  auths: router,
};
