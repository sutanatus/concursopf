// controllers/adminController.js
const db = require('../config/db');

// Obter estatísticas para o painel de administrador
exports.getDashboardStats = async (req, res) => {
    try {
        // Contagem de cada entidade principal
        const [users] = await db.execute('SELECT COUNT(*) as totalUsers FROM users');
        const [subjects] = await db.execute('SELECT COUNT(*) as totalSubjects FROM subjects');
        const [decks] = await db.execute('SELECT COUNT(*) as totalDecks FROM decks');
        const [flashcards] = await db.execute('SELECT COUNT(*) as totalFlashcards FROM flashcards');
        
        // Contagem de utilizadores por 'role' para o gráfico
        const [usersByRole] = await db.execute(
            'SELECT role, COUNT(*) as count FROM users GROUP BY role'
        );

        // Monta o objeto de estatísticas com os dados reais
        const stats = {
            totalUsers: users[0].totalUsers,
            totalSubjects: subjects[0].totalSubjects,
            totalDecks: decks[0].totalDecks,
            totalFlashcards: flashcards[0].totalFlashcards,
            usersByRole: usersByRole 
        };

        res.json(stats);

    } catch (err) {
        console.error("Erro ao buscar estatísticas do admin:", err);
        res.status(500).json({ error: 'Erro no servidor ao buscar dados do painel.' });
    }
};