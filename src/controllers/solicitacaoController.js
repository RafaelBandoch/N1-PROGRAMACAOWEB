const db = require('../database/db');

module.exports = {
  async index(req, res, next) {
    try {
      const solicitacoes = await db('solicitacoes').orderBy('created_at', 'desc');
      return res.json(solicitacoes);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nome, cpf_cnpj, telefone, endereco, tamanho, data_agendada, observacoes } = req.body;
      const [id] = await db('solicitacoes').insert({
        nome,
        cpf_cnpj,
        telefone,
        endereco,
        tamanho,
        data_agendada,
        observacoes,
        status: 'PENDENTE'
      });
      return res.status(201).json({ id, message: 'Solicitação criada com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const allowedStatuses = ['PENDENTE', 'ACEITO', 'REJEITADO'];
      if(!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      await db('solicitacoes').where({ id }).update({ status });
      return res.json({ message: 'Status atualizado com sucesso' });
    } catch (error) {
      next(error);
    }
  },

  async aprovar(req, res, next) {
    try {
      const { id } = req.params;
      const { motorista_id, veiculo_id, cacamba_id } = req.body;

      if (!motorista_id || !veiculo_id || !cacamba_id) {
        return res.status(400).json({ erro: 'Motorista, Veículo e Caçamba são obrigatórios' });
      }

      // 1. Fetch Solicitacao
      const sol = await db('solicitacoes').where({ id }).first();
      if (!sol) return res.status(404).json({ erro: 'Solicitação não encontrada' });
      if (sol.status !== 'PENDENTE') return res.status(400).json({ erro: 'Solicitação já processada' });

      // 2. Find or Create Cliente
      let cliente = await db('clientes').where({ cpf_cnpj: sol.cpf_cnpj }).first();
      let cliente_id;
      if (cliente) {
        cliente_id = cliente.id;
      } else {
        const [newClienteId] = await db('clientes').insert({
          nome: sol.nome,
          cpf_cnpj: sol.cpf_cnpj,
          endereco: sol.telefone + ' - ' + sol.endereco // Temporary concat for phone if db lacks telefone
        });
        cliente_id = newClienteId;
      }

      // 3. Create Tarefa
      await db('tarefas').insert({
        tipo: 'ENTREGA',
        cacamba_id,
        cliente_id,
        motorista_id,
        veiculo_id,
        endereco_execucao: sol.endereco,
        data_agendada: sol.data_agendada,
        status: 'EM_ANDAMENTO',
        justificativa: sol.observacoes || ''
      });

      // 4. Update Solicitacao to ACEITO
      await db('solicitacoes').where({ id }).update({ status: 'ACEITO' });

      return res.json({ mensagem: 'Solicitação aprovada e Tarefa criada com sucesso!' });
    } catch (error) {
      next(error);
    }
  }
};
