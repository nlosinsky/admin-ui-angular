const express  =require('express');
const router = express.Router();
const path = require('node:path');
const absolutePath = path.resolve(__dirname, 'transactions.controller.js');
const controller = require(absolutePath);

router.get('/', controller.getTransactionsCount);

module.exports = router;
