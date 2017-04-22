const mongoose = require('mongoose');

const beerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  description: { type: String },
  abv: { type: String },
  image: { type: String },
  dbId: { type: String }
});

module.exports = mongoose.model('Beer', beerSchema);
