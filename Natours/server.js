/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
    useNewUrlParser: true
  })
  .then(() => {
    // console.log(conn.connections);
    console.log('DB conn is successfull!');
  })
  .catch((error) => console.log(error));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on ${port}...`);
});