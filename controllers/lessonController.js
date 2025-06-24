// controllers/lessonController.js
const db = require('../config/db');

// Listar todas as aulas de um módulo específico
exports.getLessonsByModule = async (req, res) => {
    try {
        const [lessons] = await db.execute(
            'SELECT * FROM lessons WHERE module_id = ? ORDER BY lesson_order ASC',
            [req.params.moduleId]
        );
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar aulas.' });
    }
};

// Criar uma nova aula num módulo
exports.createLesson = async (req, res) => {
    const { title, lesson_type, video_url, pdf_url, content } = req.body;
    const { moduleId } = req.params;

    if (!title || !lesson_type) {
        return res.status(400).json({ error: 'Título e tipo da aula são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO lessons (module_id, title, lesson_type, video_url, pdf_url, content) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(query, [moduleId, title, lesson_type, video_url, pdf_url, content]);
        res.status(201).json({ message: 'Aula criada com sucesso!', lessonId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar aula.' });
    }
};
