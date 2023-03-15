const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authControllers');

const router = express.Router({ mergeParams: true });

// const router = express.Router();

// POST: /tours/234efg567/reviews
// POST: /reviews

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourAndUserId,
    reviewController.createReview
  );

router
  .route('/:id')
  .delete(reviewController.deleteReview)
  .get(reviewController.getReview)
  .patch(reviewController.updateReview);

module.exports = router;
