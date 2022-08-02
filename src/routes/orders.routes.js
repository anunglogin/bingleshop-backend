const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderItem,
  deleteOrder,
} = require('../controllers/order.controller');
const { isTokenValid } = require('../middlewares/verifyToken.middleware');
const validation = require('../middlewares/validation.middleware');
const orderSchema = require('../validations/orders.schema');
const router = require('express').Router();

router.get('/', isTokenValid, getAllOrders);
router.get('/:id', isTokenValid, getOrderById);
router.post('/', validation(orderSchema), isTokenValid, createOrder);
router.patch('/:id', isTokenValid, updateOrder);
router.patch('/update-item/:id', isTokenValid, updateOrderItem);
router.delete('/:id', isTokenValid, deleteOrder);

module.exports = router;
