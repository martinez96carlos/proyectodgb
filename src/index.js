const express = require('express');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
// app.use(require('./routes/user'));
// app.use(require('./routes/solids'));
// app.use(require('./routes/orders'));
// app.use(require('./routes/users'));
app.use(require('./routes/endpoints'));
app.use(require('./routes/datamart'));


//starting the serter
app.listen(app.get('port'), () =>{
    console.log('Server on port', app.get('port'));
});