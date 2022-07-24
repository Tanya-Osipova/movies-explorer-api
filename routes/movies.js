const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// GET
router.get('/', getMovies);

// POST
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(www\.)?[a-zA-Z0-9-]+\.\w{2,}\/?\S*#?$/),
    nameEN: Joi.string().required(),
    nameRU: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

// DELETE
router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().min(24).max(24),
  }),
}), deleteMovie);

module.exports = router;
