const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const tour = require('./../../models/tourModels');

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
const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8');

// Import All Tour Data From DB
const importdata = async () => {
  try {
    const data = JSON.parse(tours);
    await tour.create(data);
    console.log('Tour Data Imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete All Tour Data From DB
const deletedata = async () => {
  try {
    await tour.deleteMany();
    console.log('Tour Data Deleted');
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
