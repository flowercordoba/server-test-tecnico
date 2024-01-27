require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan'); // Asegúrate de requerir Morgan

const { dbConnection } = require('./db/config');
const app = express();

app.use(cors());
app.use(morgan('combined')); // Configuración de Morgan para registrar solicitudes HTTP
app.use(express.static('src/public'));
app.use(express.json());

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err); // Aquí puedes mejorar el registro de errores según tus necesidades
    res.status(500).send('Ocurrió un error en el servidor');
});

dbConnection();

// Tus rutas
app.use('/api/users', require('./feature/user/routes/user.routes'));
app.use('/api/auth', require('./feature/auth/routes/auth.routes'));
app.use('/api/task', require('./feature/task/routes/task.routes'));
app.use('/api/todo', require('./feature/search/routes/search.routes'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
});
