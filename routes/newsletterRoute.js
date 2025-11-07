const express = require('express');
const router = express.Router();

const newsletterController = require('../controller/newsletterController');

router.post('/subscribe', newsletterController.subscribeUser);
router.get('/unsubscribe', newsletterController.unsubscribeUser);
router.post('/send', newsletterController.sendNewsletter);

module.exports = router;
