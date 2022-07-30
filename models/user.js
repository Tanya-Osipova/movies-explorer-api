const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { UnauthorizedError } = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email address is required'],
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'User name is required'],
    minlength: [2, 'User name should contain mimimum 2 characters'],
    maxlength: [30, 'User name should contain maximum 30 characters'],
  },
});

// Find user by email
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Email or Password is not correct'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Email or Password is not correct'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
