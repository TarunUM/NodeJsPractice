const Tour = require('./../models/tourModels');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const Booking = require('../models/bookingModal');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build Template

  // 3) Render That template using tour data from *1 collection

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) get Tour data, for the requested tour (including and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'revies rating user',
  });

  if (!tour) {
    return next(new appError('There is no Tour with this name', 404));
  }

  // 2)BUILD TEMPLEATE
  // 3) Render the template using the data from 1)
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Tour Account',
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Tour Account',
    user: updatedUser,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) find all Bookings for the current user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((booking) => booking.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});
