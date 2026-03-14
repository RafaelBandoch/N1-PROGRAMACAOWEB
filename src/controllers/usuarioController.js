const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'Email e senha são obrigatórios'
      });
    }

    const usuarioExistente = await db('usuarios')
      .where('email', email)
      .first();

    if (usuarioExistente) {
      return res.status(409).json({
        erro: 'Email já cadastrado'
      });
    }

    const [id] = await db('usuarios').insert({
      email,
      senha
    });

    res.status(201).json({
      mensagem: 'Usuário criado',
      id
    });

  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {

    const usuarios = await db('usuarios')
      .select('id', 'email');

    res.json(usuarios);

  } catch (error) {
    next(error);
  }
};
