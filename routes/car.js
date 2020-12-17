const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());



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

router.get('/:id/order', auth, async (req, res, next) => {
  try {


    const car_id = req.params.id;
    const car = await db.getCarById(car_id);

    if (car) {
      res.render('car/order', {
        title: car.name + " order",
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