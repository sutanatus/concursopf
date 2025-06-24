// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');

// Importa todos os nossos arquivos de rotas
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const subjectRoutes = require('./routes/subjectRoutes.js');
const deckRoutes = require('./routes/deckRoutes.js');
const flashcardRoutes = require('./routes/flashcardRoutes.js');
const mercadopagoRoutes = require('./routes/mercadopagoRoutes.js');

// Cria a aplicação Express
const app = express();

// Middlewares essenciais
// Permite que o seu frontend (de uma origem diferente) faça requisições à API
app.use(cors());
// Permite que o Express entenda o corpo das requisições em formato JSON
app.use(express.json());

// ----- Definição das Rotas da API -----
// Associa cada conjunto de rotas a um prefixo de URL base
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/mercadopago', mercadopagoRoutes);

// Uma rota de "saúde" para verificar rapidamente se o servidor está no ar
app.get('/', (req, res) => {
  res.send('API do Flashcards PF está funcionando!');
});

// Define a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
