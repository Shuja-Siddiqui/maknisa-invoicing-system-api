const { Files } = require('../handlers');
const router = require('express').Router();
const handler = new Files();
router.get('/:id', handler.getFile);
router.post('/', handler.upload);
router.patch('/:id', handler.updateFile);
module.exports = {
  files: router,
};
