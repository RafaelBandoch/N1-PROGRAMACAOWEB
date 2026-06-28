exports.up = function(knex) {
  return knex.schema.table('tarefas', function(table) {
    table.string('forma_pagamento').nullable();
    table.decimal('troco_para', 10, 2).nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.table('tarefas', function(table) {
    table.dropColumn('forma_pagamento');
    table.dropColumn('troco_para');
  });
};
