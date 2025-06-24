// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// É uma boa prática importar os componentes para maior clareza,
// assumindo que estes são os caminhos corretos no seu projeto.
import HomePage from '@/views/HomePage.vue';
import LoginUser from '@/components/LoginUser.vue';
import RegisterUser from '@/components/cadastrarUsuario.vue';
import UserDashboard from '@/views/user/UserDashboard.vue';
import AdminDashboard from '@/views/user/admin/AdminDashboard.vue';
import SubjectManagement from '@/views/user/admin/SubjectManagement.vue';
import DeckManagement from '@/views/user/admin/DeckManagement.vue';
import AboutPage from '@/views/AboutPage.vue';
import ResultsPage from '@/views/ResultsPage.vue';
// Novas páginas para a jornada de estudo do aluno
import SubjectDecksPage from '@/views/user/SubjectDecksPage.vue';
import FlashcardPlayer from '@/views/user/FlashcardPlayer.vue';


const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Flashcards PF - O Método dos Aprovados' }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginUser,
    meta: { title: 'Acesso ao Sistema' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterUser, 
    meta: { title: 'Crie a sua Conta' }
  },

  // --- Rotas de Administrador ---
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Painel Administrativo' }
  },
  {
    path: '/admin/subjects',
    name: 'SubjectManagement',
    component: SubjectManagement, 
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Gestão de Matérias' }
  },
  {
    path: '/admin/subject/:id/decks',
    name: 'DeckManagement',
    component: DeckManagement,
    meta: { requiresAuth: true, requiresAdmin: true, title: 'Gestão de Decks' }
  },

  // --- Rotas do Aluno ---
  {
    path: '/user/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, title: 'Minhas Matérias' }
  },
  {
    path: '/subject/:id/decks',
    name: 'SubjectDecksPage',
    component: SubjectDecksPage,
    meta: { requiresAuth: true, title: 'Decks da Matéria' }
  },
  {
    path: '/study/deck/:id',
    name: 'FlashcardPlayer',
    component: FlashcardPlayer,
    meta: { requiresAuth: true, title: 'Modo de Estudo' }
  },

  // --- Páginas Estáticas ---
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { title: 'Método Comprovado' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ResultsPage,
    meta: { title: 'Nossos Resultados' }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Guarda de rotas global para segurança
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user'));

  // Se a rota requer autenticação e o utilizador não está logado
  if (to.meta.requiresAuth && !loggedIn) {
    next('/login');
  } 
  // Se a rota requer permissão de administrador
  else if (to.meta.requiresAdmin) {
    // E o utilizador não está logado OU não é um administrador
    if (!loggedIn || !user || user.role !== 'admin') {
      next('/login'); // Redireciona para o login
    } else {
      next(); // Permite o acesso
    }
  } 
  // Para todas as outras rotas
  else {
    next();
  }
});

export default router;
