const express = require('express');
const router = express.Router();
const { getDecksBySubject, createDeck } = require('../controllers/deckController.js');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
router.use(verifyToken, isAdmin);
router.get('/by-subject/:subjectId', getDecksBySubject);
router.post('/by-subject/:subjectId', createDeck);
module.exports = router;