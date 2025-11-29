const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).json({ error: 'Token requerido o formato incorrecto.' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
        const decoded = jwt.verify(token, 'secreto_super_seguro'); 
        req.userId = decoded.id; 
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = auth;