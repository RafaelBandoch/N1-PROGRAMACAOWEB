const db = require('../db');

exports.criar = async (req, res) => {
  try {
    const { nome, status } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const [id] = await db('motoristas').insert({
      nome,
      status: status || 'ATIVO',
    });

    res.status(201).json({ mensagem: 'Motorista criado', id });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const motoristas = await db('motoristas').select('*');
    res.json(motoristas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
