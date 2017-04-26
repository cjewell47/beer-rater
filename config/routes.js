const express       = require('express');
const router        = express.Router();
const beers         = require('../controllers/beers');
const sessions      = require('../controllers/sessions');
const registrations = require('../controllers/registrations');
const comments      = require('../controllers/comments');

function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in to see that...');
      res.redirect('/login');
    });
  }
  next();
}

router.get('/', (req, res) => res.render('statics/home'));

router.route('/beers')
  .get(beers.index)
  .post(secureRoute, beers.create);
router.route('/beers/new')
  .get(secureRoute, beers.new);
router.route('/beers/:id')
  .get(secureRoute, beers.show)
  .put(secureRoute, beers.update);
router.route('/beers/:id/edit')
  .get(secureRoute, beers.edit);
router.route('/beers/:id')
  .delete(secureRoute, beers.delete);
router.route('/beers/:id')
  .post(secureRoute, comments.create);

router.route('/profile')
  .get(secureRoute, sessions.profile);

router.route('/beers/:id/favourite')
  .get(secureRoute, sessions.favourite);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

module.exports = router;
