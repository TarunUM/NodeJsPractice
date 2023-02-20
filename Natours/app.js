const express = require('express');
const fs = require('fs');
const morgan = require('morgan')

const app = express();

// MIddeleWares
// The Order Matter for middleWares
app.use(morgan('dev'));

app.use(express.json());
app.use(express.text());

//Custom middleWares
app.use((req, res, next) => {
    console.log('Hello from middleWare 👌')
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})


/*
app.get('/', (req, res) => {
    // res.status(200).send("hello from the server side!");
    res.status(200).json({message : 'hello from the server side!', app : "Natours"})
})

app.post(`/`, (req, res) => {
    res.send('got message You can post to this endpoints...')
})
*/

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    "requested at" : req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // adding ? infront of params means optional

  console.log(req.params);
  const id = req.params.id * 1;

  // if(id > tours.length){
  //     return res.status(404).json({
  //         status : 'fail',
  //         message : 'Invalid ID'
  //     })
  // }

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTours = Object.assign({ id: newId }, req.body);

  tours.push(newTours);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTours,
        },
      });
    }
  );

  // res.send('Done');
};

const updateTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Updated tour is here',
    data: {
      tour: 'tour',
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });

  // responding text/json after 204 status doesn't send any data
};

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on ${port}...`);
});
