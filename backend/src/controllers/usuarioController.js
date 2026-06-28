const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {

    const { email, senha, role } = req.body;

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
      senha,
      role: role || 'cliente'
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
      .select('id', 'email', 'role');

    res.json(usuarios);

  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('usuarios').where({ id }).delete();
    res.json({ message: 'Registro removido com sucesso' });
  } catch (error) {
    return res.status(400).json({ error: 'Não foi possível excluir. O registro pode estar em uso.' });
  }
};
