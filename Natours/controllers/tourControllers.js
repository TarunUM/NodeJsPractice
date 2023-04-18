const AppError = require('../utils/appError');
const Tour = require('./../models/tourModels');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not An Image, Please Upload Only Images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 4 },
]);

// single field
// upload.array('images', 3)

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover && req.files.images) return next();

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const imagesFileName = `tour-${req.params.id}-${Date.now()}-${
        0 + index
      }.jpeg`;

      await sharp(req.files.images[index].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${imagesFileName}`);

      req.body.images.push(imagesFileName);
    })
  );
  console.log(req.body);
  next();
});

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  next();
};

exports.deleteTour = factory.deleteOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.createTour = factory.createOne(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);

exports.getTourStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
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

// /tours-within/?distance=233&latlng=36.169717,-115.138706&unit=km
// /tours-within/233/latlng/36.169717,-115.138706/unit/km
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng)
    return next(
      new AppError(
        'Please Provide Latitude and longitude in the format lat,lng.',
        400
      )
    );

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  // console.log(distance, lat, lng, unit);

  res.status(200).json({
    status: 'OK',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const Multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng)
    return next(
      new AppError(
        'Please Provide Latitude and longitude in the format lat,lng.',
        400
      )
    );

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [+lng, +lat],
        },
        distanceField: 'distance',
        distanceMultiplier: Multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'OK',
    result: distances.length,
    data: {
      data: distances,
    },
  });
});

/*  Factory Function eliminated all these functions into a single function  */

// exports.getAllTours = catchAsync(async (req, res) => {
//   // console.log(req.requestTime);

//   // Execute the query
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limit()
//     .pagination();

//   const tours = await features.query;
//   // query.sort().select().skip().limit()

//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });

//   // try {
//   //   // let query = Tour.find(JSON.parse(queryString));

//   //   // const query = await Tour.find()
//   //   //   .where('duration')
//   //   //   .equals(5)
//   //   //   .where('difficulty')
//   //   //   .equals('easy');

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.getTour = catchAsync(async (req, res, next) => {
//   // adding ? infront of params means optional
//   const tour = await Tour.findById(req.params.id).populate({
//     path: 'reviews',
//   });
//   // Tour.findOne({ _id: req.params.id });

//   if (!tour) {
//     return next(new AppError('No tour found with id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });

//   // try {
//   //   console.log(req.params);

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.createTour = catchAsync(async (req, res) => {
//   // const newTour = new Tour({});
//   // newTour.save();
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });

//   // try {

//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

// exports.updateTour = catchAsync(async (req, res) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   // runValidators: it validates the updated tour as once we created the tour

//   if (!tour) {
//     return next(new AppError('No tour found with id', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'Updated tour is here',
//     data: {
//       tour,
//     },
//   });

//   // try {

//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: err.message,
//   //   });
//   // }
// });

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
