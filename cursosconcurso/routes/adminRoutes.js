// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Importamos os middlewares de segurança e o controller
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController.js');

// Rota do painel: GET /api/admin/dashboard
// 1º - Verifica se o utilizador está logado (verifyToken)
// 2º - Verifica se o utilizador tem a permissão 'admin' (isAdmin)
// 3º - Se ambos passarem, executa a lógica do controller
router.get('/dashboard', verifyToken, isAdmin, getDashboardStats);

module.exports = router;