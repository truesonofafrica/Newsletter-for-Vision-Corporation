const express = require('express');
const router = express.Router();

const brevoContactUs = require('../controller/contactUsController');
router.post('/', brevoContactUs);

module.exports = router;
