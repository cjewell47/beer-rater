const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//
// });

const beerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  tagline: { type: String },
  description: { type: String },
  abv: { type: String },
  // avg: { type: String },
  image: { type: String },
  dbId: { type: String },
  comments: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    body: { type: String, trim: true, required: true },
    rating: { type: Number, required: true }
  }, {
    timestamps: true
  }]
});

beerSchema.virtual('averageRating').get(function () {
  if (this.comments.length === 0) return 0;
  const sum = this.comments.reduce((previous, current) => current += previous.rating);
  return sum / this.comments.length;
});

module.exports = mongoose.model('Beer', beerSchema);
