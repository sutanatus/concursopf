<template>
  <div class="management-container">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h3>Painel Admin</h3>
      </div>
      <nav>
        <ul>
          <li><router-link to="/admin/dashboard">🏠 Dashboard</router-link></li>
          <!-- Este é o link ativo para a página atual -->
          <li class="active"><router-link to="/admin/subjects">📚 Gestão de Matérias</router-link></li>
          <li><a href="#" @click.prevent="logout">🚪 Sair</a></li>
        </ul>
      </nav>
    </aside>

    <div class="main-content">
      <header class="page-header">
        <h1>Gestão de Matérias</h1>
        <p>Crie e organize as matérias de estudo da plataforma.</p>
      </header>

      <div class="content-grid">
        <!-- Formulário para Criar Nova Matéria -->
        <div class="form-card">
          <h2>Adicionar Nova Matéria</h2>
          <form @submit.prevent="submitSubject">
            <div class="input-group">
              <label for="title">Título da Matéria</label>
              <input type="text" id="title" v-model="newSubject.title" required>
            </div>
            <div class="input-group">
              <label for="instructor">Instrutor</label>
              <input type="text" id="instructor" v-model="newSubject.instructor">
            </div>
            <div class="input-group">
              <label for="description">Descrição</label>
              <textarea id="description" v-model="newSubject.description" rows="4"></textarea>
            </div>
            <button type="submit" class="submit-button">Salvar Matéria</button>
          </form>
        </div>

        <!-- Lista de Matérias Existentes -->
        <div class="list-card">
          <h2>Matérias Existentes ({{ subjects.length }})</h2>
          <ul v-if="subjects.length > 0" class="item-list">
            <li v-for="subject in subjects" :key="subject.id">
              <span>{{ subject.title }} <small>por {{ subject.instructor || 'N/A' }}</small></span>
              <div class="actions">
                <!-- O link para gerir os decks desta matéria -->
                <router-link :to="`/admin/subject/${subject.id}/decks`" class="manage-button">Gerir Decks</router-link>
                <button @click="confirmDelete(subject.id)" class="delete-button">Apagar</button>
              </div>
            </li>
          </ul>
          <p v-else>Nenhuma matéria criada ainda.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubjectManagement',
  data() {
    return {
      subjects: [],
      newSubject: {
        title: '',
        description: '',
        instructor: ''
      }
    };
  },
  async created() {
    await this.fetchSubjects();
  },
  methods: {
    async fetchSubjects() {
      try {
        this.subjects = await this.$axios.get('/subjects');
      } catch (error) {
        alert('Erro ao carregar a lista de matérias.');
        console.error(error);
      }
    },
    async submitSubject() {
      if (!this.newSubject.title) {
        alert('O título da matéria é obrigatório.');
        return;
      }
      try {
        const response = await this.$axios.post('/subjects', this.newSubject);
        alert(response.message);
        this.resetForm();
        await this.fetchSubjects(); // Atualiza a lista após a criação
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Erro ao salvar a matéria.';
        alert(errorMessage);
      }
    },
    async deleteSubject(subjectId) {
      try {
        const response = await this.$axios.delete(`/subjects/${subjectId}`);
        alert(response.message);
        await this.fetchSubjects(); // Atualiza a lista após apagar
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Erro ao apagar a matéria.';
        alert(errorMessage);
      }
    },
    confirmDelete(subjectId) {
      if (window.confirm("Tem a certeza de que quer apagar esta matéria e todos os seus decks e flashcards? Esta ação não pode ser desfeita.")) {
        this.deleteSubject(subjectId);
      }
    },
    resetForm() {
      this.newSubject = { title: '', description: '', instructor: '' };
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
.management-container { display: flex; background-color: #f4f7fc; min-height: 100vh; }
.sidebar { width: 240px; background-color: #2c3e50; color: #ecf0f1; flex-shrink: 0; }
.sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #34495e;}
.sidebar nav ul { list-style-type: none; padding: 0; margin: 20px 0; }
.sidebar a { display: block; color: #ecf0f1; text-decoration: none; padding: 15px 20px; transition: background-color 0.2s; }
.sidebar li.active a, .sidebar a:hover { background-color: #34495e; }
.main-content { flex-grow: 1; padding: 30px; }
.page-header { margin-bottom: 30px; }
.page-header h1 { margin: 0; color: #34495e; }
.content-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
.form-card, .list-card { background-color: #fff; padding: 25px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
h2 { margin-top: 0; color: #3498db; }
.input-group { margin-bottom: 20px; }
.input-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #34495e; }
.input-group input, .input-group textarea { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
.submit-button { background-color: #27ae60; color: white; padding: 12px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
.item-list { list-style: none; padding: 0; margin: 0; }
.item-list li { display: flex; justify-content: space-between; align-items: center; padding: 15px 0; border-bottom: 1px solid #ecf0f1; }
.item-list li:last-child { border-bottom: none; }
.item-list small { color: #7f8c8d; margin-left: 10px; }
.actions button, .actions a { font-size: 0.8rem; padding: 5px 10px; border-radius: 3px; margin-left: 10px; text-decoration: none; color: white; border: none; cursor: pointer; }
.manage-button { background-color: #3498db; }
.delete-button { background-color: #e74c3c; }
</style>
