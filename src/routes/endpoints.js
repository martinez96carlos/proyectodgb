const { Router} = require('express');
const bcrypt = require('bcrypt');
const router = Router();

// rutas de ordenes
const  {getOrders, getOrderById, getOrderByGenerator, createOrder, deleteOrder, getOrderByRecolector, pickOrder,cancelPick, getRecolectedOrders, getOrderRates, rateRecolection} = require('../controllers/orderController');
router.get('/orders', getOrders);
router.get('/recolected', getRecolectedOrders);//
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);
router.get('/ordergenerator/:id', getOrderByGenerator);
router.get('/orderrecolector/:id', getOrderByRecolector);
router.put('/orders/:orderid', deleteOrder);
router.put('/orderpick/', pickOrder);
router.put('/cancelpick', cancelPick);
router.get('/rates/:orderid',getOrderRates);
router.put('/ratere', rateRecolection)


// rutas de recolecciones
const  {getRecolectionByOrder , registerRecolections} = require('../controllers/recolectionController');
router.get('/recolections/:orderid', getRecolectionByOrder);
router.post('/recolections',registerRecolections);


// rutas de residuos sólidos
const  {getSolids} = require('../controllers/solidController');
router.get('/solids', getSolids);


// rutas de usuarios
const  {getUser, createRecolector, createGenerator, editGenerator, editRecolector} = require('../controllers/userController');
router.get('/login', getUser);
router.post('/createre', createRecolector);
router.post('/createge', createGenerator);
router.put('/editre',editRecolector);
router.put('/editge', editGenerator);


module.exports = router;