const db = require('../database/db');

exports.criar = async (req, res, next) => {
  try {

    const { nome, cpf_cnpj, endereco } = req.body;

    if (!nome || !cpf_cnpj || !endereco) {
      return res.status(400).json({
        erro: 'Nome, CPF/CNPJ e endereço são obrigatórios'
      });
    }

    const clienteExistente = await db('clientes')
      .where('cpf_cnpj', cpf_cnpj)
      .first();

    if (clienteExistente) {
      return res.status(409).json({
        erro: 'CPF/CNPJ já cadastrado'
      });
    }

    const [id] = await db('clientes').insert({
      nome,
      cpf_cnpj,
      endereco
    });

    res.status(201).json({
      mensagem: 'Cliente criado',
      id
    });

  } catch (error) {
    next(error);
  }
};

exports.listar = async (req, res, next) => {
  try {

    const clientes = await db('clientes').select('*');

    res.json(clientes);

  } catch (error) {
    next(error);
  }
};
