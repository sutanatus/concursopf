// routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { getLessonsByModule, createLesson } = require('../controllers/lessonController.js');

// Todas as rotas aqui são protegidas para administradores
router.use(verifyToken, isAdmin);

// GET /api/lessons/by-module/:moduleId -> Listar aulas de um módulo
router.get('/by-module/:moduleId', getLessonsByModule);

// POST /api/lessons/by-module/:moduleId -> Criar uma aula num módulo
router.post('/by-module/:moduleId', createLesson);

module.exports = router;