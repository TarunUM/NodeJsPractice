const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const tourRouter = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

console.log('Environment =', process.env.NODE_ENV);

// MIddeleWares
// GLOBAL MIddeleWares

// Serving Static Files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

// Set Security HTTP headers
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//   })
// );

// The Order Matter for middleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit Requests from sams API requests
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// Body parse, reading data from body into req.body
app.use(
  express.json({
    limit: '100kb',
    extended: true,
  })
);
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
/* Parsing the cookie header and populating req.cookies with an object keyed by the cookie names. */
app.use(cookieParser());

// Data Sanitizaton against NoSql query injection /* "email":{ "$gt": ""} it works */
app.use(mongoSanitize());
// app.use(
//   mongoSanitize({
//     replaceWith: '_',
//   })
// );

// Data Sanitizaton against XSS
app.use(xssClean());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'authorization',
      'content-type',
      'dnt',
      'origin',
      'duration',
      'difficulty',
      'price',
      'maxGroupSize',
      'ratingQuantity',
      'ratingAverage',
    ],
  })
);

app.use(compression());

/* A middleware that parses the body of the request and sets it to req.body. */
app.use(express.text());

// //Custom middleWares
// app.use((req, res, next) => {
//   console.log("Hello from middleWare 👌");
//   next();
// });

// Test MiddleWare
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// Mounting Routers
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/booking', bookingRouter);

/* A middleware that is used to handle all the routes that are not defined in the app. */
app.use('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Route ${req.originalUrl} Not Found`,
  // });

  // const err = new Error(`Route ${req.originalUrl} not found on this server`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);

  next(new AppError(`Route ${req.originalUrl} not found on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

/*
app.get('/', (req, res) => {
    // res.status(200).send("hello from the server side!");
    res.status(200).json({message : 'hello from the server side!', app : "Natours"})
})

app.post(`/`, (req, res) => {
    res.send('got message You can post to this endpoints...')
})
*/

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
