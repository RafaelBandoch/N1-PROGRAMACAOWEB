const db = require('../db');

exports.criar = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }

    const usuarioExistente = await db('usuarios').where('email', email).first();
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Email já cadastrado' });
    }

    const [id] = await db('usuarios').insert({ email, senha });
    res.status(201).json({ mensaje: 'Usuário criado', id });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const usuarios = await db('usuarios').select('id', 'email');
    res.json(usuarios);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
