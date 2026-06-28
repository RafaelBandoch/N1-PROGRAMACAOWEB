exports.up = function(knex) {
  return knex.schema.createTable('notificacoes', table => {
    table.increments('id').primary();
    table.integer('usuario_id').unsigned().notNullable();
    table.foreign('usuario_id').references('usuarios.id').onDelete('CASCADE');
    table.string('mensagem').notNullable();
    table.string('tipo').defaultTo('INFO');
    table.boolean('lida').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('notificacoes');
};
