<template>
  <div class="player-container">
    <div class="header">
        <!-- Botão de voltar corrigido para ser mais robusto -->
        <a href="#" @click.prevent="$router.go(-1)" class="back-link">← Voltar</a>
    </div>
    
    <div v-if="loading">A carregar flashcards...</div>
    <div v-else-if="error">{{ error }}</div>

    <div v-else-if="flashcards.length === 0" class="welcome-message">
        <h3>Este deck ainda não tem flashcards!</h3>
        <p>Peça ao administrador para adicionar conteúdo.</p>
    </div>

    <div v-else class="flashcard-area">
        <!-- O Flashcard -->
        <div class="flashcard" :class="{ 'is-flipped': isFlipped }" @click="flipCard">
            <div class="card-face card-front">
                <p>{{ currentCard.question }}</p>
            </div>
            <div class="card-face card-back">
                <p>{{ currentCard.answer }}</p>
            </div>
        </div>
        
        <!-- Navegação -->
        <div class="navigation">
            <button @click="prevCard" :disabled="currentIndex === 0">Anterior</button>
            <span>{{ currentIndex + 1 }} / {{ flashcards.length }}</span>
            <button @click="nextCard" :disabled="currentIndex >= flashcards.length - 1">Próximo</button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardPlayer',
  data() {
    return {
      deckId: null,
      flashcards: [],
      currentIndex: 0,
      isFlipped: false,
      loading: true,
      error: null,
    };
  },
  computed: {
    currentCard() {
      return this.flashcards[this.currentIndex] || {};
    }
  },
  async created() {
    this.deckId = this.$route.params.id;
    await this.fetchFlashcards();
  },
  methods: {
    async fetchFlashcards() {
        this.loading = true;
        try {
            this.flashcards = await this.$axios.get(`/flashcards/by-deck/${this.deckId}`);
        } catch (e) {
            this.error = "Erro ao carregar flashcards.";
        } finally {
            this.loading = false;
        }
    },
    flipCard() {
      this.isFlipped = !this.isFlipped;
    },
    nextCard() {
      if (this.currentIndex < this.flashcards.length - 1) {
        this.currentIndex++;
        this.isFlipped = false;
      }
    },
    prevCard() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.isFlipped = false;
      }
    }
  }
};
</script>

<style scoped>
.player-container {
    background-color: #2c3e50;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
.header { width: 100%; max-width: 800px; margin-bottom: 20px; }
.back-link { color: #3498db; text-decoration: none; }
.flashcard-area {
    perspective: 1000px;
    width: 100%;
    max-width: 800px;
}
.flashcard {
    width: 100%;
    height: 400px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s;
    cursor: pointer;
}
.flashcard.is-flipped {
    transform: rotateY(180deg);
}
.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    text-align: center;
}
.card-front {
    background-color: #34495e;
}
.card-back {
    background-color: #27ae60;
    transform: rotateY(180deg);
}
.navigation {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}
.navigation button {
    padding: 10px 20px;
}
.welcome-message {
  text-align: center;
  color: #bdc3c7;
}
</style>
