const db = require('../db');

exports.criar = async (req, res) => {
  try {
    const { tamanho, status } = req.body;

    if (!tamanho) {
      return res.status(400).json({ erro: 'Tamanho é obrigatório' });
    }

    const [id] = await db('cacambas').insert({
      tamanho,
      status: status || 'DISPONIVEL',
    });

    res.status(201).json({ mensagem: 'Caçamba criada', id });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const cacambas = await db('cacambas').select('*');
    res.json(cacambas);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
