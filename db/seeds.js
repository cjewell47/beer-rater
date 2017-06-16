const mongoose   = require('mongoose');
const bluebird   = require('bluebird');
mongoose.Promise = bluebird;
const rp         = require('request-promise');
const env        = require('../config/env');

const databseURL = env.db;
mongoose.connect(databseURL);

const Beer = require('../models/beer');
const User = require('../models/user');

Beer.collection.drop();
User.collection.drop();


rp('https://api.punkapi.com/v2/beers')
  .then(htmlString => {
    const json = JSON.parse(htmlString);
    bluebird.map(json, beer => {
      return Beer.create({
        name: beer.name,
        tagline: beer.tagline,
        description: beer.description,
        image: beer.image_url,
        abv: beer.abv,
        dbId: beer.id
      });
    })
    .then(beers => {
      console.log(`${beers.length} beers were saved.`);
      process.exit();
    });
  })
  .catch(console.log);
