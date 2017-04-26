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

    req.flash('success', `Welcome back ${user.username}`);
    res.redirect('/');
  })
  .catch(next);
}

function sessionsDelete(req, res) {
  return req.session.regenerate(() => res.redirect('/'));
}

function sessionsProfile(req, res) {
  User
  .findById(req.session.userId)
  .populate('favourites')
  .exec()
  .then(user => {
    if (!user) {
      req.flash('danger', 'Unknown password/email combination');
      return res.redirect('/login');
    }
    return res.render('sessions/profile', { user });
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}

function sessionsFavourite(req, res) {
  let beerf;
  Beer
  .findById(req.params.id)
  .exec()
  .then(beer => {
    // console.log('we got here', req.params.id)
    beerf = beer;
    if(!beer) {
      return res.render('error', { error: 'No beer was found.' });
    }
    // console.log(res.locals.user);
    User
    .findById(res.locals.user._id)
    .exec()
    .then(user => {
      if (user.favourites.indexOf(beerf._id) === -1) {
        user.favourites.push(beer);
        user.save(err => {
          console.log(err);
          req.flash('success', `${beer.name} was added to your favourites.`);
          res.redirect(`/beers/${beer.id}`);
        });
      } else {
        req.flash('danger', `${beer.name} is already in your favourites.`);
        res.redirect(`/beers/${beer.id}`);
      }
    });
  });
}



module.exports= {
  new: sessionsNew,
  create: sessionsCreate,
  delete: sessionsDelete,
  profile: sessionsProfile,
  favourite: sessionsFavourite
};
