// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getUserProfile } = require('../controllers/userController.js');

// Todas as rotas aqui precisam de um token válido
router.use(verifyToken);

// Rota para obter o perfil do utilizador: GET /api/user/profile
router.get('/profile', getUserProfile);

module.exports = router;