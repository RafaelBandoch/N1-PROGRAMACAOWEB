exports.up = function(knex) {
  return knex.schema.createTable('motoristas', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.enu('status', ['ATIVO', 'INATIVO']).defaultTo('ATIVO');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('motoristas');
};