const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {

    const { tamanho, status } = req.body;

    if (!tamanho) {
      return res.status(400).json({ erro: 'Tamanho é obrigatório' });
    }

    const [id] = await db('cacambas').insert({
      tamanho,
      status: status || 'DISPONIVEL',
    });

    res.status(201).json({
      mensagem: 'Caçamba criada',
      id
    });

  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {

    const cacambas = await db('cacambas').select('*');

    res.json(cacambas);

  } catch (error) {
    next(error);
  }
};
