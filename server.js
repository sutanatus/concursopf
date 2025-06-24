const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'flashcards_db'
});

// Rota de registro
// Rota de registro atualizada
app.post('/register', (req, res) => {
  const { username, email, password, cpf, telefone, endereco, cidade, estado } = req.body;
  
  // Validação básica
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  // Validação de CPF (exemplo simples)
  if (cpf && !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
    return res.status(400).json({ error: 'CPF no formato inválido' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  
  const query = `INSERT INTO users 
    (username, email, password, cpf, telefone, endereco, cidade, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.execute(query, 
    [username, email, hashedPassword, cpf, telefone, endereco, cidade, estado], 
    (err, results) => {
      if (err) {
        console.error(err);
        // Verifica se é erro de email duplicado
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
        return res.status(500).json({ error: 'Erro ao registrar', details: err.message });
      }
      res.json({ 
        message: 'Usuário registrado com sucesso',
        userId: results.insertId 
      });
  });
});
// Rota de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.execute(query, [email], (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Credenciais inválidas' });

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).json({ error: 'Credenciais inválidas' });

    const token = jwt.sign({ id: user.id }, 'segredo', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Middleware para autenticação
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token ausente' });

  jwt.verify(token, 'segredo', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Token inválido' });
    req.userId = decoded.id;
    next();
  });
}

// Rota para listar os flash cards (Somente para usuários autenticados)
app.get('/flashcards', verifyToken, (req, res) => {
  const query = 'SELECT * FROM flashcards';
  db.execute(query, [], (err, results) => {
    res.json(results);
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
