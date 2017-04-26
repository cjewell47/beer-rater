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


// const letters = ['a', 'e', 'i', 'o', 'u', 'y'];
//
// getBeers();
//
// function getBeers() {
//   for ( let i = 0; i < letters.length; i++) {
//     setTimeout(() => {
//       rp(`https://api.brewerydb.com/v2/search?q=${letters[i]}&type=beer&key=46334ee126026181b04f8f030e8220ce&format=json`)
//       .then(data => {
//         console.log(data);
//         bluebird.map(data, beer => {
//           return Beer.create({
//             name: beer.name,
//             displayName: beer.nameDisplay,
//             description: beer.description,
//             abv: beer.abv,
//             image: beer.labels.medium,
//             dbId: beer.id
//           });
//         })
//         .then(beers => {
//           console.log(`${beers.length} were saved.`);
//           process.exit();
//         });
//       })
//       .catch(console.log);
//     },
//       3000);
//   }
// }
