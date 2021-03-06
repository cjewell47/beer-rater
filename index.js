const express         = require('express');
const expressLayouts  = require('express-ejs-layouts');
const bodyParser      = require('body-parser');
const mongoose        = require('mongoose');
const methodOverride  = require('method-override');
const session         = require('express-session');
const flash           = require('express-flash');

const app             = express();
const env             = require('./config/env');
const User            = require('./models/user');
const router          = require('./config/routes');

mongoose.connect(env.db);

app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

app.use(expressLayouts);
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'Gaaaaawww',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  if (!req.session.userId) return next();

  User
    .findById(req.session.userId)
    .exec()
    .then(user => {
      if (!user) {
        return req.session.regenerate(() => {
          req.flash('danger', 'You must be logged in to see that...');
          res.redirect('/login');
        });
      }
      res.locals.user = user;
      res.locals.isLoggedIn = true;

      next();
    });
});

app.use(flash());

app.use(router);

app.listen(env.port, () => console.log(`Server up and running on port: ${env.port}.`));
