const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models");
const Response = require("./Response");
const nodemailer = require("nodemailer");
const { findOneAndUpdate } = require("../models/user.model");
const User = require("../models/user.model");

class Auth extends Response {
  registerUSer = async (req, res) => {
    try {
      const { email, password, userEmail } = req.body;

      const hashPassword = await bcrypt.hash(password, 10);
      const user = new UserModel({
        email: email,
        password: hashPassword,
        email: userEmail,
      });
      await user.save();
      const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
        expiresIn: "2h",
      });
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
      const { email, password } = req.body;
      const user = await UserModel.findOne(email);
      let passMatch;
      if (user) {
        if (password) {
          passMatch = await bcrypt.compare(password, user.password);
        }
      } else {
        return this.sendResponse(res, req, {
          message: "No User exist with this email",
          status: 404,
        });
      }
      if (!passMatch) {
        return this.sendResponse(res, req, {
          message: "Check Your Password Again Please",
          status: 404,
        });
      } else {
        const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
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
      const token = jwt.sign({ email: decoded.email }, process.env.SECRET_KEY, {
        expiresIn: "20m",
      });
      req.email = decoded.email;
      console.log(token, decoded);
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
  verify = async (req, res, next) => {
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
      const token = jwt.sign({ email: decoded.email }, process.env.SECRET_KEY, {
        expiresIn: "20m",
      });
      req.token = token;
      return this.sendResponse(res, req, {
        message: "Verified",
        status: 200,
      });
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
          user: process.env.EMAIL, // generated ethereal user
          pass: process.env.MAIL_PASSWORD, // generated ethereal password
        },
      });
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: "Password Reset",
        text: `Your new password: ${newPassword}`,
      };
      try {
        await transporter.sendMail(mailOptions).then(res => console.log(res));
        console.log("Password reset email sent successfully to", userEmail);
        console.log(process.env.EMAIL, userEmail);
      } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
      }
    };
    const { userEmail } = req.body.data;
    try {
      const user = await UserModel.findOne({ email: userEmail });

      if (user) {
        const newPassword = generateRandomPassword();
        user.password = await bcrypt.hash(newPassword, 10);
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
  updatePassword = async (req, res) => {
    const { currentPass, newPass, confirmPass, email } = req.body;
    console.log(email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({
          status: 404,
          message: "The User with provided email is not found",
          data: null,
        });
      } else {
        if (!currentPass || !newPass || !confirmPass) {
          return res.status(400).send({
            status: 400,
            message: "Please provide all the necessary details",
            data: null,
          });
        } else {
          if (newPass !== confirmPass) {
            return res.status(404).send({
              status: 404,
              message: "New password and confirm password must be same",
              data: null,
            });
          } else {
            let passMatch = bcrypt.compare(currentPass, user.password);
            if (!passMatch) {
              return res.status(404).send({
                status: 404,
                message: "old password is not matching",
                data: null,
              });
            } else {
              await User.updateOne(
                { email },
                {
                  $set: {
                    password: await bcrypt.hash(newPass, 10),
                  },
                }
              );
              return res.status(201).send({
                status: 201,
                message: "user is updated",
                data: user,
              });
            }
          }
        }
      }
    } catch {
      return res.status(500).send({
        status: 500,
        message: "Internal Server Error",
        data: null,
      });
    }
  };
}

module.exports = {
  Auth,
};
