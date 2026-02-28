exports.seed = async function(knex) {
  await knex('motoristas').del();

  await knex('motoristas').insert([
    { id: 1, nome: 'Carlos Pereira', status: 'ATIVO' },
    { id: 2, nome: 'Roberto Lima', status: 'ATIVO' },
    { id: 3, nome: 'Fernando Costa', status: 'INATIVO' }
  ]);
};