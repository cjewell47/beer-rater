const User = require('../models/user');

function sessionsNew(req, res) {
  res.render('sessions/new');
}

function sessionsCreate(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user || !user.validatePassword(req.body.password)) {
        return res.redirect('/login');
      }
      req.session.userId = user._id;

      res.redirect('/');
    })
    .catch(next);
}

function sessionsDelete(req, res) {
  return req.session.regenerate(() => res.redirect('/'));
}

module.exports= {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete
};
