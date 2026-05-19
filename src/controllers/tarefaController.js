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
    let query = db('tarefas')
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

    if (req.user && req.user.role === 'motorista' && req.user.motorista_id) {
      query = query.where('tarefas.motorista_id', req.user.motorista_id);
    }

    const tarefas = await query;

    res.json(tarefas);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ erro: 'Status é obrigatório' });
    }

    const tarefa = await db('tarefas').where({ id }).first();

    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    await db('tarefas').where({ id }).update({ status });
    res.json({ mensagem: 'Status da tarefa atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('tarefas').where({ id }).delete();
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: 'Não foi possível excluir. O registro pode estar em uso.' });
  }
};

