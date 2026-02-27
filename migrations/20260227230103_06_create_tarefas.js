exports.up = function(knex) {
  return knex.schema.createTable('tarefas', function(table) {
    table.increments('id').primary();

    table.enu('tipo', ['ENTREGA', 'COLETA', 'TROCA']).notNullable();

    table.integer('cacamba_id').unsigned().notNullable();
    table.integer('cliente_id').unsigned().notNullable();
    table.integer('motorista_id').unsigned().notNullable();
    table.integer('veiculo_id').unsigned().notNullable();

    table.string('endereco_execucao').notNullable();
    table.dateTime('data_agendada').notNullable();

    table.enu('status', [
      'EM_ANDAMENTO',
      'ENTREGUE',
      'COLETADO',
      'CANCELADO',
      'JUSTIFICADO'
    ]).defaultTo('EM_ANDAMENTO');

    table.text('justificativa').nullable();

    table.foreign('cacamba_id').references('id').inTable('cacambas');
    table.foreign('cliente_id').references('id').inTable('clientes');
    table.foreign('motorista_id').references('id').inTable('motoristas');
    table.foreign('veiculo_id').references('id').inTable('veiculos');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tarefas');
};