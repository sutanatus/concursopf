<template>
  <div class="flashcards-app">
    <div class="urgency-bar">
      <p>
        🚨 ÚLTIMAS VAGAS COM DESCONTO! PROMOÇÃO TERMINA EM
        <span class="countdown">{{ formattedCountdown }}</span>
      </p>
    </div>

    <header class="app-header">
      <div class="logo-container">
        <img
          alt="Logo Polícia Federal"
          class="logo-img"
          src="https://img.freepik.com/free-vector/hand-drawn-flat-design-police-badge_23-2149344861.jpg"
        />
      </div>

      <nav class="main-nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link">Método Comprovado</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link">Resultados</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link login-btn" role="button">
              ACESSAR AGORA
            </router-link>
          </li>
        </ul>
      </nav>
    </header>

    <main class="main-content">
      <section class="hero-section">
        <div class="hero-text">
          <h1 class="hero-title">{{ title }}</h1>
          <p class="hero-description">{{ description }}</p>
          <div class="benefits-list">
            <div class="benefit-item">✅ Aprovado ou seu dinheiro de volta</div>
            <div class="benefit-item">✅ +1.200 aprovados em 2023</div>
            <div class="benefit-item">✅ Atualizado para o último edital</div>
          </div>
          <button @click="scrollToCTA" class="cta-button pulse">
            QUERO SER APROVADO!
          </button>
        </div>
        <div class="hero-image">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-flat-design-police-badge_23-2149344861.jpg"
            alt="Aprovado PF"
          />
        </div>
      </section>

      <!-- Todas as outras seções do seu HTML (features, stats, video, testimonials, etc.) continuam aqui... -->

      <section id="cta" class="cta-section">
        <h2 class="cta-title">NÃO DEIXE PARA DEPOIS!</h2>
        <p class="cta-subtitle">A sua aprovação começa aqui</p>
        <div class="cta-grid">
          <div class="cta-card">
            <h3>PACOTE COMPLETO PF</h3>
            <div class="cta-price">12X de R$25,77</div>
            <ul class="cta-features">
              <li>✔ Todos os flashcards PF</li>
              <li>✔ Atualizações por 1 ano</li>
              <li>✔ Bónus exclusivos</li>
            </ul>
            <button @click="handleCheckout('pf')" class="cta-button">
              COMPRAR AGORA
            </button>
          </div>
          <div class="cta-card highlighted">
            <div class="popular-badge">MAIS POPULAR</div>
            <h3>PACOTE PF + PRF</h3>
            <div class="cta-price">12X de R$37,77</div>
            <ul class="cta-features">
              <li>✔ Todos os flashcards PF</li>
              <li>✔ Todos os flashcards PRF</li>
              <li>✔ Atualizações por 2 anos</li>
            </ul>
            <button @click="handleCheckout('pf_prf')" class="cta-button">
              COMPRAR AGORA
            </button>
            <p class="secure-text">
              <img
                src="https://logodownload.org/wp-content/uploads/2016/09/pagseguro-logo-0.png"
                alt="Logo PagSeguro"
                width="120"
              />
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- POPUP REINSERIDO AQUI -->
    <div v-if="showPopup" class="offer-popup">
      <div class="popup-content">
        <button class="close-popup" @click="closePopup">×</button>
        <h3>ESPERE! OFERTA ESPECIAL PARA VOCÊ</h3>
        <p>Adicione agora e ganhe 15% de desconto + 3 bónus exclusivos!</p>
        <!-- O botão agora chama o método handlePopupAction -->
        <button @click="handlePopupAction" class="cta-button">
          SIM, QUERO APROVEITAR!
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      title: 'FLASHCARDS PF - O MÉTODO DOS APROVADOS',
      description: 'O sistema de revisão que já aprovou mais de 1.200 candidatos na Polícia Federal',
      countdownInterval: null,
      minutes: 29,
      seconds: 59,
      showPopup: false, // Inicia fechado para controle
    };
  },
  computed: {
    formattedCountdown() {
      const minutes = String(this.minutes).padStart(2, '0');
      const seconds = String(this.seconds).padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  },
  mounted() {
    this.startCountdown();
    // Mostra o popup após um pequeno atraso para não ser tão abrupto
    setTimeout(() => {
      this.showPopup = true;
    }, 2000); // 2 segundos
  },
  beforeUnmount() {
    clearInterval(this.countdownInterval);
  },
  methods: {
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.seconds > 0) { this.seconds--; }
        else if (this.minutes > 0) { this.minutes--; this.seconds = 59; } 
        else { clearInterval(this.countdownInterval); }
      }, 1000);
    },
    scrollToCTA() {
      document.getElementById('cta').scrollIntoView({ behavior: 'smooth' });
    },
    handleCheckout(productCode) {
      this.$router.push({ path: '/register', query: { product: productCode } });
    },
    closePopup() {
      this.showPopup = false;
    },
    handlePopupAction() {
      this.closePopup();
      this.scrollToCTA();
    }
  }
}
</script>

