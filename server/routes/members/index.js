const express = require('express');
const path = require('node:path');
const router = express.Router();
const absolutePath = path.resolve(__dirname, 'members.controller.js');
const controller = require(absolutePath);

router.route('/approved')
  .get(controller.getApprovedMembers);

router.route('/pending')
  .get(controller.getPendingMembers);

router.route('/:id')
  .patch(controller.updateMember)

router.route('/:id')
  .get(controller.getMember)

module.exports = router;
