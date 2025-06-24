// controllers/mercadopagoController.js
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Crie um cliente de configuração com o seu Access Token.
// Ele buscará do seu arquivo .env ou usará o de teste como fallback.
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.createPreference = async (req, res) => {
    try {
        const { items, payerEmail } = req.body;

        if (!items || !payerEmail) {
            return res.status(400).json({ error: 'Itens e e-mail do pagador são obrigatórios.' });
        }

        const body = {
            items: items,
            payer: {
                email: payerEmail,
            },
            back_urls: {
                // Após o pagamento, o usuário será redirecionado para estas páginas
                success: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/user/dashboard`, // Sucesso leva ao painel
                failure: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/`, // Falha volta para a home
                pending: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/`, // Pagamento pendente volta para home
            },
            auto_return: 'approved', // Retorna automaticamente para o site após pagamento aprovado
        };

        const preference = new Preference(client);
        const result = await preference.create({ body });

        res.json({
            id: result.id,
            sandbox_init_point: result.sandbox_init_point, // URL de checkout de teste
        });

    } catch (error) {
        console.error('Erro ao criar preferência no Mercado Pago:', error);
        res.status(500).json({ error: 'Falha ao criar a preferência de pagamento.' });
    }
};
