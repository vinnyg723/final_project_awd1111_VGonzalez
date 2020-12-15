const express = require('express');

const router = express.Router();
router.use(express.urlencoded({
  extended: false
}));
router.use(express.json());

// REGISTER ------------------------------

router.get('/register', (req, res) =>
  res.render('account/register', {
    title: 'Register Page'
  })
);


// LOGIN ------------------------------

router.get('/login', (req, res) =>
  res.render('account/login', {
    title: 'Login Page'
  })
);

// LOGOUT -----------------------

router.get('/logout', (req, res) => {
  global.current_id = null;
  res.clearCookie('auth_token');
  res.redirect('/account/login');
});


module.exports = router;