const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`tour id is ${val}`);
  next();
});

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
