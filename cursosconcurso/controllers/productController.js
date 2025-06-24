// controllers/productController.js
const db = require('../config/db');

// Criar um novo produto
exports.createProduct = async (req, res) => {
    // Pega o user_id do token, que foi adicionado pelo middleware verifyToken
    const user_id = req.userId;
    
    // Pega todos os campos do corpo da requisição
    const {
        nome, codigo = null, categoria = null, subcategoria = null, marca = null, modelo = null,
        preco_custo = null, preco_venda, unidade_medida = null, estoque = 0, estoque_minimo = 0,
        descricao_curta = null, descricao_detalhada = null, peso = null, altura = null, largura = null, profundidade = null,
        cor = null, material = null, ativo = true, observacoes = null
    } = req.body;

    // Validação básica
    if (!nome || !preco_venda) {
        return res.status(400).json({ error: 'Nome e Preço de Venda são obrigatórios.' });
    }

    try {
        const query = `
            INSERT INTO products (user_id, nome, codigo, categoria, subcategoria, marca, modelo, preco_custo, preco_venda, unidade_medida, estoque, estoque_minimo, descricao_curta, descricao_detalhada, peso, altura, largura, profundidade, cor, material, ativo, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [
            user_id, nome, codigo, categoria, subcategoria, marca, modelo,
            preco_custo, preco_venda, unidade_medida, estoque, estoque_minimo,
            descricao_curta, descricao_detalhada, peso, altura, largura, profundidade,
            cor, material, ativo, observacoes
        ];

        const [result] = await db.execute(query, params);
        res.status(201).json({ message: 'Produto cadastrado com sucesso!', productId: result.insertId });

    } catch (err) {
        console.error("Erro ao cadastrar produto:", err);
        // Trata erro de código de produto duplicado
        if (err.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ error: 'O código/SKU do produto já existe.' });
        }
        res.status(500).json({ error: 'Erro no servidor ao cadastrar o produto.' });
    }
};

// Obter todos os produtos do usuário logado
exports.getProductsByUser = async (req, res) => {
    const user_id = req.userId;

    try {
        const query = `SELECT * FROM products WHERE user_id = ? ORDER BY nome ASC`;
        const [products] = await db.execute(query, [user_id]);
        res.json(products);
    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ error: 'Erro ao buscar os produtos.' });
    }
};

// ... (Aqui iriam as funções de update, delete, etc. que podemos adicionar depois)
