const {
  signup,
  signin,
  refreshAuth
} = require('../controllers/authController');
const router = require('express').Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh_token', refreshAuth);

module.exports = router;
