const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const dupField = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value entered: ${err.keyValue[dupField]} `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  // console.log('generated');
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenErrorDB = (err) =>
  new AppError('Invalid token. Please try again', 401);

const handleTokenExpiredErrorDB = (err) =>
  new AppError('Token expired. Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  console.error('ERROR 💥', err);

  // RENDERED WEBSITE / TEMPLATE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });

      // Programming or other unknown error: dont leak error information
    }
    // 1) Log Error
    console.error('ERROR 💥', err);

    // 2) Send generated error message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }

  // RENDERED WEBSITE / TEMPLATE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or other unknown error: dont leak error information
  // 1) Log Error
  console.error('ERROR 💥', err);

  // 2) Send generated error message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // 1) using spread .
    /* Sometimes this doesn't work*/
    // let error = { ...err };

    // 2) using  Object.assign() methoderr
    // let error = Object.assign({}, err);

    // 3) using JSON
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJsonWebTokenErrorDB(error);
    if (error.name === 'TokenExpiredError')
      error = handleTokenExpiredErrorDB(error);

    sendErrorProd(error, req, res);
  }
};
