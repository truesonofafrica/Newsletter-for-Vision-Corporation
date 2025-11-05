const express = require('express');
const router = express.Router();

const newsletterController = require('../controller/newsletterController');
const { health } = require('../utils/checkHealth');

router.post('/subscribe', newsletterController.subscribeUser);
router.get('/unsubscribe', newsletterController.unsubscribeUser);
router.get('/health', health);
router.post('/send', newsletterController.sendNewsletterToAll);

module.exports = router;
