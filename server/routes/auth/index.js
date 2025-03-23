const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'auth.controller.js');
const controller = require(absolutePath);

router.route('/login')
  .post(controller.login);

module.exports = router;
