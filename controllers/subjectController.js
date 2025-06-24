const db = require('../config/db');
// Renomeado para gerir Matérias (Subjects)
exports.listSubjects = async (req, res) => {
    const [subjects] = await db.execute('SELECT * FROM subjects ORDER BY title ASC');
    res.json(subjects);
};
exports.createSubject = async (req, res) => {
    const { title, description, instructor } = req.body;
    const [result] = await db.execute('INSERT INTO subjects (title, description, instructor) VALUES (?, ?, ?)', [title, description, instructor]);
    res.status(201).json({ message: 'Matéria criada com sucesso!', subjectId: result.insertId });
};
exports.deleteSubject = async (req, res) => {
    await db.execute('DELETE FROM subjects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Matéria apagada com sucesso!' });
};