require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario'));
 
app.get('/', function (req, res) {
  res.json('Hello World')
});

//Conexión a la base de datos
let conn = null;
//clave: WQDi3Ug3bK4YtZl5
//usuario: ljcl79
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(function (){
  conn = true;
  console.log('BASE ONLINE');
}).catch(function(err) {
  console.log(err);
});

console.log(conn);
 
app.listen(process.env.PORT,() => {
    console.log('Escuchando el puerto: ',process.env.PORT);
});