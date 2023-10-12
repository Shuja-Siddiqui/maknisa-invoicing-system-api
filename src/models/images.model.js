const { Schema, model } = require('mongoose');

const image = Schema({
  mimetype: String,
  data: Buffer,
  name: String,
});

const Image = model('Image', image);
module.exports = { Image };
