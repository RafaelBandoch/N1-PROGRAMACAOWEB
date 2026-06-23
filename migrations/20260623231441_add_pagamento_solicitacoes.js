exports.up = function(knex) {
  return knex.schema.table('solicitacoes', function(table) {
    table.string('forma_pagamento').nullable().comment('Ex: DINHEIRO_ENTREGA, CARTAO_ENTREGA, PIX_ONLINE, etc.');
    table.decimal('troco_para', 10, 2).nullable().comment('Valor que o cliente precisa de troco se pagar em dinheiro na entrega');
  });
};

exports.down = function(knex) {
  return knex.schema.table('solicitacoes', function(table) {
    table.dropColumn('forma_pagamento');
    table.dropColumn('troco_para');
  });
};
