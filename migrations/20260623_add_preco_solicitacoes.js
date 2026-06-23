exports.up = function(knex) {
  return knex.schema.table('solicitacoes', function(table) {
    table.decimal('preco', 10, 2).defaultTo(0).notNullable().comment('Preço cobrado pela solicitação');
  });
};

exports.down = function(knex) {
  return knex.schema.table('solicitacoes', function(table) {
    table.dropColumn('preco');
  });
};
