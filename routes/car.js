const express = require('express');
const db = require('../db');


const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());

router.get('/', async (req, res, next) => {
  try {
    res.render('search', {
      title: 'Car Rescue',
    });

  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const car_id = req.params.id;
    const car = await db.getCarById(car_id);

    car.price = (car.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    if (car) {
      res.render('car/view', {
        title: car.name,
        car,
      });
    } else {
      res.status(404).type('text/plain').send('car not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id/order', async (req, res, next) => {
  try {
    if (current_id != null) {
      account = await db.getAccountById(current_id);
    }
    else{
      account = null
    }

    const car_id = req.params.id;
    const car = await db.getCarById(car_id);

    if (car) {
      res.render('car/order', {
        title: car.name + " order",
        car,
        account
      });
    } else {
      res.status(404).type('text/plain').send('car not found');
    }
  } catch (err) {
    next(err);
  }
});




module.exports = router;