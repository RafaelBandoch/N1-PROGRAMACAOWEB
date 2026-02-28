exports.seed = async function(knex) {
  await knex('tarefas').del();

  await knex('tarefas').insert([
    {
      id: 1,
      tipo: 'ENTREGA',
      cacamba_id: 1,
      cliente_id: 1,
      motorista_id: 1,
      veiculo_id: 1,
      endereco_execucao: 'Rua A, 123',
      data_agendada: '2026-03-01 08:00:00',
      status: 'EM_ANDAMENTO',
      justificativa: null
    },
    {
      id: 2,
      tipo: 'COLETA',
      cacamba_id: 2,
      cliente_id: 2,
      motorista_id: 2,
      veiculo_id: 2,
      endereco_execucao: 'Av Brasil, 456',
      data_agendada: '2026-03-02 09:00:00',
      status: 'EM_ANDAMENTO',
      justificativa: null
    },
    {
      id: 3,
      tipo: 'TROCA',
      cacamba_id: 1,
      cliente_id: 3,
      motorista_id: 1,
      veiculo_id: 1,
      endereco_execucao: 'Rua Industrial, 789',
      data_agendada: '2026-03-03 10:00:00',
      status: 'JUSTIFICADO',
      justificativa: 'Cliente solicitou reagendamento'
    }
  ]);
};