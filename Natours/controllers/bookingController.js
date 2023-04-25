const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const Booking = require('./../models/bookingModal');

exports.checkoutSession = catchAsync(async (req, res, next) => {
  // 1) Get thw currently booked Tour
  const tour = await Tour.findById(req.params.tourID);

  /* success_url: `http://localhost:3000/`,
  cancel_url: `http://localhost:3000/tours/${tour.slug}`, */

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${tour.name} Tour`,
            description: `${tour.summary}`,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create a session as Response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async function (req, res, next) {
  // This is only for testing purposes because it is not secure
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
