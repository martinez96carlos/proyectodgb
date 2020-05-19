const { Router} = require('express');
const router = Router();

const  {getRecolectionByOrder} = require('../controllers/recolectionController');

router.get('/recolections/:orderid', getRecolectionByOrder);



module.exports = router;