const { Router} = require('express');
const router = Router();

const  {getPrueba } = require('../controllers/dataMartController');
router.get('/prueba', getPrueba);

module.exports = router;