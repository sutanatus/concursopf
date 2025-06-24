// routes/mercadopagoRoutes.js
const express = require('express');
const router = express.Router();
const { createPreference } = require('../controllers/mercadopagoController.js');

// Não precisa de token para criar a preferência, pois o usuário ainda está a comprar
router.post('/create-preference', createPreference);

module.exports = router;