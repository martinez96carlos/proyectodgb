const express = require('express');
const app = express();
//activamos expres y expres nos devuelve un objeto APP
//hacemos que ese objeto sea escuchado en el puerto dento del parentesis.



//middlewares son funciones que se ejecutan antes de llegar a las rutas para poder comprender los datos.
app.use(express.json()); // transforma la informacion que llega en json a un objeto de js.
app.use(express.urlencoded({extended: false})); //cuando envia datos de un formulario que no es formato json igual lo convertira a un objeto js.

//Conexion
//rutas importadas
app.use(require('./routes/routes'));





app.listen(3000);
console.log('server on port 3000');
