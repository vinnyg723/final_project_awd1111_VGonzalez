const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const debug = require('debug')('app:api:admin');

const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());

router.get('/', auth, admin, async (req, res, next) => {
  try {
    const cars = await db.getAllCars();



    res.render('admin/car/view', {
      title: 'Admin Page',
      cars,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/car/add', auth, admin, async (req, res, next) => {
  try {
    const car_id = req.params.id;
    const car = await db.getCarById(car_id);
    res.render('admin/car/add', {
      title: "Add car",
      car,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/car/edit/:id', auth, admin, async (req, res, next) => {
  try {
    const car_id = req.params.id;
    const car = await db.getCarById(car_id);

    if (car) {
      res.render('admin/car/edit', {
        title: "Edit " + car.name,
        car,
        auth: req.auth,
      });
    } else {
      res.status(404).type('text/plain').send('car not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/car/delete/:id', auth, admin, async (req, res, next) => {
  try {
    const car_id = req.params.id;
    const car = await db.getCarById(car_id);
    
    if (car) {
      res.render('admin/car/delete', {
        title: "Delete " + car.name,
        car,
        auth: req.auth,
      });
    } else {
      res.status(404).type('text/plain').send('car not found');
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;