const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { NotFoundError } = require('../errors/not-found-error');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

// SIGNUP
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

// SIGNIN
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

// LOGOUT
router.get('/signout', (req, res) => res
  .clearCookie('jwt')
  .status(200)
  .json({ message: 'Successfully logged out' }));

// USERS
router.use('/users', require('./users'));

// MOVIES
router.use('/movies', require('./movies'));

// ERRORS
router.use('*', () => {
  throw new NotFoundError('Not found');
});
