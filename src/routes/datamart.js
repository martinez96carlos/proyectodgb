const { Router} = require('express');
const router = Router();

const  {getVolumenPorResiduoGeneral,
    getVolumenPorTipoVivienda,
    getVolumenPorMes,
    getVolumenPorCiudad,
    getTopFiveRecolectors,
    getVolumenPorResiduoPersonal,
    getVolumenPorViviendaPersonal,
    getVolumenPorMesPersonal } = require('../controllers/dataMartController');

//graficos generales
router.get('/gone',getVolumenPorResiduoGeneral );
router.get('/gtwo', getVolumenPorTipoVivienda);
router.get('/gthree',getVolumenPorMes );
router.get('/gfour', getVolumenPorCiudad);
router.get('/gfive', getTopFiveRecolectors);

//graficos personales
router.get('/pone/:id', getVolumenPorResiduoPersonal);
router.get('/ptwo/:id', getVolumenPorViviendaPersonal);
router.get('/pthree/:id', getVolumenPorMesPersonal);


module.exports = router;