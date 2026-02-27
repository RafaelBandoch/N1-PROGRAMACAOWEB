exports.up = function(knex) {
  return knex.schema.createTable('clientes', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cpf_cnpj').notNullable().unique();
    table.string('endereco').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('clientes');
};