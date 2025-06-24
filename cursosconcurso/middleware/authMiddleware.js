// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Token não fornecido.' });
  }
  
  // Formato comum é "Bearer TOKEN", então pegamos só o token
  if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ error: "Acesso negado. Requer privilégios de administrador." });
    }
    next();
};