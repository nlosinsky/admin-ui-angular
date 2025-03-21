const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'accounts.controller.js');
const controller = require(absolutePath);

router.route('/')
  .get(controller.getAccounts);

router.route('/')
  .post(controller.addAccount);

module.exports = router;
