const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const usuarioRoutes = require('./routes/usuarios');
const productoRoutes = require('./routes/productos');
const resenaRoutes = require('./routes/resenas');
const comentarioRoutes = require('./routes/comentarios');
const reaccionRoutes = require('./routes/reacciones');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth'); 

app.use('/api', (req, res, next) => {

    if (req.headers['authorization']) {
        
        authMiddleware(req, res, next);
    } else {

        req.userId = undefined; 
        next();
    }
});


mongoose.connect('mongodb://localhost:27017/DB_Caso_Hiraoka') 
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/reacciones', reaccionRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});