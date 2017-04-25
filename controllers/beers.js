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

    const averageRating = beer.comments.map(comment => {
      return comment.rating;
    });

    let sum = 0;
    for( var i = 0; i < averageRating.length; i++ ){
      sum += parseInt( averageRating[i], 10 ); //don't forget to add the base
    }

    const avg = sum/averageRating.length;
    
    return res.render('beers/show', { beer, avg });
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}

function beersNew(req, res) {
  return res.render('beers/new');
}

function beersCreate(req, res) {
  Beer
  .create(req.body)
  .then(beer => {
    if (!beer) {
      return res.render('error', { error: 'No beer was created.' });
    }
    return res.redirect('/beers');
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}

function beersEdit(req, res) {
  Beer
  .findById(req.params.id)
  .exec()
  .then(beer => {
    if (!beer) {
      return res.render('error', { error: 'No beer was found.' });
    }
    return res.render('beers/edit', { beer });
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}

function beersUpdate(req, res) {
  Beer
  .findById(req.params.id)
  .exec()
  .then(beer => {
    if (!beer) {
      return res.render('error', { error: 'No beer was found.' });
    }
    for (const field in req.body) {
      beer[field] = req.body[field];
    }
    return beer.save();
  })
  .then(beer => {
    if (!beer) {
      return res.render('error', { error: 'Something went wrong in the update. '});
    }
    return res.render('beers/show', { beer });
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}

function beersDelete(req, res) {
  Beer
  .findByIdAndRemove(req.params.id)
  .exec()
  .then(() => {
    return res.redirect('/beers');
  })
  .catch(err => {
    return res.render('error', { error: err });
  });
}


module.exports= {
  index: beersIndex,
  show: beersShow,
  new: beersNew,
  create: beersCreate,
  edit: beersEdit,
  update: beersUpdate,
  delete: beersDelete
};
