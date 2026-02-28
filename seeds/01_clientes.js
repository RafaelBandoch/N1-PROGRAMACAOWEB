exports.seed = async function(knex) {
  await knex('clientes').del();

  await knex('clientes').insert([
    {
      id: 1,
      nome: 'João Silva',
      cpf_cnpj: '12345678900',
      endereco: 'Rua A, 123'
    },
    {
      id: 2,
      nome: 'Maria Souza',
      cpf_cnpj: '98765432100',
      endereco: 'Av Brasil, 456'
    },
    {
      id: 3,
      nome: 'Construtora Alfa LTDA',
      cpf_cnpj: '11222333000199',
      endereco: 'Rua Industrial, 789'
    }
  ]);
};