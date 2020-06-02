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
router.get('/gone',getVolumenPorResiduoGeneral ); //grafico 1 en el cel
router.get('/gtwo', getVolumenPorTipoVivienda); // grafico 5 en el cel
router.get('/gthree',getVolumenPorMes ); //grafico 4 en el cel
router.get('/gfour', getVolumenPorCiudad); //grafico 2 en el cel
router.get('/gfive', getTopFiveRecolectors); // grafico 3 en el cel  //concatenar nombre apellido y eliminar ciudad

//graficos personales
router.get('/pone/:id', getVolumenPorResiduoPersonal); //grafico 1 en el cel
router.get('/ptwo/:id', getVolumenPorViviendaPersonal); // grafico 3 en el cel
router.get('/pthree/:id', getVolumenPorMesPersonal); // grafico 2 en el cel


module.exports = router;