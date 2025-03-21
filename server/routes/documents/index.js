const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'documents.controller.js');
const controller = require(absolutePath);

router.route('/')
  .get(controller.getDocuments);

module.exports = router;
