/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('tarefas', function(table) {
    table.integer('solicitacao_id').unsigned().nullable().references('id').inTable('solicitacoes').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('tarefas', function(table) {
    table.dropColumn('solicitacao_id');
  });
};
