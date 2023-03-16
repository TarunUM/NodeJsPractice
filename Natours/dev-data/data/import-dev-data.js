const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModels');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModal');

dotenv.config({ path: './../../config.env' });

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
  })
  .catch((error) => console.log(error));

//Read JSON File
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

// Import All Tour Data From DB
const importdata = async () => {
  try {
    const toursParsed = JSON.parse(tours);
    const reviewsParsed = JSON.parse(reviews);
    const usersParsed = JSON.parse(users);

    await Tour.create(toursParsed);
    await Review.create(reviewsParsed);
    await User.create(usersParsed, { validateBeforeSave: false });

    console.log('Data Imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete All Tour Data From DB
const deletedata = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('Data Deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importdata();
} else if (process.argv[2] === '--delete') {
  deletedata();
}

console.log(process.argv);
