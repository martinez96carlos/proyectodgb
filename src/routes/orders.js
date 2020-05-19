const { Router} = require('express');
const router = Router();

const  {getOrders, getOrderById, getOrderByGenerator, createOrder, deleteOrder} = require('../controllers/orderController');

router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);
router.get('/ordergenerator/:id', getOrderByGenerator);
router.post('/orders', createOrder);
router.put('/orders/:id', deleteOrder);


module.exports = router;