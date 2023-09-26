const Response = require("./Response");
const fs = require("node:fs");
const path = require("node:path");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class Files extends Response {
  upload = async (req, res) => {
    try {
      const avatar = req.files ? req.files.avatar : null;
      if (avatar !== null) {
        const name = `${Date.now()}-${avatar.name}`;
        const body = avatar.data;
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: name,
          Body: body,
        };
        return s3.upload(uploadParams, (err, data) => {
          if (err)
            return this.sendResponse(res, req, {
              status: 400,
              message: "Error while uploading",
            });
          return this.sendResponse(res, req, {
            status: 200,
            data: {
              fileName: name,
            },
          });
        });
      } else {
        return this.sendResponse(res, req, {
          status: 200,
          message: "Image not provided. No action taken.",
          data: {
            fileName: "null",
          },
        });
      }
    } catch (err) {
      console.error(err);
      return this.sendResponse(res, req, {
        status: 500,
        message: "Internal Server Error",
      });
    }
  };
}

module.exports = { Files };
