exports.up = function(knex) {
  return knex.schema.alterTable('motoristas', table => {
    table.decimal('latitude', 10, 8).nullable();
    table.decimal('longitude', 11, 8).nullable();
    table.timestamp('ultima_atualizacao_gps').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('motoristas', table => {
    table.dropColumn('latitude');
    table.dropColumn('longitude');
    table.dropColumn('ultima_atualizacao_gps');
  });
};
