exports.seed = async function(knex) {
  await knex('veiculos').del();

  await knex('veiculos').insert([
    { id: 1, placa: 'ABC1A23', capacidade: 10 },
    { id: 2, placa: 'DEF4B56', capacidade: 12 },
    { id: 3, placa: 'GHI7C89', capacidade: 8 }
  ]);
};