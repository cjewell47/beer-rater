const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//
// });

const beerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  description: { type: String },
  abv: { type: String },
  image: { type: String },
  dbId: { type: String },
  comment: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    username: { type: String},
    body: { type: String, trim: true, required: true }
  }, {
    timestamps: true
  }]
});

module.exports = mongoose.model('Beer', beerSchema);
