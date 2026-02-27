exports.up = function(knex) {
  return knex.schema.createTable('rota_tarefas', function(table) {
    table.integer('rota_id').unsigned().notNullable();
    table.integer('tarefa_id').unsigned().notNullable();

    table.primary(['rota_id', 'tarefa_id']);

    table.foreign('rota_id').references('id').inTable('rotas').onDelete('CASCADE');
    table.foreign('tarefa_id').references('id').inTable('tarefas').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rota_tarefas');
};