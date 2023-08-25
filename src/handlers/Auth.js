const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const Response = require("./Response");

class Auth extends Response {
  registerUSer = async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(username, password, "body");
      const hashPassword = await bcrypt.hash(password, 10);
      console.log(hashPassword, "hash");
      const user = new UserModel({
        username: username,
        password: hashPassword,
      });
      await user.save();
      const token = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      console.log(token);
      return this.sendResponse(res, {
        message: "User Added!",
        data: user,
        status: 201,
      });
    } catch (err) {
      return this.sendResponse(res, {
        message: "User Not Added!",
        data: err,
        status: 500,
      });
    }
  };
  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findOne({ username: username });
      let passMatch;
      if (user) {
        if (password) {
          passMatch = await bcrypt.compare(password, user.password);
        }
      } else {
        return this.sendResponse(res, {
          message: "No User exist with this username",
          status: 404,
        });
      }
      if (!passMatch) {
        return this.sendResponse(res, {
          message: "Check Your Password Again Please",
          status: 404,
        });
      } else {
        const token = jwt.sign({ username: username }, process.env.SECRET_KEY, {
          expiresIn: "10m",
        });
        return this.sendResponse(res, {
          message: "logged IN",
          data: { token, user },
          status: 202,
        });
      }
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };
}
refresh = async (req, res) => {
  try {
    const gettoken = req.headers.authorization?.split(" ")[1];
    if (!gettoken) {
      return this.sendResponse(res, {
        message: "Token is Missing",
        data: err,
        status: 403,
      });
    }
    const decode = jwt.verify(
      gettoken,
      process.env.SECRET_KEY,
      (err, decoded) => {
        if (err)
          return {
            error: err,
            message: err,
          };
        return decoded;
      }
    );
    if (decoded?.error) {
      return this.sendResponse(res, {
        message: "Unable to authorize!",
        status: 400,
      });
    }
    const token = jwt.sign(
      { username: decoded.username },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );
    return this.sendResponse(res, {
      data: { token },
      status: 202,
    });
  } catch (err) {
    console.log(err);
    return this.sendResponse(res, {
      message: "Internal server error",
      status: 202,
    });
  }
};
module.exports = {
  Auth,
};
