const { Router} = require('express');
const router = Router();

const  {getSolids} = require('../controllers/solidController');

router.get('/solids', getSolids);


module.exports = router;