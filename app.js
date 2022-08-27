require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rate-limiter');
const error = require('./middlewares/error');

const { PORT = 3000 } = process.env;
const { MONGO_URI = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
})

);

app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_URI);

app.use('/api', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
