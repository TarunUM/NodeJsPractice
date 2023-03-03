/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// uncaught exceptions is for synchronous error
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception 💥 shutting down');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = require('./app');

// for Local host
// const DB = DATABASE_LOCAL

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', true);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    // console.log(conn.connections);
    console.log('DB conn is successfull!');
  });
// .catch((error) => {
//   // console.log(error);
//   console.log('DB conn error');
// });

/* Testing Mongoose */
// const testTour = new Tour({
//   name: 'The Snow Leopard',
//   price: 997,
// });

// testTour
//   .save()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     // console.log(err);
//     console.log(err.message + '💥');
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection 💥 shutting down');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
