// controllers/authController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Função de REGISTRO (versão corrigida)
exports.register = async (req, res) => {
  // Adicionamos `= null` para todos os campos que não são obrigatórios.
  // Se eles não vierem na requisição, serão `null` em vez de `undefined`.
  const {
    username,
    email,
    password,
    cpf = null,
    telefone = null,
    endereco = null,
    cidade = null,
    estado = null
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 8);
    
    const query = `INSERT INTO users (username, email, password, cpf, telefone, endereco, cidade, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    // Agora o código vai enviar `null` para o banco de dados, que é o correto.
    const [results] = await db.execute(query, 
      [username, email, hashedPassword, cpf, telefone, endereco, cidade, estado]
    );

    res.status(201).json({ 
      message: 'Usuário registrado com sucesso',
      userId: results.insertId 
    });

  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Este email já está em uso.' });
    }
    return res.status(500).json({ error: 'Erro no servidor ao tentar registrar.' });
  }
};

// Função de LOGIN (versão original, que já estava correta)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [results] = await db.execute(query, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ 
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
     });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro no servidor.' });
  }
};