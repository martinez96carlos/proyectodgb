//definir rutas y luego exportarlos para poder usarlo en el index.
const { Router } = require('express');
const router = Router();

const { getUser, getSolid } = require ('../controllers/index.controller');

router.get('/users', getUser);
router.get('/solids', getSolid);
router.get('')



module.exports = router;