// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createProduct, getProductsByUser } = require('../controllers/productController.js');

// Aplica o middleware de verificação de token a todas as rotas de produtos
// Isso garante que apenas usuários logados possam gerenciar produtos.
router.use(verifyToken);

// Rota para criar um produto: POST /api/products/
router.post('/', createProduct);

// Rota para listar os produtos do usuário: GET /api/products/
router.get('/', getProductsByUser);

module.exports = router;
