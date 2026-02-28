exports.seed = async function(knex) {
  await knex('rota_tarefas').del();

  await knex('rota_tarefas').insert([
    { rota_id: 1, tarefa_id: 1 },
    { rota_id: 1, tarefa_id: 3 },
    { rota_id: 2, tarefa_id: 2 }
  ]);
};