const Tour = require('./../models/tourModels');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build Template

  // 3) Render That template using tour data from *1 collection

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'revies rating user',
  });
  // 1) get Tour data, for the requested tour (including and guides)

  // 2)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
