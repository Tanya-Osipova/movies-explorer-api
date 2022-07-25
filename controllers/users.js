const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { NotFoundError } = require('../errors/not-found-error');
const { ConflictError } = require('../errors/conflict-error');
const { ValidationError } = require('../errors/validation-error');

const { NODE_ENV, JWT_SECRET } = process.env;

// GET
module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User does not exist');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

// UPDATE
module.exports.updateUser = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User already exists');
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          email: req.body.email,
        },
        {
          new: true,
          runValidators: true,
        },
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            throw new NotFoundError('User does not exist');
          }
          return res.send({ data: updatedUser });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else if (err.name === 'CastError') {
        next(new NotFoundError('Wrong id'));
      } else {
        next(err);
      }
    });
};

// CREATE
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('User already exists');
      }
      bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }))
        .then((newUser) => res.status(201).send({
          _id: newUser._id,
          email: newUser.email,
          name: newUser.name,
        }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('User already exists'));
      } else {
        next(err);
      }
    });
};

// LOGIN
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '24h' },
      );

      return res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
      })
        .status(200)
        .json({ message: 'Logged in successfully' });
    })
    .catch(next);
};
