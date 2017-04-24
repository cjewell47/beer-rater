const Beer = require('../models/beer');

function commentsCreate(req, res, next) {
  // console.log(res.locals.user.username);
  Beer
    .findById(req.params.id)
    .exec()
    .then(beer => {
      if (!beer) {
        const err  = new Error('Beer not found.');
        err.status = 404;
        throw err;
      }

      const comment = {
        user: res.locals.user._id,
        username: res.locals.user.username,
        body: req.body.body
      };

      beer.comment.push(comment);

      return beer.save();
    })
    .then((beer) => {
      console.log(beer);
      res.redirect(`/beers/${req.params.id}`);
    })
    .catch(next);
}

module.exports= {
  create: commentsCreate
};
