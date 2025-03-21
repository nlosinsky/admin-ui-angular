const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'companies.controller.js');
const controller = require(absolutePath);

router.route('/')
  .get(controller.getCompanies);

router.route('/:id')
  .get(controller.getCompany)

router.route('/:id')
  .patch(controller.updateCompany);

module.exports = router;
