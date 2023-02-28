const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// MIddeleWares
// The Order Matter for middleWares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.text());
app.use(express.static(`${__dirname}/public`));

//Custom middleWares
app.use((req, res, next) => {
  // console.log("Hello from middleWare 👌");
  next();
});
app.use((req, res, next) => {
  // req.requestTime = new Date().toISOString();
  next();
});

// Mounting Routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRoutes);

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
