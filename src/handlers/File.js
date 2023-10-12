const Response = require('./Response');
const fs = require('node:fs');
const path = require('node:path');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const { Image } = require('../models/images.model');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class Files extends Response {
  updateFile = async (req, res) => {
    const image = req.files.avatar;
    const { mimetype, data, name } = image;
    const { id } = req.params;
    const temp = await sharp(data).webp({ quality: 20 }).toBuffer();
    const updatedData = { mimetype, data: temp, name };
    const updateImage = await Image.updateOne(
      { _id: id },
      { $set: updatedData }
    );
    if (updateImage?.modifiedCount > 0) {
      return this.sendResponse(res, req, {
        status: 200,
        message: 'Image updated',
      });
    }
    return this.sendResponse(res, req, {
      status: 404,
      message: 'Image not found!',
    });
  };
  getFile = async (req, res) => {
    try {
      const { id } = req.params;
      const image = await Image.findOne({ _id: id });
      if (!image) {
        return this.sendResponse(res, req, {
          status: 404,
          message: 'Image not found!',
        });
      }
      res.setHeader('content-type', image?.mimetype);
      return res.status(200).send(image?.data);
    } catch (err) {
      console.log(err);
      return this.sendResponse(res, req, {
        status: 500,
        message: 'Internal Server Error',
      });
    }
  };
  upload = async (req, res) => {
    try {
      const avatar = req.files ? req.files.avatar : null;
      const temp = await sharp(avatar.data)
        .webp({ quality: 20 })
        .toFile('C:\\Users\\Hp\\Pictures\\maknisa\\' + avatar.name);
      // console.log(temp);
      // if (avatar !== null) {
      //   const name = `${Date.now()}-${avatar.name}`;
      //   const body = avatar.data;
      //   const uploadParams = {
      //     Bucket: process.env.AWS_BUCKET_NAME,
      //     Key: name,
      //     Body: body,
      //   };
      //   return s3.upload(uploadParams, (err, data) => {
      //     if (err)
      //       return this.sendResponse(res, req, {
      //         status: 400,
      //         message: 'Error while uploading',
      //       });
      //     return this.sendResponse(res, req, {
      //       status: 200,
      //       data: {
      //         fileName: name,
      //       },
      //     });
      //   });
      // } else {
      //   return this.sendResponse(res, req, {
      //     status: 200,
      //     message: 'Image not provided. No action taken.',
      //     data: {
      //       fileName: 'null',
      //     },
      //   });
      // }
      return this.sendResponse(res, res, { status: 200, message: 'ok' });
    } catch (err) {
      console.error(err);
      return this.sendResponse(res, req, {
        status: 500,
        message: 'Internal Server Error',
      });
    }
  };
}

module.exports = { Files };
