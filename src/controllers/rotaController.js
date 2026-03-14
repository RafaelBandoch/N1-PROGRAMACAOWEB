const db = require('../db');

exports.criar = async (req, res) => {
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
      status: status || 'PLANEJADA',
    });

    res.status(201).json({ mensagem: 'Rota criada', id });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const rotas = await db('rotas')
      .select('rotas.*', 'motoristas.nome as motorista_nome')
      .leftJoin('motoristas', 'rotas.motorista_id', 'motoristas.id');
    res.json(rotas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
