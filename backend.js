/**
 * ============================================================
 *  BACK-END DO CRUD — Catálogo de Biblioteca
 * ============================================================
 * Estrutura de armazenamento: Array de objetos em memória.
 * Cada "livro" é um objeto com o formato:
 *   { id, titulo, autor, ano, disponivel }
 *
 * As funções abaixo simulam os endpoints de uma API REST e
 * podem ser reaproveitadas por qualquer front-end (chamadas
 * diretamente em JS, ou expostas depois via Express/Fastify
 * dentro de rotas HTTP, por exemplo).
 * ============================================================
 */

// "Banco de dados" em memória
let livros = [];

// Contador para gerar IDs únicos e incrementais
let proximoId = 1;

/**
 * CREATE — cria um novo livro e adiciona ao array.
 * @param {Object} dados - { titulo, autor, ano, disponivel }
 * @returns {Object} o livro criado (com id atribuído)
 */
function create(dados) {
  if (!dados || !dados.titulo || !dados.autor) {
    throw new Error("Os campos 'titulo' e 'autor' são obrigatórios.");
  }

  const novoLivro = {
    id: proximoId++,
    titulo: String(dados.titulo).trim(),
    autor: String(dados.autor).trim(),
    ano: dados.ano ? Number(dados.ano) : null,
    disponivel: dados.disponivel !== undefined ? Boolean(dados.disponivel) : true,
  };

  livros.push(novoLivro);
  return novoLivro;
}

/**
 * READ — lê todos os livros, ou um único livro pelo id.
 * @param {number} [id] - se informado, retorna apenas esse livro
 * @returns {Array|Object|null}
 */
function read(id) {
  if (id === undefined) {
    // Retorna uma cópia do array para não expor a referência interna
    return [...livros];
  }

  const livro = livros.find((l) => l.id === Number(id));
  return livro ? { ...livro } : null;
}

/**
 * UPDATE — atualiza os dados de um livro existente pelo id.
 * @param {number} id
 * @param {Object} dadosAtualizados - campos a serem alterados
 * @returns {Object|null} o livro atualizado, ou null se não encontrado
 */
function update(id, dadosAtualizados) {
  const index = livros.findIndex((l) => l.id === Number(id));
  if (index === -1) return null;

  const livroAtual = livros[index];

  const livroAtualizado = {
    ...livroAtual,
    ...dadosAtualizados,
    id: livroAtual.id, // id nunca é alterado
  };

  if (dadosAtualizados.ano !== undefined) {
    livroAtualizado.ano = Number(dadosAtualizados.ano);
  }
  if (dadosAtualizados.disponivel !== undefined) {
    livroAtualizado.disponivel = Boolean(dadosAtualizados.disponivel);
  }

  livros[index] = livroAtualizado;
  return { ...livroAtualizado };
}

/**
 * DELETE — remove um livro do array pelo id.
 * @param {number} id
 * @returns {boolean} true se removeu, false se não encontrou
 */
function deleteById(id) {
  const tamanhoAntes = livros.length;
  livros = livros.filter((l) => l.id !== Number(id));
  return livros.length < tamanhoAntes;
}

// Disponibiliza as funções tanto para Node (module.exports)
// quanto para uso direto no navegador (window / escopo global).
const CrudBiblioteca = { create, read, update, deleteById };

if (typeof module !== "undefined" && module.exports) {
  module.exports = CrudBiblioteca;
}
