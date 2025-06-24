<template>
  <div class="page-container">
    <header class="page-header">
      <h1>Decks de Estudo</h1>
      <router-link to="/user/dashboard" class="back-link">← Voltar para Matérias</router-link>
    </header>

    <div v-if="loading" class="state-message">A carregar decks...</div>
    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <main v-else class="items-grid">
      <div v-for="deck in decks" :key="deck.id" class="subject-card">
        <div class="card-info">
          <h2 class="card-title">{{ deck.title }}</h2>
          <router-link :to="`/study/deck/${deck.id}`" class="action-button">
            Iniciar Estudo
          </router-link>
        </div>
      </div>
      <div v-if="decks.length === 0">Nenhum deck encontrado para esta matéria.</div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'SubjectDecksPage',
  data() {
    return {
      subjectId: null,
      decks: [],
      loading: true,
      error: null,
    };
  },
  async created() {
    this.subjectId = this.$route.params.id;
    await this.fetchDecks();
  },
  methods: {
    async fetchDecks() {
      this.loading = true;
      this.error = null;
      try {
        this.decks = await this.$axios.get(`/decks/by-subject/${this.subjectId}`);
      } catch (error) {
        this.error = 'Não foi possível carregar os decks.';
        console.error("Erro detalhado ao buscar decks:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Reutilizamos os mesmos estilos da página anterior para manter a consistência */
.page-container { background-color: #0a0a1a; min-height: 100vh; padding: 40px 20px; color: #fff; }
.page-header { text-align: center; margin-bottom: 50px; }
.page-header h1 { color: #ff9900; font-size: 2.8rem; margin: 0; text-transform: uppercase; }
.back-link { color: #ff9900; text-decoration: none; display: inline-block; margin-top: 10px; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 30px; max-width: 1400px; margin: 0 auto; }
.subject-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 153, 0, 0.3); border-radius: 10px; padding: 25px; display: flex; flex-direction: column; }
.card-title { font-size: 1.5rem; color: #ff9900; margin: 0 0 10px; }
.action-button { background: linear-gradient(90deg, #ff9900, #ff6600); color: #000; border: none; padding: 12px 20px; font-weight: bold; border-radius: 5px; cursor: pointer; text-align: center; margin-top: auto; text-decoration: none; display: block; }
.state-message { text-align: center; font-size: 1.2rem; padding: 50px; }
.error { color: #e74c3c; }
</style>
