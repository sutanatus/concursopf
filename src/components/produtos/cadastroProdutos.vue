<template>
  <div class="login-container">
    <div class="login-box">
      <h2>Cadastro de Produto</h2>
      <form @submit.prevent="cadastrarProduto">
        <div class="form-group">
          <label for="nome">Nome do Produto:</label>
          <input type="text" id="nome" v-model="produto.nome" placeholder="Digite o nome do produto" required />
        </div>

        <div class="form-group">
          <label for="codigo">Código do Produto/SKU:</label>
          <input type="text" id="codigo" v-model="produto.codigo" placeholder="Digite o código/SKU (opcional)" />
        </div>

        <div class="form-group">
          <label for="categoria">Categoria:</label>
          <select id="categoria" v-model="produto.categoria">
            <option value="" disabled>Selecione</option>
            <option v-for="opcao in categorias" :key="opcao" :value="opcao">{{ opcao }}</option>
          </select>
        </div>

        <div class="form-group" v-if="subcategorias.length > 0">
          <label for="subcategoria">Subcategoria:</label>
          <select id="subcategoria" v-model="produto.subcategoria">
            <option value="" disabled>Selecione</option>
            <option v-for="opcao in subcategorias" :key="opcao" :value="opcao">{{ opcao }}</option>
          </select>
        </div>

        <div class="form-group">
          <label for="marca">Marca:</label>
          <input type="text" id="marca" v-model="produto.marca" placeholder="Digite a marca (opcional)" />
        </div>

        <div class="form-group">
          <label for="modelo">Modelo:</label>
          <input type="text" id="modelo" v-model="produto.modelo" placeholder="Digite o modelo (opcional)" />
        </div>

        <div class="form-group">
          <label for="precoCusto">Preço de Custo:</label>
          <input type="number" id="precoCusto" v-model="produto.precoCusto" step="0.01" placeholder="Digite o preço de custo" />
        </div>

        <div class="form-group">
          <label for="precoVenda">Preço de Venda:</label>
          <input type="number" id="precoVenda" v-model="produto.precoVenda" step="0.01" placeholder="Digite o preço de venda" required />
        </div>

        <div class="form-group">
          <label for="unidadeMedida">Unidade de Medida:</label>
          <select id="unidadeMedida" v-model="produto.unidadeMedida">
            <option value="" disabled>Selecione</option>
            <option value="unidade">Unidade</option>
            <option value="kg">Kg</option>
            <option value="metro">Metro</option>
            <option value="litro">Litro</option>
          </select>
        </div>

        <div class="form-group">
          <label for="estoque">Quantidade em Estoque:</label>
          <input type="number" id="estoque" v-model="produto.estoque" placeholder="Digite a quantidade em estoque" required />
        </div>

        <div class="form-group">
          <label for="estoqueMinimo">Estoque Mínimo:</label>
          <input type="number" id="estoqueMinimo" v-model="produto.estoqueMinimo" placeholder="Digite o estoque mínimo (opcional)" />
        </div>

        <div class="form-group">
          <label for="descricaoCurta">Descrição Curta:</label>
          <textarea id="descricaoCurta" v-model="produto.descricaoCurta" placeholder="Digite uma descrição curta"></textarea>
        </div>

        <div class="form-group">
          <label for="descricaoDetalhada">Descrição Detalhada:</label>
          <textarea id="descricaoDetalhada" v-model="produto.descricaoDetalhada" placeholder="Digite a descrição detalhada"></textarea>
        </div>

        <div class="form-group">
          <label for="peso">Peso (em Kg):</label>
          <input type="number" id="peso" v-model="produto.peso" step="0.001" placeholder="Digite o peso (opcional)" />
        </div>

        <div class="form-group">
          <label>Dimensões (cm):</label>
          <div class="dimensions">
            <label for="altura">Altura:</label>
            <input type="number" id="altura" v-model="produto.altura" step="0.1" placeholder="Altura" />
            <label for="largura">Largura:</label>
            <input type="number" id="largura" v-model="produto.largura" step="0.1" placeholder="Largura" />
            <label for="profundidade">Profundidade:</label>
            <input type="number" id="profundidade" v-model="produto.profundidade" step="0.1" placeholder="Profundidade" />
          </div>
        </div>

        <div class="form-group">
          <label for="cor">Cor:</label>
          <input type="text" id="cor" v-model="produto.cor" placeholder="Digite a cor (opcional)" />
        </div>

        <div class="form-group">
          <label for="material">Material:</label>
          <input type="text" id="material" v-model="produto.material" placeholder="Digite o material (opcional)" />
        </div>

        <div class="form-group">
          <label for="imagem">Imagem do Produto:</label>
          <input type="file" id="imagem" @change="handleImagem" />
          <img v-if="previewImagem" :src="previewImagem" alt="Prévia da Imagem" style="max-width: 100px; margin-top: 10px;" />
        </div>

        <div class="form-group">
          <label for="ativo">Ativo:</label>
          <input type="checkbox" id="ativo" v-model="produto.ativo" />
        </div>

        <div class="form-group">
          <label for="observacoes">Observações:</label>
          <textarea id="observacoes" v-model="produto.observacoes" placeholder="Digite alguma observação (opcional)"></textarea>
        </div>

        <button type="submit" class="login-button">Cadastrar Produto</button>
        <button type="button" @click="limparFormulario" class="login-button" style="background: #6c757d; color: #fff;">Limpar</button>
      </form>
    </div>
  </div>
