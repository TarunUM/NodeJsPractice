const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // console.log(req.requestTime);

  // Execute the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .pagination();

  const tours = await features.query;
  // query.sort().select().skip().limit()

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });

  // try {
  //   // let query = Tour.find(JSON.parse(queryString));

  //   // const query = await Tour.find()
  //   //   .where('duration')
  //   //   .equals(5)
  //   //   .where('difficulty')
  //   //   .equals('easy');

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

exports.getTour = catchAsync(async (req, res, next) => {
  // adding ? infront of params means optional
  const tour = await Tour.findById(req.params.id).populate({
    path: 'reviews',
  });
  // Tour.findOne({ _id: req.params.id });

  if (!tour) {
    return next(new AppError('No tour found with id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });

  // try {
  //   console.log(req.params);

  // } catch (err) {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

exports.createTour = catchAsync(async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // runValidators: it validates the updated tour as once we created the tour

  if (!tour) {
    return next(new AppError('No tour found with id', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Updated tour is here',
    data: {
      tour,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
});

// exports.deleteTour = async (req, res) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with id', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     message: 'Deleted tour is here',
//   });

//   // try {

//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }

//   // responding text/json after 204 status doesn't send any data
// };

exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: {
      stats,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
};

exports.getMonthlyPlan = async (req, res) => {
  const year = parseInt(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
        month: 1,
        numTours: 1,
        tours: 1,
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: {
      plan,
    },
  });

  // try {

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err.message,
  //   });
  // }
};
