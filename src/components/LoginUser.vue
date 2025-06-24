<template>
  <div class="login-app">
    <div class="login-container">
      <div class="login-card">
        <img src="https://img.freepik.com/free-vector/hand-drawn-flat-design-police-badge_23-2149344861.jpg" 
             alt="Logo PF" 
             class="login-logo">
        
        <h2 class="login-title">ACESSO DO ALUNO</h2>
        <p class="login-subtitle">Entre com seus dados para acessar os flashcards</p>
        
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <input
              v-model="email"
              type="email"
              placeholder="Seu e-mail cadastrado"
              required
              class="login-input"
            >
          </div>
          
          <div class="input-group">
            <input
              v-model="password"
              type="password"
              placeholder="Sua senha"
              required
              class="login-input"
            >
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>
          
          <button type="submit" class="login-button">
            ENTRAR AGORA
          </button>
        </form>
        
        <div class="login-footer">
          <p>Não tem uma conta? <router-link to="/register" class="register-link">Cadastre-se aqui</router-link></p>
          <div class="secure-login">
            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Segurança">
            <span>Login 100% seguro</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Bloco SCRIPT ATUALIZADO
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const responseData = await this.$axios.post('/auth/login', {
          email: this.email,
          password: this.password
        });

        // Guardamos o token e os dados do usuário
        localStorage.setItem('authToken', responseData.token);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        
        // --- AQUI ESTÁ A LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---
        // Verificamos a 'role' do usuário que veio do backend
        if (responseData.user.role === 'admin') {
          // Se for admin, redireciona para o painel de admin
          this.$router.push('/admin/dashboard');
        } else {
          // Se não for, redireciona para o painel de usuário normal
          this.$router.push('/user/dashboard');
        }
        
      } catch (error) {
        // Exibe a mensagem de erro específica do backend
        const errorMessage = error.response?.data?.error || 'Não foi possível fazer o login.';
        alert(errorMessage);
      }
    }
  }
}
</script>

<style scoped>
/* O seu CSS continua o mesmo, sem alterações */
.login-app {
  background-color: #0a0a1a;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.login-container {
  width: 100%;
  max-width: 400px;
}
.login-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 153, 0, 0.3);
  border-radius: 10px;
  padding: 30px;
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.login-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ff9900;
}
.login-title {
  color: #ff9900;
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 5px;
}
.login-subtitle {
  color: #cccccc;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.login-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
}
.login-input:focus {
  border-color: #ff9900;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.2);
}
.login-input::placeholder {
  color: #aaaaaa;
}
.forgot-password {
  color: #aaaaaa;
  font-size: 0.8rem;
  text-align: right;
  text-decoration: none;
  transition: color 0.3s;
}
.forgot-password:hover {
  color: #ff9900;
}
.login-button {
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
.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 153, 0, 0.4);
}
.login-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 0.9rem;
  color: #aaaaaa;
}
.register-link {
  color: #ff9900;
  text-decoration: none;
  font-weight: bold;
}
.secure-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 0.8rem;
}
.secure-login img {
  width: 16px;
  height: 16px;
}
</style>
