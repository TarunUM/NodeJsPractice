const express = require('express');
const tourController = require('../controllers/tourControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`tour id is ${val}`);
  next();
});

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'manager'),
    tourController.deleteTour
  );

module.exports = router;
