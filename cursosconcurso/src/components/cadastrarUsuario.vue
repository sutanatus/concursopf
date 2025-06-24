<template>
  <div class="register-app">
    <div class="register-container">
      <div class="register-card">
        <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-police-badge_23-2149344861.jpg" 
             alt="Logo PF" 
             class="register-logo">
        
        <h2 class="register-title">CRIE SUA CONTA</h2>
        <p class="register-subtitle">Preencha seus dados para começar a usar os flashcards</p>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="input-group">
            <input
              v-model="form.username"
              type="text"
              placeholder="Seu nome de usuário"
              required
              class="register-input"
            >
          </div>
          <div class="input-group">
            <input
              v-model="form.email"
              type="email"
              placeholder="Seu melhor e-mail"
              required
              class="register-input"
            >
          </div>
          <div class="input-group">
            <input
              v-model="form.password"
              type="password"
              placeholder="Crie uma senha forte"
              required
              class="register-input"
            >
          </div>
          <!-- Opcional: Adicionar campo para confirmar senha se desejar -->
          
          <button type="submit" class="register-button">
            CRIAR CONTA
          </button>
        </form>
        
        <div class="register-footer">
          <p>Já tem uma conta? <router-link to="/login" class="login-link">Faça o login aqui</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterUser',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: ''
      },
      // Dados dos pacotes para o checkout
      products: {
        pf_prf: { name: 'Pacote PF + PRF', price: 37.77 },
        pf: { name: 'Pacote Completo PF', price: 25.77 }
      },
      isLoading: false // Para desativar o botão durante o processo
    };
  },
  methods: {
    async handleRegister() {
      this.isLoading = true; // Desativa o botão
      try {
        // 1. Registra o novo usuário
        await this.$axios.post('/auth/register', this.form);

        // 2. Faz o login automático para obter o token
        const loginResponse = await this.$axios.post('/auth/login', {
          email: this.form.email,
          password: this.form.password
        });
        localStorage.setItem('authToken', loginResponse.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.user));

        // 3. Verifica qual produto foi selecionado (vindo da URL)
        const productCode = this.$route.query.product;
        const selectedProduct = this.products[productCode];

        if (!selectedProduct) {
            alert("Pacote inválido. Redirecionando para o painel.");
            this.$router.push('/user/dashboard');
            return;
        }

        // 4. Cria a preferência de pagamento no Mercado Pago
        const preferenceResponse = await this.$axios.post('/mercadopago/create-preference', {
          items: [{
            title: selectedProduct.name,
            quantity: 1,
            unit_price: selectedProduct.price
          }],
          payerEmail: this.form.email
        });
        
        // 5. Redireciona o usuário para o checkout seguro do Mercado Pago
        if (preferenceResponse.sandbox_init_point) {
          window.location.href = preferenceResponse.sandbox_init_point;
        } else {
            throw new Error("URL de checkout não recebida do servidor.");
        }

      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Não foi possível completar o processo. Tente novamente.';
        alert(`Erro: ${errorMessage}`);
      } finally {
        this.isLoading = false; // Reativa o botão
      }
    }
  }
}
</script>


<style scoped>
/* Estilos EXATAMENTE IGUAIS aos da sua página de login para manter a consistência */
.register-app {
  background-color: #0a0a1a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.register-container {
  width: 100%;
  max-width: 400px;
}
.register-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 153, 0, 0.3);
  border-radius: 10px;
  padding: 30px;
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.register-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff9900;
}
.register-title {
  color: #ff9900;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 5px;
}
.register-subtitle {
  color: #cccccc;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
}
.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.register-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}
.register-input:focus {
  border-color: #ff9900;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.2);
}
.register-button {
  background: linear-gradient(90deg, #ff9900, #ff6600);
  color: #000;
  border: none;
  padding: 15px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  margin-top: 10px;
}
.register-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9rem;
  color: #aaaaaa;
}
.login-link {
  color: #ff9900;
  text-decoration: none;
  font-weight: bold;
}
</style>
