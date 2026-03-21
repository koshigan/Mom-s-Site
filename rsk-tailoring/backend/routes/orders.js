const express = require('express');
const router = express.Router();
const { getAllOrders, placeOrder, updateOrderStatus, deleteOrder, getDashboardStats } = require('../controllers/orderController');
const { authenticateAdmin } = require('../middleware/auth');

router.post('/', placeOrder);
router.get('/', authenticateAdmin, getAllOrders);
router.get('/dashboard', authenticateAdmin, getDashboardStats);
router.put('/:id', authenticateAdmin, updateOrderStatus);
router.delete('/:id', authenticateAdmin, deleteOrder);

module.exports = router;
