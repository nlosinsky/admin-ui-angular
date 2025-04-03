const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'constant-data.controller.js');
const controller = require(absolutePath);

router.route('/countries')
  .get(controller.getCountries);

module.exports = router;
