const { Router} = require('express');
const router = Router();

// rutas de ordenes
const  {getOrders, getOrderById, getOrderByGenerator, createOrder, deleteOrder, getOrderByRecolector, pickOrder} = require('../controllers/orderController');
router.get('/orders', getOrders);
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);
router.get('/ordergenerator/:id', getOrderByGenerator);
router.get('/orderrecolector/:id', getOrderByRecolector);
router.put('/orders/:orderid', deleteOrder);
router.put('/orderpick/', pickOrder)


// rutas de recolecciones
const  {getRecolectionByOrder , registerRecolections} = require('../controllers/recolectionController');
router.get('/recolections/:orderid', getRecolectionByOrder);
router.post('/recolections',registerRecolections);


// rutas de residuos sólidos
const  {getSolids} = require('../controllers/solidController');
router.get('/solids', getSolids);


// rutas de usuarios
const  {getUser, createRecolector, createGenerator } = require('../controllers/userController');
router.get('/login', getUser);
router.post('/createre', createRecolector);
router.post('/createge', createGenerator);




module.exports = router;