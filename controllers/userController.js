// controllers/userController.js
const db = require('../config/db');

// Obter dados do perfil do utilizador logado
exports.getUserProfile = async (req, res) => {
    // O req.userId é adicionado pelo nosso middleware verifyToken
    const userId = req.userId;

    try {
        // Selecionamos apenas os dados seguros para enviar para o frontend
        const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
        const [users] = await db.execute(query, [userId]);

        if (users.length === 0) {
            return res.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        res.json(users[0]);

    } catch (err) {
        console.error("Erro ao buscar perfil do utilizador:", err);
        res.status(500).json({ error: 'Erro no servidor ao buscar perfil.' });
    }
};