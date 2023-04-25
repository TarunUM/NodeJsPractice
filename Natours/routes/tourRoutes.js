const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');
// const reviewController = require('./../controllers/reviewController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  // console.log(`tour id is ${val}`);
  next();
});

// POST: /tours/234efg567/reviews
// GET: /tours/234efg567/reviews
// GET: /tours/234efg567/reviews

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide', 'manager'),
    tourController.getMonthlyPlan
  );

// /tours-within/?distance=233&latlng=40,45&unit=km
// /tours-within/233/latlng/40,45/unit/km
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

// /distances/45,49/unit/km
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'manager'),
    tourController.deleteTour
  );

module.exports = router;
