const bcrypt = require('bcrypt');
const password = 'password';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if(err){
    console.error(err)
  }
  else{
    console.log(password);
    console.log(hash);
  }
})

// node password_hashing