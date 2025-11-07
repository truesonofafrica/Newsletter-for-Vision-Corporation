const express = require('express');
const router = express.Router();

const health = require('../utils/checkHealth');

router.get('/health', health);

module.exports = router;
