const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authControllers');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedin,
  viewsController.getOverview
);
router.get('/tours/:slug', authController.isLoggedin, viewsController.getTour);
router.get('/login', authController.isLoggedin, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
