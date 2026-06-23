const db = require('../database/db');

module.exports = {
  async index(req, res, next) {
    try {
      let query = db('solicitacoes').orderBy('created_at', 'desc');

      if (req.user && req.user.role === 'cliente') {
        if (!req.user.cliente_id) {
          return res.json([]);
        }
        const cliente = await db('clientes').where({ id: req.user.cliente_id }).first();
        if (cliente && cliente.cpf_cnpj) {
          query = query.where('cpf_cnpj', cliente.cpf_cnpj);
        } else {
          return res.json([]);
        }
      }

      const solicitacoes = await query;
      return res.json(solicitacoes);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nome, cpf_cnpj, telefone, endereco, tamanho, data_agendada, observacoes } = req.body;
      
      let finalCpfCnpj = cpf_cnpj;
      if (req.user && req.user.role === 'cliente' && req.user.cliente_id) {
        const cliente = await db('clientes').where({ id: req.user.cliente_id }).first();
        if (cliente && cliente.cpf_cnpj) {
          finalCpfCnpj = cliente.cpf_cnpj;
        }
      }

      // Obter preço da caçamba baseado no tamanho
      const cacambaPreco = await db('cacambas')
        .where({ tamanho })
        .first();
      
      const preco = cacambaPreco ? cacambaPreco.preco : 0;

      const [id] = await db('solicitacoes').insert({
        nome,
        cpf_cnpj: finalCpfCnpj,
        telefone,
        endereco,
        tamanho,
        data_agendada,
        observacoes,
        status: 'PENDENTE',
        preco
      });

      const admins = await db('usuarios').where({ role: 'admin' });
      const notificacoesAdmins = admins.map(admin => ({
        usuario_id: admin.id,
        mensagem: `Novo pedido recebido de ${nome} (${tamanho})`,
        tipo: 'INFO'
      }));
      if (notificacoesAdmins.length > 0) {
        try {
          await db('notificacoes').insert(notificacoesAdmins);
        } catch (notifError) {
          console.error('Falha ao criar notificações de admin:', notifError);
        }
      }
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

      const sol = await db('solicitacoes').where({ id }).first();
      if (!sol) {
        return res.status(404).json({ erro: 'Solicitação não encontrada' });
      }
      if (sol.status !== 'PENDENTE') {
        return res.status(400).json({ erro: 'Solicitação já processada' });
      }

      await db.transaction(async trx => {
        const motorista = await trx('motoristas').where({ id: motorista_id }).first();
        if (!motorista) {
          throw new Error('Motorista selecionado não existe');
        }

        const veiculo = await trx('veiculos').where({ id: veiculo_id }).first();
        if (!veiculo) {
          throw new Error('Veículo selecionado não existe');
        }

        const cacamba = await trx('cacambas').where({ id: cacamba_id }).first();
        if (!cacamba) {
          throw new Error('Caçamba selecionada não existe');
        }

        let cliente = await trx('clientes').where({ cpf_cnpj: sol.cpf_cnpj }).first();
        let cliente_id;
        if (cliente) {
          cliente_id = cliente.id;
        } else {
          const [newClienteId] = await trx('clientes').insert({
            nome: sol.nome,
            cpf_cnpj: sol.cpf_cnpj,
            endereco: sol.telefone + ' - ' + sol.endereco
          });
          cliente_id = newClienteId;
        }

        const [tarefa_id] = await trx('tarefas').insert({
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

        let rota = await trx('rotas')
          .where({ motorista_id, data: sol.data_agendada })
          .whereIn('status', ['PLANEJADA', 'EM_EXECUCAO'])
          .first();

        let rota_id;
        if (rota) {
          rota_id = rota.id;
        } else {
          const [newRotaId] = await trx('rotas').insert({
            data: sol.data_agendada,
            motorista_id,
            status: 'PLANEJADA'
          });
          rota_id = newRotaId;
        }

        await trx('rota_tarefas').insert({
          rota_id,
          tarefa_id
        });

        await trx('solicitacoes').where({ id }).update({ status: 'ACEITO' });

        const notifications = [];
        const usuarioCliente = await trx('usuarios').where({ cliente_id, role: 'cliente' }).first();
        if (usuarioCliente) {
          notifications.push({
            usuario_id: usuarioCliente.id,
            mensagem: 'Seu pedido foi aprovado e a caçamba agendada!',
            tipo: 'SUCCESS'
          });
        }

        const usuarioMotorista = await trx('usuarios').where({ motorista_id, role: 'motorista' }).first();
        if (usuarioMotorista) {
          notifications.push({
            usuario_id: usuarioMotorista.id,
            mensagem: `Você recebeu uma nova tarefa para ${sol.data_agendada}.`,
            tipo: 'INFO'
          });
        }

        if (notifications.length > 0) {
          try {
            await trx('notificacoes').insert(notifications);
          } catch (notifError) {
            console.error('Falha ao criar notificações na aprovação:', notifError);
          }
        }
      });

      return res.json({ mensagem: 'Solicitação aprovada, Tarefa criada e vinculada a Rota com sucesso!' });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await db('solicitacoes').where({ id }).delete();
      res.json({ message: 'Registro removido com sucesso' });
    } catch (error) {
      return res.status(400).json({ error: 'Não foi possível excluir. O registro pode estar em uso.' });
    }
  },

  async rastrear(req, res, next) {
    try {
      const { id } = req.params;
      const sol = await db('solicitacoes').where({ id }).first();
      if (!sol) return res.status(404).json({ erro: 'Solicitação não encontrada' });
      
      const usuarioLogado = await db('usuarios').where({ id: req.user.id }).first();
      if (!usuarioLogado) return res.status(403).json({ erro: 'Acesso negado' });

      const motorista = await db('motoristas').first(); // Pega o primeiro motorista para o Mock rápido

      if (!motorista) {
        return res.status(404).json({ erro: 'Nenhum motorista cadastrado no sistema.' });
      }

      const lat = motorista.latitude || -26.3012;
      const lng = motorista.longitude || -48.8490;

      return res.json({ 
        latitude: lat, 
        longitude: lng,
        motorista_nome: motorista.nome,
        ultima_atualizacao: motorista.ultima_atualizacao_gps || new Date()
      });
    } catch(error) {
      next(error);
    }
  },

  async obterGastosCliente(req, res, next) {
    try {
      let cpf_cnpj;

      if (req.user && req.user.role === 'cliente' && req.user.cliente_id) {
        const cliente = await db('clientes').where({ id: req.user.cliente_id }).first();
        if (!cliente) {
          return res.status(404).json({ erro: 'Cliente não encontrado' });
        }
        cpf_cnpj = cliente.cpf_cnpj;
      } else if (req.user && req.user.role === 'admin') {
        // Admin pode ver gastos de qualquer cliente
        cpf_cnpj = req.query.cpf_cnpj;
        if (!cpf_cnpj) {
          return res.status(400).json({ erro: 'CPF/CNPJ é obrigatório para admin' });
        }
      } else {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const solicitacoes = await db('solicitacoes')
        .where({ cpf_cnpj })
        .whereIn('status', ['ACEITO'])
        .select('*');

      const totalGasto = solicitacoes.reduce((acc, sol) => acc + parseFloat(sol.preco || 0), 0);
      const totalPedidos = solicitacoes.length;

      return res.json({
        cpf_cnpj,
        totalGasto: parseFloat(totalGasto.toFixed(2)),
        totalPedidos,
        solicitacoes: solicitacoes.map(sol => ({
          id: sol.id,
          tamanho: sol.tamanho,
          preco: parseFloat(sol.preco || 0),
          data_agendada: sol.data_agendada,
          status: sol.status
        }))
      });
    } catch (error) {
      next(error);
    }
  }
}
