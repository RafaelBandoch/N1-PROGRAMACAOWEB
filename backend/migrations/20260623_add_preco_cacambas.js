exports.up = function(knex) {
  return knex.schema.table('cacambas', function(table) {
    table.decimal('preco', 10, 2).defaultTo(0).notNullable().comment('Preço da caçamba em reais');
  });
};

exports.down = function(knex) {
  return knex.schema.table('cacambas', function(table) {
    table.dropColumn('preco');
  });
};
