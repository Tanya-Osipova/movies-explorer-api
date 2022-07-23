const Movie = require('../models/movie');
const { NotFoundError } = require('../errors/not-found-error');
const { ValidationError } = require('../errors/validation-error');
const { ForbiddenError } = require('../errors/forbidden-error');

// GET
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

// POST
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

// DELETE
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Movie does not exist');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Not allowed');
      }
      return movie.remove();
    })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};
