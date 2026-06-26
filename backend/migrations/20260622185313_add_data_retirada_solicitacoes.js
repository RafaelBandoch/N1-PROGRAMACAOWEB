exports.up = function(knex) {
  return knex.schema.alterTable('solicitacoes', (table) => {
    table.date('data_retirada').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('solicitacoes', (table) => {
    table.dropColumn('data_retirada');
  });
};