<style scoped>
/* O seu CSS completo continua aqui, sem alterações */
.flashcards-app {
  font-family: 'Montserrat', sans-serif;
  background-color: #0a0a1a;
  color: #ffffff;
}
.urgency-bar { background: linear-gradient(90deg, #ff0000, #ff6600); color: white; text-align: center; padding: 10px; font-weight: 700; position: sticky; top: 0; z-index: 1000; }
.countdown { display: inline-block; background: #000; padding: 2px 8px; border-radius: 4px; margin-left: 5px; }
.app-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 5%; background-color: rgba(0, 0, 0, 0.8); position: sticky; top: 48px; z-index: 999; backdrop-filter: blur(5px); }
.logo-img { height: 60px; }
.nav-list { display: flex; list-style: none; gap: 1.5rem; }
.nav-link { color: #ffffff; text-decoration: none; font-weight: 600; padding: 8px 15px; border-radius: 5px; transition: all 0.3s; }
.nav-link:hover { background-color: rgba(255, 153, 0, 0.2); color: #ff9900; }
.login-btn { background: linear-gradient(90deg, #ff9900, #ff6600); color: #000 !important; font-weight: 700; }
.hero-section { display: flex; align-items: center; justify-content: space-between; padding: 4rem 5%; background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%); }
.hero-text { max-width: 600px; }
.hero-title { font-size: 2.8rem; margin-bottom: 1.5rem; line-height: 1.2; color: #ff9900; }
.hero-description { font-size: 1.2rem; margin-bottom: 2rem; color: #cccccc; }
.benefits-list { margin: 2rem 0; }
.benefit-item { margin-bottom: 0.8rem; font-size: 1.1rem; }
.hero-image img { max-width: 450px; border-radius: 10px; animation: float 3s ease-in-out infinite; }
.cta-button { background: linear-gradient(90deg, #ff9900, #ff6600); color: #000; border: none; padding: 15px 30px; font-size: 1.2rem; font-weight: 700; border-radius: 50px; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 5px 15px rgba(255, 153, 0, 0.4); }
.cta-button:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(255, 153, 0, 0.6); }
.cta-button.pulse { animation: pulse 2s infinite; }
.cta-section { padding: 4rem 5%; background-color: #0a0a1a; text-align: center; }
.cta-title { font-size: 2.5rem; color: #ff9900; margin-bottom: 0.5rem; }
.cta-subtitle { font-size: 1.2rem; margin-bottom: 3rem; color: #cccccc; }
.cta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 800px; margin: 0 auto; }
.cta-card { background: rgba(255, 255, 255, 0.05); border-radius: 10px; padding: 2rem; border: 1px solid rgba(255, 153, 0, 0.2); position: relative; }
.cta-card.highlighted { border: 2px solid #ff9900; }
.popular-badge { position: absolute; top: -15px; right: 20px; background: #ff9900; color: #000; padding: 5px 15px; border-radius: 20px; font-weight: 700; font-size: 0.8rem; }
.cta-card h3 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #ff9900; }
.cta-price { font-size: 1.8rem; font-weight: 700; margin-bottom: 1.5rem; color: #ffffff; }
.cta-features { list-style: none; padding: 0; text-align: left; margin-bottom: 2rem; }
.cta-features li { margin-bottom: 0.8rem; }
.secure-text img { max-width: 120px; margin-top: 1rem; }
.offer-popup { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(5px); }
.popup-content { background: linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%); padding: 2rem; border-radius: 10px; max-width: 500px; text-align: center; position: relative; border: 2px solid #ff9900; animation: popIn 0.5s; }
.popup-content h3 { font-size: 1.8rem; color: #ff9900; margin-bottom: 1rem; }
.popup-content p { margin-bottom: 2rem; font-size: 1.1rem; }
.close-popup { position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #ffffff; }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
