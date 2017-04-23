const Beer = require('../models/beer');

function beersIndex(req, res) {
  Beer
    .find()
    .exec()
    .then(beers => {
      return res.render('beers/index', { beers });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function beersShow(req, res) {
  Beer
    .findById(req.params.id)
    .exec()
    .then(beer => {
      if (!beer) {
        return res.render('error', { error: 'No beer found.' });
      }
      return res.render('beers/show', { beer });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

module.exports= {
  index: beersIndex,
  show: beersShow
};
