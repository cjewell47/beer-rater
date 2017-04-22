const User = require('../models/user');

function registrationsNew(req, res) {
  res.render('registrations/new');
}

function registrationsCreate(req, res) {
  User
    .create(req.body)
    .then(() => {
      res.redirect('/login');
    })
    .catch((err) => {
      if(err.name === 'ValidationError') {
        res.redirect('/register');
      }
      res.status(500).end();
    });
}

module.exports= {
  new: registrationsNew,
  create: registrationsCreate
};
