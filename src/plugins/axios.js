// src/plugins/axios.js (ou onde seu plugin estiver)
import axios from 'axios'
import router from '@/router'

// Cria uma instância do axios
const api = axios.create({
  // AQUI ESTÁ A CORREÇÃO MAIS IMPORTANTE:
  // Garantimos que a URL base seja sempre a do nosso backend.
  baseURL: 'http://localhost:3000/api', 
  timeout: 10000,
});

// Interceptor para ADICIONAR o token em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para TRATAR erros de resposta
api.interceptors.response.use(
  (response) => {
    // Se a requisição for bem-sucedida, retorna os dados diretamente
    return response.data;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) { // Não autorizado (token inválido/expirado)
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push('/login');
        alert('Sua sessão expirou. Por favor, faça login novamente.');
      }
    }
    return Promise.reject(error);
  }
);

// Plugin Vue para instalar a instância 'api' como this.$axios
const axiosPlugin = {
  install: (app) => {
    app.config.globalProperties.$axios = api;
    app.provide('axios', api);
  }
}

export default axiosPlugin;