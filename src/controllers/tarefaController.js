const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {
    const { tipo, cacamba_id, cliente_id, motorista_id, veiculo_id, endereco_execucao, data_agendada, status, justificativa } = req.body;

    if (!tipo || !cacamba_id || !cliente_id || !endereco_execucao || !data_agendada) {
      return res.status(400).json({ erro: 'Preencha os campos obrigatórios' });
    }

    const [id] = await db('tarefas').insert({
      tipo, cacamba_id, cliente_id, motorista_id, veiculo_id, endereco_execucao, data_agendada, status, justificativa
    });

    res.status(201).json({ mensagem: 'Tarefa criada', id });
  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {
    const tarefas = await db('tarefas')
      .select(
        'tarefas.*',
        'clientes.nome as cliente_nome',
        'motoristas.nome as motorista_nome',
        'veiculos.placa as veiculo_placa'
      )
      .leftJoin('clientes', 'tarefas.cliente_id', 'clientes.id')
      .leftJoin('motoristas', 'tarefas.motorista_id', 'motoristas.id')
      .leftJoin('veiculos', 'tarefas.veiculo_id', 'veiculos.id')
      .orderBy('data_agendada', 'asc');

    res.json(tarefas);
  } catch (error) {
    next(error);
  }
};
