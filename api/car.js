const debug = require('debug')('app:api:car');
const express = require('express');
const Joi = require('joi');
const db = require('../db');

const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());

const sendError = (err, res) => {
  if (err.isJoi) {
    res.json({
      error: err.details[0].message
    });
  } else {
    res.json({
      error: err.message
    });
  }
}


router.post('/:id/order', async (req, res, next) => {
  try {

    let order = null;
    let error = null;

    const schema = Joi.object({
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required(),
      car_id: Joi.string().required().min(24).max(24),
    });

    const car_id = req.params.id;
    const car = await db.getCarById(car_id);

    order = await schema.validateAsync(req.body)
    debug(order)
    if (!order) {
      error = 'Invalid fields';
    } else {

      const emailPattern = new RegExp(/^([^@]{1,})\@([A-Za-z0-9\.]{1,})\.([A-Za-z]{1,})$/);
      const phonePattern = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);

      if (!(phonePattern.test(order.phone))) {
        error = "Invalid Phone format."
      }
      if (!(emailPattern.test(order.email))) {
        error = "Invalid Email format."
      }

    }
    if (error) {
      res.render('car/order', {
        title: car.name + " order",
        car,
        account,
        error: error
      })

    } else {
      debug('insert order');
      await db.insertOrder(order);

      res.render('thankYou', {
        title: "Thank You",
        order,
        error: error,
      });
    }
  } catch (err) {
    next(err);
  }
});



module.exports = router;