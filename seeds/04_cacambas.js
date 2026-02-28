exports.seed = async function(knex) {
  await knex('cacambas').del();

  await knex('cacambas').insert([
    { id: 1, tamanho: 'GRANDE', status: 'DISPONIVEL' },
    { id: 2, tamanho: 'MEDIO', status: 'DISPONIVEL' },
    { id: 3, tamanho: 'GRANDE', status: 'EM_MANUTENCAO' },
    { id: 4, tamanho: 'MEDIO', status: 'RESERVADA' }
  ]);
};