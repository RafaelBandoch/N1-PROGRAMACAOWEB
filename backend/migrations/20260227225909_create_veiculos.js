exports.up = function(knex) {
  return knex.schema.createTable('veiculos', function(table) {
    table.increments('id').primary();
    table.string('placa').notNullable().unique();
    table.integer('capacidade').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('veiculos');
};