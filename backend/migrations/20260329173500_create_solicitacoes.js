exports.up = function(knex) {
  return knex.schema.createTable('solicitacoes', function(table) {
    table.increments('id').primary();
    table.string('nome').notNullable();
    table.string('cpf_cnpj').notNullable();
    table.string('telefone').notNullable();
    table.string('endereco').notNullable();
    table.enu('tamanho', ['MEDIO', 'GRANDE']).notNullable();
    table.date('data_agendada').notNullable();
    table.text('observacoes').nullable();
    table.enu('status', ['PENDENTE', 'ACEITO', 'REJEITADO']).defaultTo('PENDENTE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('solicitacoes');
};
