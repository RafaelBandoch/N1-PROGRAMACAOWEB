/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('usuarios', function(table) {
    table.enu('role', ['admin', 'cliente', 'motorista']).defaultTo('cliente').notNullable();
    table.integer('motorista_id').unsigned().nullable();
    table.integer('cliente_id').unsigned().nullable();

    table.foreign('motorista_id').references('id').inTable('motoristas').onDelete('SET NULL');
    table.foreign('cliente_id').references('id').inTable('clientes').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('usuarios', function(table) {
    table.dropForeign('motorista_id');
    table.dropForeign('cliente_id');
    table.dropColumn('role');
    table.dropColumn('motorista_id');
    table.dropColumn('cliente_id');
  });
};