</template>

<script>
// A melhor prática é usar o plugin $axios que já configuramos!
// Não precisa importar o axios aqui se o plugin estiver instalado no main.js

export default {
  name: 'CadastroProduto',
  data() {
    return {
      produto: {
        nome: '',
        codigo: '',
        categoria: '',
        subcategoria: '',
        marca: '',
        modelo: '',
        precoCusto: null,
        precoVenda: null,
        unidadeMedida: '',
        estoque: null,
        estoqueMinimo: null,
        descricaoCurta: '',
        descricaoDetalhada: '',
        peso: null,
        altura: null,
        largura: null,
        profundidade: null,
        cor: '',
        material: '',
        // imagem: null, // A lógica de imagem é mais complexa, vamos focar nos dados primeiro
        ativo: true,
        observacoes: ''
      },
      categorias: ['Eletrônicos', 'Roupas', 'Livros', 'Alimentos'],
      subcategorias: [],
      // previewImagem: null
    };
  },
  watch: {
    'produto.categoria': function (novaCategoria) {
      if (novaCategoria === 'Eletrônicos') {
        this.subcategorias = ['Smartphones', 'Notebooks', 'Acessórios'];
      } else if (novaCategoria === 'Roupas') {
        this.subcategorias = ['Camisetas', 'Calças', 'Vestidos'];
      } else if (novaCategoria === 'Livros') {
        this.subcategorias = ['Ficção', 'Não Ficção', 'Infantil'];
      } else if (novaCategoria === 'Alimentos') {
        this.subcategorias = ['Perecíveis', 'Não Perecíveis', 'Bebidas'];
      } else {
        this.subcategorias = [];
      }
      this.produto.subcategoria = '';
    }
  },
  methods: {
    async cadastrarProduto() {
      // Validação no frontend antes de enviar
      if (!this.produto.nome || !this.produto.precoVenda) {
        alert('Por favor, preencha o Nome e o Preço de Venda do produto.');
        return;
      }
      
      try {
        // Usamos this.$axios, que já tem o token de autenticação configurado!
        const response = await this.$axios.post('/products', this.produto);
        
        alert(response.message); // Exibe "Produto cadastrado com sucesso!"
        this.limparFormulario();

      } catch (error) {
        // Exibe a mensagem de erro que vem da nossa API
        const errorMessage = error.response?.data?.error || 'Não foi possível cadastrar o produto.';
        alert(`Erro: ${errorMessage}`);
      }
    },
    limparFormulario() {
      // Reseta o objeto 'produto' para o seu estado inicial
      Object.assign(this.$data.produto, this.$options.data().produto);
      // this.previewImagem = null;
    },
    // handleImagem(event) {
    //   const file = event.target.files[0];
    //   this.produto.imagem = file;
    //   this.previewImagem = URL.createObjectURL(file);
    // }
  }
};
</script>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #0a0a1a;
}

.login-box {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 450px;
  text-align: center;
  border: 1px solid rgba(255, 153, 0, 0.2);
}

h2 {
  color: #ff9900;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  color: #cccccc;
  margin-bottom: 5px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
select,
textarea,
input[type="file"],
input[type="checkbox"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #333;
  border-radius: 5px;
  background-color: #1a1a2e;
  color: #ffffff;
  box-sizing: border-box;
}

select {
  appearance: none; /* Remove a aparência padrão do select */
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg fill="%23cccccc" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  padding-right: 2.5em;
}

textarea {
  resize: vertical;
}

.dimensions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dimensions label {
  margin-bottom: 0;
  width: auto;
}

.dimensions input {
  width: auto;
  flex-grow: 1;
}

.login-button {
  background: linear-gradient(90deg, #ff9900, #ff6600);
  color: #000;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(255, 153, 0, 0.4);
  width: 100%;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255, 153, 0, 0.6);
}
</style>