const Tour = require('./../models/tourModels');

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    // results: tours.length,
    'requested at': req.requestTime,
    // data: {
    //   tours: tours,
    // },
  });
};

exports.getTour = (req, res) => {
  // adding ? infront of params means optional

  console.log(req.params);
  const id = req.params.id * 1;

  // if(id > tours.length){
  //     return res.status(404).json({
  //         status : 'fail',
  //         message : 'Invalid ID'
  //     })
  // }

  // const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      // tour: tour,
    },
  });
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  // const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid ID',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    message: 'Updated tour is here',
    // data: {
    //   tour: 'tour',
    // },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });

  // responding text/json after 204 status doesn't send any data
};
