// routes/subscriberRoutes.js
const express = require('express');
const subscriberController = require('../controllers/subscriberControllers');

const router = express.Router();

router.post('/subscribe', subscriberController.addSubscriber);
router.post('/send-promo', subscriberController.sendPromo);
router.get('/subscribers', subscriberController.getSubscribers);
router.delete('/subscribers/:id', subscriberController.removeSubscriber);


module.exports = router;
