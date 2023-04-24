const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.get(
  '/checkout-session/:tourID',
  authController.protect,
  bookingController.checkoutSession
);

module.exports = router;
