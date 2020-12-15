const debug = require('debug')('app:api:admin');
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

global.current_id = null;


// Add car
router.post('/car/add', async (req, res, next) => {
  try {
    let car = null;
    let error = null;

    const schema = Joi.object({
      name: Joi.string().required().min(1).max(32).trim(),
      image: Joi.string().min(1).max(32).trim(),
      model: Joi.string().required().min(1).max(32).trim(),
      type: Joi.string().required().min(1).max(32).trim(),
      price: Joi.string().required(),
      year: Joi.string().required(),
      description: Joi.string().required().min(1).max(126).trim(),
      keywords: Joi.string().required().min(1).max(126).trim(),
    });

    car = await schema.validateAsync(req.body)
    car.image = "comingSoon.jpeg";
    if (!car) {
      error = 'Invalid fields';
    } else {


      if (isNaN(car.price)) {
        error = "price must be a number."
      }
      if (error) {

        res.render('admin/car/add', {
          title: "Add car",
          car,
          auth: req.auth,
          error: error
        });

      } else {
        car.price = parseInt(car.price)

        debug(typeof (car.price))
        await db.insertCar(car);
        res.render('added', {
          title: "Add Success",
          car,
        });

      }
    }
  } catch (err) {
    next(err);
  }
});


// Edit car
router.post('/car/edit/:id', async (req, res, next) => {
  try {

let error = "";

    const schema = Joi.object({
      _id: Joi.objectId().required(),
      name: Joi.string().required().min(1).max(32).trim(),
      image: Joi.string().min(1).max(32).trim(),
      model: Joi.string().required().min(1).max(32).trim(),
      type: Joi.string().required().min(1).max(32).trim(),
      price: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required().min(1).max(126).trim(),
      keywords: Joi.string().required().min(1).max(126).trim(),
    });

    car = await schema.validateAsync(req.body);
  
    debug('update car');
    //debug(car);

    if (!car) {
      error = 'Invalid fields';
    } else {

      if (isNaN(car.price)) {
        error = "Price must be a number."
      }

      if (isNaN(car.year)) {
        error = "Year must be a number."
      }
      if (error) {

        res.render('admin/car/edit', {
          title: "Edit " + car.name,
          car,
          auth: req.auth,
          error: error
        });

      } else {
        debug(car)
        await db.updateCar(car);
        res.render('edited', {
          title: "Edited Success",
          car,
        });

      }
    }
  } catch (err) {
    next(err);
  }
});

// DELETE car
router.post('/car/delete/:id', async (req, res, next) => {
  try {
    const schema = Joi.objectId().required();
    const id = await schema.validateAsync(req.params.id);
    debug(`delete car id=${id}`);
    await db.deleteCarById(id);
    res.render('deleted', {
      title: "Delete Success",
    });
  } catch (err) {
    next(err);
  }
});



module.exports = router;