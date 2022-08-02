const {
  signup,
  signin,
  refreshAuth,
} = require('../controllers/auth.controller');
const router = require('express').Router();
const validation = require('../middlewares/validation.middleware');
const signinSchema = require('../validations/signin.schema');
const signupSchema = require('../validations/signup.schema');

router.post('/signup', validation(signupSchema), signup);
router.post('/signin', validation(signinSchema), signin);
router.post('/refresh_token', refreshAuth);

module.exports = router;
