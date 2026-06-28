const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const usuario = await db('usuarios').where({ email }).first();

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        role: usuario.role,
        motorista_id: usuario.motorista_id,
        cliente_id: usuario.cliente_id
      },
      process.env.JWT_SECRET || 'secret_dev',
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login bem sucedido.',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        motorista_id: usuario.motorista_id,
        cliente_id: usuario.cliente_id
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.cadastro = async (req, res, next) => {
  try {
    const { nome, email, senha, cpf_cnpj, endereco, role } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const usuarioExistente = await db('usuarios').where({ email }).first();
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já está em uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    let cliente_id = null;
    let motorista_id = null;
    const assignedRole = role && ['admin', 'motorista', 'cliente'].includes(role) ? role : 'cliente';

    await db.transaction(async (trx) => {
      // Se for cliente, cria o registro na tabela clientes
      if (assignedRole === 'cliente' && nome && cpf_cnpj && endereco) {
        const [insertedClienteId] = await trx('clientes').insert({
          nome,
          cpf_cnpj,
          endereco
        });
        cliente_id = insertedClienteId;
      }
      
      // Se for motorista, cria o registro na tabela motoristas
      if (assignedRole === 'motorista' && nome) {
        const [insertedMotoristaId] = await trx('motoristas').insert({
          nome,
          status: 'ATIVO'
        });
        motorista_id = insertedMotoristaId;
      }

      await trx('usuarios').insert({
        email,
        senha: senhaHash,
        role: assignedRole,
        cliente_id,
        motorista_id
      });
    });

    res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
  } catch (error) {
    next(error);
  }
};
