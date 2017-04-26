const User = require('../models/user');
const Beer = require('../models/beer');

function sessionsNew(req, res) {
  res.render('sessions/new');
}

function sessionsCreate(req, res, next) {
  User
    .findOne({ email: req.body.email })
    .then((user) => {
      if (!user || !user.validatePassword(req.body.password)) {
        req.flash('danger', 'Unknown password/email combination');
        return res.redirect('/login');
      }
      req.session.userId = user._id;

      req.flash('info', `Welcome back ${user.username}`);
      res.redirect('/');
    })
    .catch(next);
}

function sessionsDelete(req, res) {
  return req.session.regenerate(() => res.redirect('/'));
}

function sessionsShow(req, res) {
  User
    .findById(req.session.userId)
    .exec()
    .then(user => {
      if (!user) {
        req.flash('danger', 'Unknown password/email combination');
        return res.redirect('/login');
      }
      return res.render('sessions/show', { user });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function sessionsFavourite(req, res) {
  Beer
    .findById(req.params.id)
    .exec()
    .then(beer => {
      if(!beer) {
        return res.render('error', { error: 'No beer was found.' });
      }
      // console.log(res.locals.user);
      User
        .findById(res.locals.user._id)
        .exec()
        .then(user => {
          user.favourites.push(beer);
          user.save(err => {
            console.log(err);
          })
          .populate(beer)
          .exec(function (err, user) {
            if(err) {
              return res.render('error', { error: err });
            }
            console.log('You favourited ', user.favourite.name);
          });
          // console.log(user.favourites);
        });
        // console.log(beer);
      res.redirect(`/beers/${beer.id}`);
    });
}

module.exports= {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete,
  show: sessionsShow,
  favourite: sessionsFavourite
};
