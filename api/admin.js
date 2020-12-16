const debug = require('debug')('app:api:admin');
const express = require('express');
const Joi = require('joi');
const db = require('../db');
const bcrypt = require('bcrypt');


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












// Add account
router.post('/account/add', async (req, res, next) => {
  try {
    let account = null;
    let error = null;

    const schema = Joi.object({
      username: Joi.string().required().min(3).max(24).trim(),
      password: Joi.string().required().min(3).max(64).trim(),
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required(),
      keywords: Joi.string().required().min(1).max(200).trim(),
    });

    account = await schema.validateAsync(req.body)
    if (!account) {
      error = 'Invalid fields';
    } else {

      const emailPattern = new RegExp(/^([^@]{1,})\@([A-Za-z0-9\.]{1,})\.([A-Za-z]{1,})$/);
      const phonePattern = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);

      if (!(phonePattern.test(account.phone))) {
        error = "Invalid Phone format."
      }
      if (!(emailPattern.test(account.email))) {
        error = "Invalid Email format."
      }

      // let usernameCheck = await db.getAccountsByUsername(account.username);
      // let emailCheck = await db.getAccountsByEmail(account.email);

      // if (account.username !== usernameCheck) {
      //   error = 'Username already exists.';
      // }

      // if (emailCheck) {
      //   error = 'Email already exists.'
      // }
    }
    if (error) {
      res.render('admin/account/add', {
        account,
        error: error
      })
    } else {

      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );

      account.password = hashedPassword;

      debug(account)
      await db.insertAccount(account);
      res.render('added', {
        title: "Added Success",
        account,
      });

    }
  } catch (err) {
    next(err);
  }
});


// Edit car
router.post('/account/edit/:id', async (req, res, next) => {
  try {

    let account = null;
    let error = null;

    const schema = Joi.object({
      _id: Joi.objectId().required(),
      username: Joi.string().required().min(3).max(24).trim(),
      password: Joi.string().required().min(3).max(64).trim(),
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required(),
      keywords: Joi.string().required().min(1).max(200).trim(),
    });

    account = await schema.validateAsync(req.body)
    if (!account) {
      error = 'Invalid fields';
    } else {

      const emailPattern = new RegExp(/^([^@]{1,})\@([A-Za-z0-9\.]{1,})\.([A-Za-z]{1,})$/);
      const phonePattern = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);

      if (!(phonePattern.test(account.phone))) {
        error = "Invalid Phone format."
      }
      if (!(emailPattern.test(account.email))) {
        error = "Invalid Email format."
      }

      // let usernameCheck = await db.getAccountsByUsername(account.username);
      // let emailCheck = await db.getAccountsByEmail(account.email);

      // if (account.username !== usernameCheck) {
      //   error = 'Username already exists.';
      // }

      // if (emailCheck) {
      //   error = 'Email already exists.'
      // }
    }
    if (error) {
      res.render('admin/account/edit', {
        title: "Edit" + account.username,
        account,
        error: error
      })
    } else {

      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );

      account.password = hashedPassword;

      debug(account)
      await db.updateAccount(account);
      res.render('edited', {
        title: "Edited Success",
        account,
      });

    }
  } catch (err) {
    next(err);
  }

});

// DELETE account
router.post('/account/delete/:id', async (req, res, next) => {
  try {
    const schema = Joi.objectId().required();
    const id = await schema.validateAsync(req.params.id);
    debug(`delete account id=${id}`);
    await db.deleteAccountById(id);
    res.render('deleted', {
      title: "Delete Success",
    });
  } catch (err) {
    next(err);
  }
});














// Add order
router.post('/order/add', async (req, res, next) => {
  try {
    let order = null;
    let error = null;

    const schema = Joi.object({
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required(),
      car_id: Joi.string().required(),
      keywords: Joi.string().required().min(1).max(200).trim(),
    });

    order = await schema.validateAsync(req.body)
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
      res.render('admin/order/add', {
        order,
        error: error
      })
    } else {


      debug(order)
      await db.insertOrder(order);
      res.render('added', {
        title: "Added Success",
        order,
      });

    }
  } catch (err) {
    next(err);
  }
});


// Edit order
router.post('/order/edit/:id', async (req, res, next) => {
  try {

    let order = null;
    let error = null;

    const schema = Joi.object({
      _id: Joi.objectId().required(),
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required(),
      car_id: Joi.objectId().required(),
      keywords: Joi.string().required().min(1).max(200).trim(),
    });

    order = await schema.validateAsync(req.body)
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
      res.render('admin/order/edit', {
        title: "Edit" + order.username,
        order,
        error: error
      })
    } else {


      debug(order)
      await db.updateOrder(order);
      res.render('edited', {
        title: "Edited Success",
        order,
      });

    }
  } catch (err) {
    next(err);
  }

});

// DELETE order
router.post('/order/delete/:id', async (req, res, next) => {
  try {
    const schema = Joi.objectId().required();
    const id = await schema.validateAsync(req.params.id);
    debug(`delete order id=${id}`);
    await db.deleteOrderById(id);
    res.render('deleted', {
      title: "Delete Success",
    });
  } catch (err) {
    next(err);
  }
});


// router.get('/order', async (req, res, next) => {
//   try {
//     const q = req.query.q;

//     const sortBy = req.query.sortBy;
//     const collation = {
//       locale: 'en_US',
//       strength: 1
//     };


//     const matchStage = {};
//     if (q) {
//       matchStage.$text = {
//         $search: q
//       };
//     }


//     let sortStage = null;
//     switch (sortBy) {
//       case 'name_A':
//         sortStage = {
//           lastName: 1
//         };
//         break;
//       case 'name_Z':
//         sortStage = {
//           lastName: -1
//         };
//         break;
//       case 'email':
//         sortStage = {
//           email: 1
//         };
//         break;
//       case 'relevance':
//       default:
//         sortStage = q ? {
//           relevance: -1
//         } : {
//           lastName: 1
//         };
//         break;
//     }


//     const pipeline = [{
//         $match: matchStage
//       },
//       {
//         $project: {
//           email: 1,

//           lastName: 1,
//           relevance: q ? {
//             $meta: 'textScore'
//           } : null,
//         },
//       },
//       {
//         $sort: sortStage
//       }
//     ];

//     const conn = await db.connect();
//     const cursor = conn
//       .collection('orders')
//       .aggregate(pipeline, {
//         collation: collation
//       });

//     res.type('application/json');
//     res.write('[\n');
//     for await (const doc of cursor) {
//       res.write(JSON.stringify(doc));
//       res.write(',\n');
//     }
//     res.end('null]');
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = router;