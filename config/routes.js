const express       = require('express');
const router        = express.Router();
const beers         = require('../controllers/beers');
const sessions      = require('../controllers/sessions');
const registrations = require('../controllers/registrations');

router.get('/', (req, res) => res.render('statics/home'));

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

module.exports = router;
