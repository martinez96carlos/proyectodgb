const { Router} = require('express');
const router = Router();

const  {getUser, createRecolector, createGenerator } = require('../controllers/userController');

router.get('/login', getUser);
router.post('/createre', createRecolector);
router.post('/createge', createGenerator);




module.exports = router;