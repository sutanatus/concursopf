<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel do Usuário</title>
    <link rel="stylesheet" href="styleCliente.css">
    <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/date-fns@2.22.1/dist/date-fns.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/date-fns/2.22.1/locale/pt-BR/index.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div id="app" class="user-dashboard-container">
        <header class="user-dashboard-header">
            <h1>Olá, {{ userData ? userData.name : 'Usuário' }}!</h1>
            <p>Bem-vindo ao seu painel.</p>
        </header>

        <main class="user-dashboard-content">
            <div class="user-dashboard-grid">
                <section class="card card-profile">
                    <div class="card-header">
                        <h2>👤 Seu Perfil</h2>
                    </div>
                    <div class="card-body">
                        <div v-if="userData">
                            <p><strong>Nome:</strong> {{ userData.name }}</p>
                            <p><strong>Email:</strong> {{ userData.email }}</p>
                            <p><strong>Membro desde:</strong> {{ formatDate(userData.createdAt) }}</p>
                            <button @click="editProfile">✏️ Editar Perfil</button>
                        </div>
                        <div v-else>
                            <p>Carregando informações do perfil...</p>
                        </div>
                    </div>
                </section>

                <section class="card card-notifications">
                    <div class="card-header">
                        <h2>🔔 Notificações</h2>
                    </div>
                    <div class="card-body">
                        <ul v-if="notifications && notifications.length > 0">
                            <li v-for="notification in notifications" :key="notification.id">
                                <span>{{ notification.message }}</span>
                                <small>{{ formatDate(notification.createdAt) }}</small>
                            </li>
                        </ul>
                        <p v-else>Nenhuma notificação recente.</p>
                    </div>
                </section>

                <section class="card card-orders">
                    <div class="card-header">
                        <h2>🛒 Seus Pedidos</h2>
                    </div>
                    <div class="card-body">
                        <ul v-if="orders && orders.length > 0">
                            <li v-for="order in orders" :key="order.id">
                                <span>Pedido #{{ order.orderId }} - Status: {{ order.status }}</span>
                                <small>{{ formatDate(order.orderDate) }}</small>
                                <button @click="viewOrderDetails(order.id)">Detalhes</button>
                            </li>
                        </ul>
                        <p v-else>Você ainda não fez nenhum pedido.</p>
                    </div>
                </section>

                <section class="card card-favorites">
                    <div class="card-header">
                        <h2>❤️ Favoritos</h2>
                    </div>
                    <div class="card-body">
                        <ul v-if="favorites && favorites.length > 0">
                            <li v-for="item in favorites" :key="item.id">
                                <span>{{ item.name }}</span>
                                <button @click="removeFromFavorites(item.id)">Remover</button>
                            </li>
                        </ul>
                        <p v-else>Sua lista de favoritos está vazia.</p>
                    </div>
                </section>
            </div>
        </main>

        <button @click="logout" class="logout-button">🚪 Sair</button>

        <div v-if="error" class="error">{{ error }}</div>
    </div>

    <script>
        new Vue({
            el: '#app',
            data() {
                return {
                    userData: null,
                    notifications: [],
                    orders: [],
                    favorites: [],
                    error: null,
                    baseUrl: 'http://localhost:3000' // Ajuste conforme sua API
                };
            },
            mounted() {
                this.fetchUserData();
                this.fetchNotifications();
                this.fetchOrders();
                this.fetchFavorites();
            },
            methods: {
                formatDate(dateString) {
                    if (!dateString) return '';
                    try {
                        // Use dateFns.locale.ptBR aqui
                        return dateFns.format(new Date(dateString), 'dd \'de\' MMMM \'de\' yyyy', { locale: dateFns.locale.ptBR });
                    } catch (e) {
                        console.error('Erro ao formatar data:', e, 'String da data:', dateString);
                        return dateString; // Retorna a string original se houver erro
                    }
                },
                async fetchUserData() {
                    const token = localStorage.getItem('userToken');
                    if (!token) {
                        // Em um app real, você teria uma página de login.
                        // Por agora, se não houver token, podemos apenas mostrar um erro ou dados mockados.
                        console.warn('Token não encontrado. Redirecionaria para /login');
                        this.error = 'Por favor, faça login para ver seus dados.';
                        // Opcionalmente, redirecionar: window.location.href = '/login.html';
                        return;
                    }

                    try {
                        const response = await axios.get(`${this.baseUrl}/api/user/profile`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        });
                        this.userData = response.data;
                        this.error = null;
                    } catch (error) {
                        console.error('Erro ao buscar dados do usuário:', error);
                        this.error = 'Erro ao carregar os dados do perfil. Tente mais tarde ou faça login novamente.';
                        if (error.response && error.response.status === 401) { // Exemplo de tratamento de não autorizado
                            localStorage.removeItem('userToken');
                            // window.location.href = '/login.html';
                        }
                    }
                },
                async fetchNotifications() {
                    const token = localStorage.getItem('userToken');
                    if (!token) return;

                    try {
                        const response = await axios.get(`${this.baseUrl}/api/user/notifications`, {
                            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json', },
                        });
                        this.notifications = response.data;
                    } catch (error) {
                        console.error('Erro ao buscar notificações:', error);
                        // Poderia setar um erro específico para notificações
                    }
                },
                async fetchOrders() {
                    const token = localStorage.getItem('userToken');
                    if (!token) return;

                    try {
                        const response = await axios.get(`${this.baseUrl}/api/user/orders`, {
                            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json', },
                        });
                        this.orders = response.data;
                    } catch (error) {
                        console.error('Erro ao buscar pedidos:', error);
                    }
                },
                async fetchFavorites() {
                    const token = localStorage.getItem('userToken');
                    if (!token) return;

                    try {
                        const response = await axios.get(`${this.baseUrl}/api/user/favorites`, {
                            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json', },
                        });
                        this.favorites = response.data;
                    } catch (error) {
                        console.error('Erro ao buscar favoritos:', error);
                    }
                },
                editProfile() {
                    // window.location.href = '/profile/edit'; // Ajuste para sua página de edição
                    alert('Funcionalidade "Editar Perfil" a ser implementada.');
                },
                viewOrderDetails(orderId) {
                    // window.location.href = `/orders/${orderId}`; // Ajuste para sua página de detalhes do pedido
                    alert(`Ver detalhes do pedido: ${orderId} (a ser implementado)`);
                },
                async removeFromFavorites(itemId) {
                    const token = localStorage.getItem('userToken');
                    if (!token) return;

                    try {
                        await axios.delete(`${this.baseUrl}/api/user/favorites/${itemId}`, {
                            headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json', },
                        });
                        this.fetchFavorites(); // Re-busca a lista de favoritos
                    } catch (error) {
                        console.error('Erro ao remover dos favoritos:', error);
                        alert('Erro ao remover item dos favoritos.');
                    }
                },
                logout() {
                    localStorage.removeItem('userToken');
                    this.userData = null; // Limpa os dados do usuário da tela
                    this.notifications = [];
                    this.orders = [];
                    this.favorites = [];
                    this.error = "Você foi desconectado.";
                    // window.location.href = '/login.html'; // Redireciona para a página de login
                    alert('Usuário deslogado! Redirecionaria para a página de login.');
                }
            }
        });
    </script>
</body>
</html>