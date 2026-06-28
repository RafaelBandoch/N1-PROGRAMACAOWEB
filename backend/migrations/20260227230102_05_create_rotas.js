exports.up = function(knex) {
  return knex.schema.createTable('rotas', function(table) {
    table.increments('id').primary();
    table.date('data').notNullable();
    table.integer('motorista_id').unsigned().notNullable();
    table.enu('status', [
      'PLANEJADA',
      'EM_EXECUCAO',
      'FINALIZADA'
    ]).defaultTo('PLANEJADA');

    table.foreign('motorista_id').references('id').inTable('motoristas');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rotas');
};