<template>
  <div class="dashboard-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Painel Admin</h3>
      </div>
      <nav>
        <ul>
          <!-- Link ativo para a página atual -->
          <li class="active"><a href="#">🏠 Dashboard</a></li>
          <!-- Link CORRIGIDO para a gestão de matérias -->
          <li><router-link to="/admin/subjects">📚 Gestão de Matérias</router-link></li>
          <li><a href="#" @click.prevent="logout">🚪 Sair</a></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <header class="dashboard-header">
        <h1>Dashboard Administrativo</h1>
        <p>Visão geral da sua plataforma de flashcards.</p>
      </header>

      <main class="dashboard-content">
        <!-- Cards com as Estatísticas Reais -->
        <div class="stats-grid">
          <div class="stat-card">
            <h2>👥 Total de Alunos</h2>
            <p class="stat-number" v-if="statsData">{{ statsData.totalUsers }}</p>
            <p v-else>A carregar...</p>
          </div>
          <div class="stat-card">
            <h2>📚 Total de Matérias</h2>
            <p class="stat-number" v-if="statsData">{{ statsData.totalSubjects }}</p>
            <p v-else>A carregar...</p>
          </div>
          <div class="stat-card">
            <h2>🗂️ Total de Decks</h2>
            <p class="stat-number" v-if="statsData">{{ statsData.totalDecks }}</p>
            <p v-else>A carregar...</p>
          </div>
          <div class="stat-card">
            <h2>🃏 Total de Flashcards</h2>
            <p class="stat-number" v-if="statsData">{{ statsData.totalFlashcards }}</p>
            <p v-else>A carregar...</p>
          </div>
        </div>

        <!-- Gráfico de Distribuição de Usuários -->
        <div class="charts-grid">
          <div class="chart-card">
            <h3>Distribuição de Usuários</h3>
            <apexchart v-if="pieChartSeries.length > 0"
              width="100%" 
              height="350"
              type="pie" 
              :options="pieChartOptions" 
              :series="pieChartSeries">
            </apexchart>
            <p v-else>A carregar dados do gráfico...</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  name: 'AdminDashboard',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      statsData: null,
      error: null,
      pieChartOptions: {
        chart: { type: 'pie' },
        labels: [], // Rótulos virão da API
        colors: ['#3498db', '#2ecc71'], // Cores para o gráfico
        legend: { position: 'bottom' }
      },
      pieChartSeries: [], 
    };
  },
  async created() {
    await this.fetchAdminDashboardData();
  },
  methods: {
    async fetchAdminDashboardData() {
      try {
        const data = await this.$axios.get('/admin/dashboard');
        this.statsData = data;
        
        // Processa os dados para o gráfico de pizza
        if (data.usersByRole) {
          this.pieChartOptions.labels = data.usersByRole.map(item => item.role === 'admin' ? 'Administradores' : 'Alunos');
          this.pieChartSeries = data.usersByRole.map(item => item.count);
        }

      } catch (error) {
        console.error('Erro ao buscar dados do painel:', error);
        this.error = 'Acesso negado ou erro no servidor.';
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
/* Estilos consistentes e melhorados */
.dashboard-container { display: flex; background-color: #f4f7fc; min-height: 100vh; }
.sidebar { width: 240px; background-color: #2c3e50; color: #ecf0f1; flex-shrink: 0; }
.sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #34495e; }
.sidebar nav ul { list-style-type: none; padding: 0; margin: 20px 0; }
.sidebar a { display: block; color: #ecf0f1; text-decoration: none; padding: 15px 20px; transition: background-color 0.2s; }
.sidebar li.active a, .sidebar a:hover { background-color: #34495e; }
.main-content { flex-grow: 1; padding: 30px; }
.dashboard-header { background-color: #fff; padding: 20px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.dashboard-header h1 { margin: 0; color: #34495e; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px; }
.stat-card { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.stat-card h2 { font-size: 1rem; color: #7f8c8d; text-transform: uppercase; margin: 0 0 10px 0; }
.stat-number { font-size: 2.5rem; font-weight: bold; color: #2c3e50; margin: 0; }
.charts-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
.chart-card { background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.chart-card h3 { margin-top: 0; color: #34495e; }
</style>
