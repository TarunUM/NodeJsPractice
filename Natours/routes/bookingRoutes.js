const express = require('express');
// const bookingController = require('../controllers/bookingController');
const {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  checkoutSession,
  createBookingCheckout,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../controllers/authControllers');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourID', checkoutSession);

router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(getAllBookings).post(createBooking);
router.route('/:id').get(getBooking).put(updateBooking).delete(deleteBooking);

module.exports = router;
