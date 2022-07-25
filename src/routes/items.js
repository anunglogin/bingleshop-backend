const { getAllItems } = require('../controllers/itemContoller');
const { isTokenValid } = require('../middlewares/verifyToken');

const router = require('express').Router();

router.get('/', isTokenValid, getAllItems);

module.exports = router;
