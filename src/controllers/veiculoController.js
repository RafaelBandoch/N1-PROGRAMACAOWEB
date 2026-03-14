const db = require('../db');

exports.criar = async (req, res) => {
  try {
    const { placa, capacidade } = req.body;

    if (!placa || !capacidade) {
      return res.status(400).json({ erro: 'Placa e capacidade são obrigatórios' });
    }

    const placaExistente = await db('veiculos').where('placa', placa).first();
    if (placaExistente) {
      return res.status(409).json({ erro: 'Placa já cadastrada' });
    }

    const [id] = await db('veiculos').insert({ placa, capacidade });
    res.status(201).json({ mensagem: 'Veículo criado', id });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const veiculos = await db('veiculos').select('*');
    res.json(veiculos);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};
