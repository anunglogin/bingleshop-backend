const bcrypt = require('bcrypt');
const { Users, sequelize } = require('../database/models');

const signup = async (req, res, next) => {
  try {
    await sequelize.transaction(async (transaction) => {
      const insert = await Users.create(req.body, { transaction });
      console.log(insert);
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
        message: 'User not created',
        data: insert
      });
    });
  } catch (error) {
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

    const user = await Users.findOne({
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

    return res.status(200).json({
      message: 'User signed in successfully',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin
};
