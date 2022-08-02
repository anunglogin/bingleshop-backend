const {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/item.contoller');
const { isTokenValid } = require('../middlewares/verifyToken.middleware');
const validation = require('../middlewares/validation.middleware');
const itemSchema = require('../validations/items.schema');

const router = require('express').Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', validation(itemSchema), isTokenValid, createItem);
router.patch('/:id', isTokenValid, updateItem);
router.delete('/:id', isTokenValid, deleteItem);

module.exports = router;
