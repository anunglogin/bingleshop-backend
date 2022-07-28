const bcrypt = require('bcrypt');
const { users, sequelize } = require('../models');
const logger = require('../middlewares/logger');
const { isTokenValid, refreshToken } = require('../middlewares/verifyToken');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const findEmail = await users.findOne({ where: { email: email } });
    if (!findEmail) {
      await sequelize.transaction(async (transaction) => {
        const insert = await users.create(req.body, { transaction });
        if (insert) {
          return res.status(201).json({
            message: 'User created successfully',
            data: {
              id: insert.id,
              email: insert.email,
              firstName: insert.firstName,
              lastName: insert.lastName,
              address: insert.address,
              phone: insert.phone,
              createdAt: insert.createdAt
            }
          });
        }
        return res.status(400).json({
          message: 'User not created'
        });
      });
    } else {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }
  } catch (error) {
    logger('signup').error(error);
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    const user = await users.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!user) {
      return res.status(400).json({
        message: 'User not found'
      });
    }

    const passwordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordValid) {
      return res.status(400).json({
        message: 'Password is incorrect'
      });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2m'
    });

    const refresh = jwt.sign({ email: user.email }, process.env.JWT_REFRESH, {
      expiresIn: '10m'
    });

    return res.status(200).json({
      message: 'User signed in successfully',
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone
      },
      token: token,
      refreshToken: refresh
    });
  } catch (error) {
    logger('signin').error(error);
    next(error);
  }
};

const refreshAuth = async (req, res, next) => {
  const { email, token } = req.body;
  const isTokenValid = refreshToken(email, token);
  if (!isTokenValid) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }

  const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
    expiresIn: '2m'
  });

  return res.status(200).json({
    message: 'Token refreshed',
    accessToken: accessToken
  });
};

module.exports = {
  signup,
  signin,
  refreshAuth
};
