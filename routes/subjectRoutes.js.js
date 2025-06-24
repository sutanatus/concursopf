const express = require('express');
const router = express.Router();
const { listSubjects, createSubject, deleteSubject } = require('../controllers/subjectController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
router.get('/', verifyToken, listSubjects);
router.post('/', verifyToken, isAdmin, createSubject);
router.delete('/:id', verifyToken, isAdmin, deleteSubject);
module.exports = router;