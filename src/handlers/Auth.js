const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const Response = require("./Response");
const nodemailer = require("nodemailer");
const { findOneAndUpdate } = require("../models/user.model");

class Auth extends Response {
  registerUSer = async (req, res) => {
    try {
      const { username, password, userEmail } = req.body;
      console.log(username, password, "body");
      const hashPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        username: username,
        password: hashPassword,
        email: userEmail,
      });
      await user.save();
      const token = jwt.sign(
        { username: user.username },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      req.token = token;
      return this.sendResponse(res, req, {
        message: "User Added!",
        data: user,
        status: 201,
      });
    } catch (err) {
      return this.sendResponse(res, req, {
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
        return this.sendResponse(res, req, {
          message: "No User exist with this username",
          status: 404,
        });
      }
      if (!passMatch) {
        return this.sendResponse(res, req, {
          message: "Check Your Password Again Please",
          status: 404,
        });
      } else {
        const token = jwt.sign({ username: username }, process.env.SECRET_KEY, {
          expiresIn: "10m",
        });
        return this.sendResponse(res, req, {
          message: "logged IN",
          data: { token, user },
          status: 202,
        });
      }
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Internal server error!",
        data: err,
        status: 500,
      });
    }
  };
  refresh = async (req, res, next) => {
    try {
      const gettoken = req.headers.authorization?.split(" ")[1];
      if (!gettoken) {
        return this.sendResponse(res, req, {
          message: "Token is Missing",
          status: 403,
        });
      }
      const decoded = jwt.verify(
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
        return this.sendResponse(res, req, {
          message: "Unable to authorize!",
          status: 400,
        });
      }
      const token = jwt.sign(
        { username: decoded.username },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      req.token = token;
      next();
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        message: "Internal server error",
        status: 202,
      });
    }
  };

  forgotPassword = async (req, res) => {
    // Pass Genrator
    const generateRandomPassword = (length = 10) => {
      const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let password = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
      }

      return password;
    };
    // Nodemailer
    const sendPasswordResetEmail = async (userEmail, newPassword) => {
      let testAccount = await nodemailer.createTestAccount();

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "mail.consoledot.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: "noreply@consoledot.com", // generated ethereal user
          pass: "QWerTY@#$2", // generated ethereal password
        },
      });
      const mailOptions = {
        from: "noreply@consoledot.com",
        to: userEmail,
        subject: "Password Reset",
        text: `Your new password: ${newPassword}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Password reset email sent successfully");
      } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
      }
    };
    const { userEmail } = req.body;

    try {
      const user = await UserModel.findOne({ email: userEmail });

      if (user) {
        const newPassword = generateRandomPassword();
        user.password = newPassword;
        await user.save();
        await sendPasswordResetEmail(userEmail, newPassword);
        return res.json({ message: "Password reset email sent successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "An error occurred" });
    }
  };

}

module.exports = {
  Auth,
};
