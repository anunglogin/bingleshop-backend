const jwt = require('jsonwebtoken');

const isTokenValid = (req, res, next) => {
  try {
    let token = req.get('authorization');
    if (!token || token === 'undefined') {
      return res.status(401).json({
        message: 'No token provided'
      });
    }

    token = token.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.email = decoded.email;
    next();
  } catch (error) {
    next(error);
  }
};

const refreshToken = (email, token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH);
    return decoded.email === email;
  } catch (error) {
    return false;
  }
};

module.exports = { isTokenValid, refreshToken };
