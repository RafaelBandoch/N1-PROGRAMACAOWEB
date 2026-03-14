const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {

    const { nome, status } = req.body;

    if (!nome) {
      return res.status(400).json({
        erro: 'Nome é obrigatório'
      });
    }

    const [id] = await db('motoristas').insert({
      nome,
      status: status || 'ATIVO',
    });

    res.status(201).json({
      mensagem: 'Motorista criado',
      id
    });

  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {

    const motoristas = await db('motoristas').select('*');

    res.json(motoristas);

  } catch (error) {
    next(error);
  }
};
