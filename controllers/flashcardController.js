// controllers/flashcardController.js
const db = require('../config/db');

// Obter todos os flashcards de um deck específico
exports.getFlashcardsByDeck = async (req, res) => {
    try {
        const [cards] = await db.execute(
            'SELECT * FROM flashcards WHERE deck_id = ? ORDER BY card_order ASC',
            [req.params.deckId]
        );
        res.json(cards);
    } catch (err) {
        // Se a consulta falhar, o servidor não vai crashar.
        console.error("Erro detalhado ao buscar flashcards:", err);
        res.status(500).json({ error: 'Erro de servidor ao buscar flashcards.' });
    }
};

// Criar um novo flashcard num deck
exports.createFlashcard = async (req, res) => {
    const { question, answer } = req.body;
    const { deckId } = req.params;
    try {
        const [result] = await db.execute(
            'INSERT INTO flashcards (deck_id, question, answer) VALUES (?, ?, ?)',
            [deckId, question, answer]
        );
        res.status(201).json({ message: 'Flashcard criado com sucesso!', cardId: result.insertId });
    } catch (err) {
        console.error("Erro detalhado ao criar flashcard:", err);
        res.status(500).json({ error: 'Erro de servidor ao criar flashcard.' });
    }
};

// Atualizar um flashcard existente
exports.updateFlashcard = async (req, res) => {
    const { question, answer } = req.body;
    const { cardId } = req.params;
    try {
        await db.execute(
            'UPDATE flashcards SET question = ?, answer = ? WHERE id = ?',
            [question, answer, cardId]
        );
        res.json({ message: 'Flashcard atualizado com sucesso!' });
    } catch (err) {
        console.error("Erro detalhado ao atualizar flashcard:", err);
        res.status(500).json({ error: 'Erro de servidor ao atualizar flashcard.' });
    }
};

// Apagar um flashcard
exports.deleteFlashcard = async (req, res) => {
    const { cardId } = req.params;
    try {
        await db.execute(
            'DELETE FROM flashcards WHERE id = ?',
            [cardId]
        );
        res.json({ message: 'Flashcard apagado com sucesso!' });
    } catch (err) {
        console.error("Erro detalhado ao apagar flashcard:", err);
        res.status(500).json({ error: 'Erro de servidor ao apagar flashcard.' });
    }
};
