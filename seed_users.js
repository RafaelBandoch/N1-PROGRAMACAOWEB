const db = require('./src/database/db');
const bcrypt = require('bcryptjs');

async function seed() {
  const salt = await bcrypt.genSalt(10);
  const senhaHashAdmin = await bcrypt.hash('admin123', salt);
  const senhaHashMotorista = await bcrypt.hash('motorista123', salt);
  const senhaHashCliente = await bcrypt.hash('cliente123', salt);

  try {
    console.log('Iniciando o processo de seed...');

    // Admin
    const existingAdmin = await db('usuarios').where({ email: 'admin@facilitacacambas.com' }).first();
    if (!existingAdmin) {
      await db('usuarios').insert({
        email: 'admin@facilitacacambas.com',
        senha: senhaHashAdmin,
        role: 'admin'
      });
      console.log('✔ Admin criado (admin@facilitacacambas.com)');
    }

    // Motorista
    const existingMotorista = await db('usuarios').where({ email: 'motorista@facilitacacambas.com' }).first();
    if (!existingMotorista) {
      const [motorista_id] = await db('motoristas').insert({
        nome: 'João Motorista',
        status: 'ATIVO'
      });
      await db('usuarios').insert({
        email: 'motorista@facilitacacambas.com',
        senha: senhaHashMotorista,
        role: 'motorista',
        motorista_id
      });
      console.log(`✔ Motorista criado (motorista@facilitacacambas.com) - ID Motorista: ${motorista_id}`);
    }

    // Cliente
    const existingCliente = await db('usuarios').where({ email: 'cliente@teste.com' }).first();
    if (!existingCliente) {
      const [cliente_id] = await db('clientes').insert({
        nome: 'Empresa Teste',
        cpf_cnpj: '00.000.000/0001-00',
        endereco: 'Rua de Teste, 123'
      });
      await db('usuarios').insert({
        email: 'cliente@teste.com',
        senha: senhaHashCliente,
        role: 'cliente',
        cliente_id
      });
      console.log(`✔ Cliente criado (cliente@teste.com) - ID Cliente: ${cliente_id}`);
    }

    console.log('\nSeed finalizado com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro ao popular dados:', error);
  } finally {
    process.exit();
  }
}

seed();
