<template>
  <div class="page-container">
    <header class="page-header">
      <h1 v-if="user">Matérias Disponíveis, {{ user.username }}</h1>
      <h1 v-else>Matérias Disponíveis</h1>
      <p>Escolha uma matéria abaixo para começar os seus estudos.</p>
    </header>

    <div v-if="loading" class="state-message">A carregar matérias...</div>
    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <main v-else class="items-grid">
      <!-- Card para cada matéria -->
      <div v-for="subject in subjects" :key="subject.id" class="subject-card">
        <div class="card-info">
          <h2 class="card-title">{{ subject.title }}</h2>
          <p class="card-instructor">com {{ subject.instructor }}</p>
          <p class="card-description">{{ subject.description }}</p>
          <!-- Este link leva para a página de decks da matéria -->
          <router-link :to="`/subject/${subject.id}/decks`" class="action-button">
            Ver Decks
          </router-link>
        </div>
      </div>
    </main>
    
    <div class="logout-container">
        <button @click="logout" class="logout-button">Sair</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDashboard',
  data() {
    return {
      user: null,
      subjects: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    this.loadUserData();
    await this.fetchSubjects();
  },
  methods: {
    loadUserData() {
      const userDataFromStorage = localStorage.getItem('user');
      if (userDataFromStorage) {
        this.user = JSON.parse(userDataFromStorage);
      }
    },
    async fetchSubjects() {
      this.loading = true;
      this.error = null;
      try {
        this.subjects = await this.$axios.get('/subjects');
      } catch (error) {
        this.error = 'Não foi possível carregar as matérias.';
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.page-container {
  background-color: #0a0a1a;
  min-height: 100vh;
  padding: 40px 20px;
  color: #fff;
}
.page-header {
  text-align: center;
  margin-bottom: 50px;
}
.page-header h1 {
  color: #ff9900;
  font-size: 2.8rem;
  margin: 0;
  text-transform: uppercase;
}
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}
.subject-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 153, 0, 0.3);
  border-radius: 10px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}
.card-title {
  font-size: 1.5rem;
  color: #ff9900;
  margin: 0 0 10px;
}
.card-instructor {
  font-style: italic;
  color: #ccc;
  margin-bottom: 15px;
}
.card-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 20px;
  flex-grow: 1;
}
.action-button {
  background: linear-gradient(90deg, #ff9900, #ff6600);
  color: #000;
  border: none;
  padding: 12px 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin-top: auto;
  text-decoration: none;
  display: block;
}
.state-message { text-align: center; font-size: 1.2rem; padding: 50px; }
.logout-container { text-align: center; margin-top: 50px; }
.logout-button { background: transparent; border: 1px solid #ff9900; color: #ff9900; padding: 10px 30px; border-radius: 5px; cursor: pointer; font-size: 1rem; }
</style>