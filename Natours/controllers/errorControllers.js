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
  console.log('generated');
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: dont leak error information
  } else {
    // 1) Log Error
    console.error('ERROR 💥', err);

    // 2) Send generated error message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // 1) using spread .
    /* Sometimes this doesn't work*/
    // let error = { ...err };

    // 2) using  Object.assign() methoderr
    // let error = Object.assign({}, err);

    // 3) using JSON
    let error = JSON.parse(JSON.stringify(err));

    if (error.name == 'CastError') error = handleCastErrorDB(error);
    if (error.code == 11000) error = handleDuplicateFieldsDB(error);
    if (error.name == 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
