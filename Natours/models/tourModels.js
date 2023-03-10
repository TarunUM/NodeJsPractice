const { query } = require('express');
const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      trim: true,
      unique: [true, 'A tour must have a unique name'],
      maxlength: [50, 'A tour name must be less than 50 characters'],
      minlength: [5, 'A tour name must be at least 5 characters'],
      // validate: [validator.isAlpha, 'The string must be alpha characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        default: 'easy',
        message: 'Difficulty must be easy, medium or difficult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'A tour must have a ratingAverage'],
      max: [5.0, 'A tour must have a ratingAverage'],
    },
    ratingQuality: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      default: 0,
      validate: function (value) {
        // this function will only be called if the new tour is created
        return value < this.price;
        message: `Discount for ${value} is not greater than ${this.price}`;
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Documentat middleware: runs before or after the .save() command and .create(), .remove(), .validate() command
// 'save' is called as HOOK
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware: runs before or after  all find methods
// pre: it runs before execution of the query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // this.find({ secretTour: { $eq: true } });
  this.start = Date.now();
  next();
});

// tourSchema.pre('findOne', function (next) {
//   this.find( {secretTour: {$ne: true}});
//   next();
// });

// post: it runs after execution of the query
tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);
  console.log(`Query took this time ${Date.now() - this.start} milliseconds`);
  next();
});

// Aggregate Middleware: runs before or after all find methods
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
