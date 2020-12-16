const db = require('../db');
const express = require('express');
const debug = require('debug')('app:api:account');
const Joi = require('joi');
const chalk = require('chalk');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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



router.post('/login', async (req, res, next) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    debug(`login "${username}" "${password}"`);

    let account = null;
    let error = null;
    if (!username) {
      error = 'Username is required.';
    } else if (!password) {
      error = 'Password is required.';
    } else {
      account = await db.getAccountByUsername(username);
      if (!account) {
        account = await db.getAccountByEmail(username);
      }
      //if (!account || account.hash_password != password) {
      if (!account || !(await bcrypt.compare(password, account.password))) {
        error = 'Username/Password Invalid';
      } else {
        error = null;
      }
    }

    if (error) {
      res.render('account/login', {
        title: 'Login',
        username: username,
        error: error,
      });
    } else {
      const payload = {
        account_id: account._id,
        username: account.username,
        email: account.email,
        is_admin: account.is_admin,
        type: 'login',
      };

      global.current_id = payload.account_id;

      const secret = config.get('auth.secret');
      const token = jwt.sign(payload, secret, {
        expiresIn: '1h'
      });
      res.cookie('auth_token', token, {
        //is per-millisecond
        maxAge: 60 * 60 * 5000
      });

      //Redirect
      res.redirect('/');

    }
  } catch (err) {
    next(err);
  }
});

router.post('/register', async (req, res, next) => {
  try {
    debug(chalk.bgRed(chalk.black('--  Try Register --')));

    let account = null;
    let error = null;

    const schema = Joi.object({
      username: Joi.string().required().min(3).max(24).trim(),
      password: Joi.string().required().min(3).trim(),
      confirmPassword: Joi.string().required().min(3).trim(),
      firstName: Joi.string().required().min(3).max(32).trim(),
      lastName: Joi.string().required().min(3).max(32).trim(),
      email: Joi.string().required().max(36).trim().lowercase(),
      phone: Joi.string().required()
    });

    account = await schema.validateAsync(req.body)
    if (!account) {
      error = 'Invalid fields';
    }
    else{
      if (!(account.password == account.confirmPassword)) {
        error = 'Passwords do not match.';
      }
    const emailPattern = new RegExp(/^([^@]{1,})\@([A-Za-z0-9\.]{1,})\.([A-Za-z]{1,})$/);
    const phonePattern = new RegExp(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/);
    const passwordPattern = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/);
    if (!(phonePattern.test(account.phone))) {
      error = "Invalid Phone format."
    }
    if (!(emailPattern.test(account.email))) {
      error = "Invalid Email format."
    }
    if (!(passwordPattern.test(account.password)) || (account.password == 'P@ssw0rd')) {
      error = "Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    }
    let usernameCheck = await db.getAccountsByUsername(account.username);
    let emailCheck = await db.getAccountsByEmail(account.email);

    if (usernameCheck) {
      error = 'Username already exists.';
    }

    if (emailCheck) {
      error = 'Email already exists.'
    }
  }

  
  
    if (error) {
      res.render('account/register', {
        title: 'Register',
        error: error,
        account
      })
    } else {

      const hashedPassword = await bcrypt.hash(
        req.body.password,
        10
      );

      account.password = hashedPassword;

      await db.insertAccount(account);

      debug(chalk.bgGreen(chalk.black('--  Register Success --')));
      //Redirect
      res.redirect('/account/login');

    }
  } catch (err) {
    
    res.render('account/register', {
      title: 'Register',
      error: err,
    })
  }
});



module.exports = router;