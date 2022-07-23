const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Country is required'],
  },
  director: {
    type: String,
    required: [true, 'Director is required'],
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    validate: {
      validator: (v) => {
        const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/;
        return v.match(regex);
      },
      message: 'Invalid URL',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Trailer link is required'],
    validate: {
      validator: (v) => {
        const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/;
        return v.match(regex);
      },
      message: 'Invalid URL',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required'],
    validate: {
      validator: (v) => {
        const regex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/;
        return v.match(regex);
      },
      message: 'Invalid URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Owner is required'],
  },
  movieId: {
    type: String,
    required: [true, 'Movie id is required'],
  },
  nameRU: {
    type: String,
    required: [true, 'Russian name is required'],
  },
  nameEN: {
    type: String,
    required: [true, 'English name is required'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
