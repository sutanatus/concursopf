<template>
  <div class="management-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Painel Admin</h3>
      </div>
      <nav>
        <ul>
          <li><router-link to="/admin/dashboard">🏠 Dashboard</router-link></li>
          <!-- Botão de Voltar, como solicitado -->
          <li><router-link to="/admin/subjects" class="back-button">⬅️ Voltar para Matérias</router-link></li>
          <li class="active-context"><a>&nbsp;&nbsp;↳ Gerir Decks</a></li>
          <li><a href="#" @click.prevent="logout">🚪 Sair</a></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <header class="page-header">
        <h1>Gestão de Decks e Flashcards</h1>
        <p>Matéria: {{ subjectTitle }}</p>
      </header>

      <div class="content-grid">
        <!-- Formulário para Criar Novo Deck -->
        <div class="form-card">
          <h2>Adicionar Novo Deck de Flashcards</h2>
          <form @submit.prevent="submitDeck">
            <div class="input-group">
              <label for="deck-title">Título do Deck (Ex: Art. 5º)</label>
              <input id="deck-title" v-model="newDeck.title" type="text" required>
            </div>
            <button type="submit" class="submit-button">Adicionar Deck</button>
          </form>
        </div>

        <!-- Coluna para listar DECKS e FLASHCARDS -->
        <div class="list-card">
          <h2>Decks da Matéria</h2>
          <div v-for="deck in decks" :key="deck.id" class="deck-item">
            <h3 class="deck-title">{{ deck.title }}</h3>
            
            <ul class="flashcard-list">
              <li v-for="card in deck.flashcards" :key="card.id" class="flashcard-item">
                <span>P: {{ card.question }}</span>
              </li>
              <li v-if="!deck.flashcards || deck.flashcards.length === 0" class="no-flashcards">
                <i>Nenhum flashcard neste deck.</i>
              </li>
            </ul>

            <!-- Formulário para adicionar NOVO FLASHCARD ao deck -->
            <form @submit.prevent="submitFlashcard(deck.id)" class="add-flashcard-form">
              <h4>Adicionar Flashcard a este Deck</h4>
              <textarea v-model="newFlashcard[deck.id].question" placeholder="Pergunta" required rows="3"></textarea>
              <textarea v-model="newFlashcard[deck.id].answer" placeholder="Resposta" required rows="3"></textarea>
              <button type="submit" class="add-button">Adicionar Flashcard</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Lógica atualizada para decks e flashcards
export default {
    name: 'DeckManagement',
    data() {
        return {
            subjectId: null,
            subjectTitle: '', // Para mostrar o nome da matéria
            decks: [],
            newDeck: { title: '' },
            newFlashcard: {}
        };
    },
    async created() {
        this.subjectId = this.$route.params.id;
        if (this.subjectId) {
            await this.fetchDecksAndCards();
        }
    },
    methods: {
        async fetchDecksAndCards() {
            const decksData = await this.$axios.get(`/decks/by-subject/${this.subjectId}`);
            for (const deck of decksData) {
                deck.flashcards = await this.$axios.get(`/flashcards/by-deck/${deck.id}`);
                this.newFlashcard[deck.id] = { question: '', answer: '' };
            }
            this.decks = decksData;
        },
        async submitDeck() {
            await this.$axios.post(`/decks/by-subject/${this.subjectId}`, this.newDeck);
            this.newDeck.title = '';
            await this.fetchDecksAndCards();
        },
        async submitFlashcard(deckId) {
            const cardData = this.newFlashcard[deckId];
            await this.$axios.post(`/flashcards/by-deck/${deckId}`, cardData);
            await this.fetchDecksAndCards();
        },
        logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
/* ESTILOS COMPLETOS E CORRIGIDOS */
.management-container { display: flex; background-color: #f4f7fc; min-height: 100vh; }
.sidebar { width: 240px; background-color: #2c3e50; color: #ecf0f1; flex-shrink: 0; }
.sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #34495e;}
.sidebar nav ul { list-style-type: none; padding: 0; margin: 20px 0; }
.sidebar a { display: block; color: #ecf0f1; text-decoration: none; padding: 15px 20px; transition: background-color 0.2s; }
.sidebar li.active a, .sidebar a:hover { background-color: #34495e; }
.main-content { flex-grow: 1; padding: 30px; }
.page-header { margin-bottom: 30px; }
.page-header h1 { margin: 0; color: #34495e; }
.page-header p { font-style: italic; color: #7f8c8d; }
.content-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
.form-card, .list-card { background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
h2, h3 { margin-top: 0; color: #3498db; }
h3.deck-title { color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px; margin-bottom: 15px; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #34495e; }
.input-group input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.submit-button, button { background-color: #27ae60; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
.deck-item { border: 1px solid #eee; padding: 20px; margin-top: 20px; border-radius: 8px; }
.flashcard-list { list-style: none; padding: 10px 0; margin: 0; }
.flashcard-item { padding: 10px 5px; border-bottom: 1px solid #f2f2f2; background-color: #fafafa; border-radius: 3px; margin-bottom: 5px; }
.no-flashcards { color: #95a5a6; font-style: italic; }
.add-flashcard-form { background-color: #f9f9f9; padding: 15px; margin-top: 15px; border-radius: 5px; }
.add-flashcard-form h4 { margin-top: 0; margin-bottom: 15px; }
.add-flashcard-form textarea { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-family: inherit; }
.add-button { background-color: #9b59b6; font-size: 0.9rem; padding: 10px 15px; }
/* Estilos para o novo botão de voltar e para o item de contexto ativo */
.sidebar .back-button {
  background-color: #34495e;
  border: 1px solid #4a627a;
  text-align: center;
  font-weight: bold;
}
.sidebar .back-button:hover {
  background-color: #4a627a;
}
.sidebar .active-context a {
  font-weight: bold;
  color: #fff;
  background-color: transparent !important;
  cursor: default;
  padding-left: 30px; /* Indenta o item para mostrar a hierarquia */
}
</style>
