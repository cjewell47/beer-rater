const User = require('../models/user');
const Beer = require('../models/beer');

function usersProfile(req, res) {
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

function usersFavourite(req, res) {
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

module.exports={
  profile: usersProfile,
  favourite: usersFavourite
};
