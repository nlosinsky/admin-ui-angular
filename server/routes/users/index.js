const express  =require('express');
const router = express.Router();
const path = require('node:path');
const absolutePath = path.resolve(__dirname, 'users.controller.js');
const controller = require(absolutePath);

router.route('/current')
  .get(controller.getCurrentUser);

module.exports = router;
