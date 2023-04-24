const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModels');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.checkoutSession = catchAsync(async (req, res, next) => {
  // 1) Get thw currently booked Tour
  const tour = await Tour.findById(req.params.tourID);

  // 2) Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `http://localhost:3000/`,
    cancel_url: `http://localhost:3000/tours/${tour.slug}`,
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
