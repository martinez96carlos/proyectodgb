const express = require('express');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
// app.use(require('./routes/user'));
app.use(require('./routes/solids'));


//starting the serter
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});