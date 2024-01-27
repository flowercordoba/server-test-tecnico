require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./db/config');
const app = express();

app.use( cors() );
app.use( express.static('src/public') );
app.use( express.json() );


dbConnection();
app.use( '/api/users', require('./feature/user/routes/user.routes') );
app.use( '/api/auth', require('./feature/auth/routes/auth.routes') );
app.use( '/api/task', require('./feature/task/routes/task.routes') );
app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});


