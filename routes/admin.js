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
    res.render('admin/view', {
      title: 'Admin Page',
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});



router.get('/car', auth, admin, async (req, res, next) => {
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







router.get('/account', auth, admin, async (req, res, next) => {
  try {
    const accounts = await db.getAllAccounts();

    res.render('admin/account/view', {
      title: 'Admin Page',
      accounts,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/account/add', auth, admin, async (req, res, next) => {
  try {
    const account_id = req.params.id;
    const account = await db.getAccountById(account_id);
    res.render('admin/account/add', {
      title: "Add account",
      account,
      auth: req.auth,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/account/edit/:id', auth, admin, async (req, res, next) => {
  try {
    const account_id = req.params.id;
    const account = await db.getAccountById(account_id);

    if (account) {
      res.render('admin/account/edit', {
        title: "Edit " + account.username,
        account,
        auth: req.auth,
      });
    } else {
      res.status(404).type('text/plain').send('account not found');
    }
  } catch (err) {
    next(err);
  }
});

router.get('/account/delete/:id', auth, admin, async (req, res, next) => {
  try {
    const account_id = req.params.id;
    const account = await db.getAccountById(account_id);
    
    if (account) {
      res.render('admin/account/delete', {
        title: "Delete " + account.username,
        account,
        auth: req.auth,
      });
    } else {
      res.status(404).type('text/plain').send('account not found');
    }
  } catch (err) {
    next(err);
  }
});


module.exports = router;