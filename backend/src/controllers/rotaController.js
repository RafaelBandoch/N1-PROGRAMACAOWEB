const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {
    const { data, motorista_id, status } = req.body;

    if (!data || !motorista_id) {
      return res.status(400).json({ erro: 'Data e motorista são obrigatórios' });
    }

    const motoristaExistente = await db('motoristas').where('id', motorista_id).first();

    if (!motoristaExistente) {
      return res.status(404).json({ erro: 'Motorista não encontrado' });
    }

    const [id] = await db('rotas').insert({
      data,
      motorista_id,
      status: status || 'PLANEJADA'
    });

    res.status(201).json({ mensagem: 'Rota criada', id });
  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {
    let query = db('rotas')
      .select('rotas.*', 'motoristas.nome as motorista_nome')
      .leftJoin('motoristas', 'rotas.motorista_id', 'motoristas.id');

    if (req.user && req.user.role === 'motorista' && req.user.motorista_id) {
      query = query.where('rotas.motorista_id', req.user.motorista_id);
    }

    query = query.orderBy('rotas.id', 'desc');

    const rotas = await query;
    res.json(rotas);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status é obrigatório' });
    }

    const rota = await db('rotas').where({ id }).first();

    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }

    await db('rotas').where({ id }).update({ status });
    res.json({ mensagem: 'Status atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.getTarefas = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rota = await db('rotas').where({ id }).first();
    if (!rota) {
      return res.status(404).json({ error: 'Rota não encontrada' });
    }

      const tarefas = await db('tarefas')
        .join('rota_tarefas', 'tarefas.id', '=', 'rota_tarefas.tarefa_id')
        .where('rota_tarefas.rota_id', id)
        .select('tarefas.*')
        .orderBy('tarefas.id', 'desc');

      res.json(tarefas);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('rotas').where({ id }).delete();
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: 'Não foi possível excluir. O registro pode estar em uso.' });
  }
};
