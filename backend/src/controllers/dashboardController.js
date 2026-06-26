const db = require('../database/db');

exports.getMetrics = async (req, res) => {
  try {
    const clientesCount = await db('clientes').count('* as total').first();
    const motoristasCount = await db('motoristas').count('* as total').first();
    const usuariosCount = await db('usuarios').count('* as total').first();
    
    // Caçambas
    const cacambasCount = await db('cacambas').count('* as total').first();
    const cacambasLocadas = await db('cacambas').where('status', 'ENTREGUE').count('* as total').first();

    // Tarefas
    const tarefasCount = await db('tarefas').count('* as total').first();
    const tarefasPendentes = await db('tarefas').whereIn('status', ['EM_ANDAMENTO', 'PENDENTE']).count('* as total').first();

    // Solicitações recentes
    const recentes = await db('solicitacoes').orderBy('created_at', 'desc').limit(5);

    res.json({
      totais: {
        clientes: clientesCount.total,
        motoristas: motoristasCount.total,
        usuarios: usuariosCount.total,
        cacambas: cacambasCount.total,
        cacambasLocadas: cacambasLocadas.total,
        tarefas: tarefasCount.total,
        tarefasPendentes: tarefasPendentes.total
      },
      atividadesRecentes: recentes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar métricas do dashboard.' });
  }
};
