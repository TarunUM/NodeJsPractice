const mongoose = require('mongoose');
const Tour = require('./tourModels');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// QUERY MIDDLEWARE

// 1) To Populate users And Tours
reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'user',
  //   select: 'name photo',
  // });

  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        noRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].noRatings,
      ratingsAverage: stats[0].averageRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// post can not call next() function
reviewSchema.post('save', function () {
  //this points to current review
  this.constructor.calcAverageRatings(this.tour);
});

//findByIdAndUpdate
//findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  // r = review
  //.clone() is imp for updated mongoose since findOne() is already executed
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // r = review
  //await this.findOne(); does not work here, query has already executed
  this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
