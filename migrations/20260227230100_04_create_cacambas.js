exports.up = function(knex) {
  return knex.schema.createTable('cacambas', function(table) {
    table.increments('id').primary();
    table.enu('tamanho', ['GRANDE', 'MEDIO']).notNullable();
    table.enu('status', [
      'DISPONIVEL',
      'ENTREGUE',
      'EM_MANUTENCAO',
      'RESERVADA'
    ]).defaultTo('DISPONIVEL');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('cacambas');
};