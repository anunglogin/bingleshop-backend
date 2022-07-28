const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemContoller');
const { isTokenValid } = require('../middlewares/verifyToken');

const router = require('express').Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', isTokenValid, createItem);
router.patch('/:id', isTokenValid, updateItem);
router.delete('/:id', isTokenValid, deleteItem);

module.exports = router;
