const db = require('../database/db');

module.exports = {
  async relatorioFinanceiro(req, res, next) {
    try {
      // Apenas admin pode acessar
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { dataInicio, dataFim } = req.query;

      let query = db('solicitacoes').whereIn('status', ['ACEITO']);

      if (dataInicio) {
        query = query.where('data_agendada', '>=', dataInicio);
      }

      if (dataFim) {
        query = query.where('data_agendada', '<=', dataFim);
      }

      const solicitacoes = await query.select('*');

      const totalReceita = solicitacoes.reduce((acc, sol) => acc + parseFloat(sol.preco || 0), 0);
      const totalPedidos = solicitacoes.length;

      // Agrupar por tamanho
      const porTamanho = {
        MEDIO: 0,
        GRANDE: 0
      };

      const precosPorTamanho = {
        MEDIO: 0,
        GRANDE: 0
      };

      solicitacoes.forEach(sol => {
        porTamanho[sol.tamanho] = (porTamanho[sol.tamanho] || 0) + 1;
        precosPorTamanho[sol.tamanho] = precosPorTamanho[sol.tamanho] + parseFloat(sol.preco || 0);
      });

      return res.json({
        periodo: {
          inicio: dataInicio || 'Sem limite',
          fim: dataFim || 'Sem limite'
        },
        resumo: {
          totalPedidos,
          totalReceita: parseFloat(totalReceita.toFixed(2)),
          recebitaMedio: totalPedidos > 0 ? parseFloat((totalReceita / totalPedidos).toFixed(2)) : 0
        },
        porTamanho: {
          MEDIO: {
            quantidade: porTamanho.MEDIO,
            receita: parseFloat(precosPorTamanho.MEDIO.toFixed(2))
          },
          GRANDE: {
            quantidade: porTamanho.GRANDE,
            receita: parseFloat(precosPorTamanho.GRANDE.toFixed(2))
          }
        },
        solicitacoes: solicitacoes.map(sol => ({
          id: sol.id,
          nome: sol.nome,
          cpf_cnpj: sol.cpf_cnpj,
          tamanho: sol.tamanho,
          preco: parseFloat(sol.preco || 0),
          data_agendada: sol.data_agendada,
          status: sol.status
        }))
      });
    } catch (error) {
      next(error);
    }
  },

  async relatorioClientesMaiorGasto(req, res, next) {
    try {
      // Apenas admin pode acessar
      if (req.user.role !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const { limite = 10 } = req.query;

      const solicitacoes = await db('solicitacoes')
        .whereIn('status', ['ACEITO'])
        .select('*');

      // Agrupar por cliente
      const clienteGastos = {};
      solicitacoes.forEach(sol => {
        if (!clienteGastos[sol.cpf_cnpj]) {
          clienteGastos[sol.cpf_cnpj] = {
            cpf_cnpj: sol.cpf_cnpj,
            nome: sol.nome,
            totalGasto: 0,
            totalPedidos: 0,
            detalhes: []
          };
        }
        clienteGastos[sol.cpf_cnpj].totalGasto += parseFloat(sol.preco || 0);
        clienteGastos[sol.cpf_cnpj].totalPedidos += 1;
        clienteGastos[sol.cpf_cnpj].detalhes.push({
          id: sol.id,
          tamanho: sol.tamanho,
          preco: parseFloat(sol.preco || 0),
          data_agendada: sol.data_agendada
        });
      });

      // Converter para array e ordenar por totalGasto
      const clientes = Object.values(clienteGastos)
        .map(c => ({
          ...c,
          totalGasto: parseFloat(c.totalGasto.toFixed(2)),
          gastoMedio: parseFloat((c.totalGasto / c.totalPedidos).toFixed(2))
        }))
        .sort((a, b) => b.totalGasto - a.totalGasto)
        .slice(0, parseInt(limite));

      const totalGeralReceita = clientes.reduce((acc, c) => acc + c.totalGasto, 0);

      return res.json({
        totalClientes: clientes.length,
        totalReceitaGeral: parseFloat(totalGeralReceita.toFixed(2)),
        clientes
      });
    } catch (error) {
      next(error);
    }
  }
};
