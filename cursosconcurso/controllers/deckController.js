// controllers/deckController.js
const db = require('../config/db');

// Listar todos os Decks de uma Matéria específica
exports.getDecksBySubject = async (req, res) => {
    // Adicionamos um log para depuração
    console.log(`Buscando decks para a matéria com ID: ${req.params.subjectId}`);

    try {
        // A consulta SQL correta, usando a coluna 'subject_id'
        const query = 'SELECT * FROM decks WHERE subject_id = ? ORDER BY module_order ASC';
        const [decks] = await db.execute(query, [req.params.subjectId]);
        res.json(decks);
    } catch (err) {
        // Se a consulta falhar, o servidor não vai crashar.
        // Em vez disso, registamos o erro e enviamos uma resposta clara.
        console.error("Erro detalhado ao buscar decks:", err);
        res.status(500).json({ error: 'Erro de servidor ao buscar os decks da matéria.' });
    }
};

// Criar um novo Deck numa Matéria
exports.createDeck = async (req, res) => {
    const { title } = req.body;
    const { subjectId } = req.params;

    // Adicionamos um log para depuração
    console.log(`Criando deck "${title}" na matéria com ID: ${subjectId}`);

    try {
        const query = 'INSERT INTO decks (subject_id, title) VALUES (?, ?)';
        const [result] = await db.execute(query, [subjectId, title]);
        res.status(201).json({ message: 'Deck criado com sucesso!', deckId: result.insertId });
    } catch (err) {
        console.error("Erro detalhado ao criar deck:", err);
        res.status(500).json({ error: 'Erro de servidor ao criar o deck.' });
    }
};
