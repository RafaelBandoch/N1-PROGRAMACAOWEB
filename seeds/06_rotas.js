exports.seed = async function(knex) {
  await knex('rotas').del();

  await knex('rotas').insert([
    {
      id: 1,
      data: '2026-03-01',
      motorista_id: 1,
      status: 'PLANEJADA'
    },
    {
      id: 2,
      data: '2026-03-02',
      motorista_id: 2,
      status: 'EM_EXECUCAO'
    }
  ]);
};