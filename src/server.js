require("dotenv").config();
const express = require("express");
const path = require("path");
const knex = require("knex")(require("../knexfile").development);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));

// ============================================
// ROTAS DE PÁGINAS HTML
// ============================================

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

app.get("/tarefas", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gestao-tarefas.html"));
});

app.get("/cacambas-veiculos", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cacambas-veiculos.html"));
});

app.get("/cadastro/cliente", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro-clientes.html"));
});

app.get("/cadastro/cacamba", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro-cacambas.html"));
});

app.get("/cadastro/veiculo", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro-veiculos.html"));
});

app.get("/cadastro/motorista", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "cadastro-motoristas.html"));
});

// ============================================
// API - CLIENTES
// ============================================

app.post("/api/clientes", async (req, res) => {
  try {
    const { nome, cpf_cnpj, endereco } = req.body;

    await knex("clientes").insert({
      nome,
      cpf_cnpj,
      endereco
    });

    res.status(201).json({ message: "Cliente criado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await knex("clientes");
    res.json(clientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

app.get("/api/clientes/:id", async (req, res) => {
  try {
    const cliente = await knex("clientes").where("id", req.params.id).first();
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
    res.json(cliente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar cliente" });
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  try {
    const { nome, cpf_cnpj, endereco } = req.body;
    await knex("clientes").where("id", req.params.id).update({
      nome,
      cpf_cnpj,
      endereco
    });
    res.json({ message: "Cliente atualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar cliente" });
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  try {
    await knex("clientes").where("id", req.params.id).delete();
    res.json({ message: "Cliente deletado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar cliente" });
  }
});

// ============================================
// API - MOTORISTAS
// ============================================

app.post("/api/motoristas", async (req, res) => {
  try {
    const { nome, status } = req.body;
    await knex("motoristas").insert({ nome, status: status || "ATIVO" });
    res.status(201).json({ message: "Motorista criado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar motorista" });
  }
});

app.get("/api/motoristas", async (req, res) => {
  try {
    const motoristas = await knex("motoristas");
    res.json(motoristas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar motoristas" });
  }
});

app.get("/api/motoristas/:id", async (req, res) => {
  try {
    const motorista = await knex("motoristas").where("id", req.params.id).first();
    if (!motorista) return res.status(404).json({ error: "Motorista não encontrado" });
    res.json(motorista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar motorista" });
  }
});

app.put("/api/motoristas/:id", async (req, res) => {
  try {
    const { nome, status } = req.body;
    await knex("motoristas").where("id", req.params.id).update({ nome, status });
    res.json({ message: "Motorista atualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar motorista" });
  }
});

app.delete("/api/motoristas/:id", async (req, res) => {
  try {
    await knex("motoristas").where("id", req.params.id).delete();
    res.json({ message: "Motorista deletado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar motorista" });
  }
});

// ============================================
// API - VEÍCULOS
// ============================================

app.post("/api/veiculos", async (req, res) => {
  try {
    const { placa, capacidade } = req.body;
    await knex("veiculos").insert({ placa, capacidade });
    res.status(201).json({ message: "Veículo criado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar veículo" });
  }
});

app.get("/api/veiculos", async (req, res) => {
  try {
    const veiculos = await knex("veiculos");
    res.json(veiculos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar veículos" });
  }
});

app.get("/api/veiculos/:id", async (req, res) => {
  try {
    const veiculo = await knex("veiculos").where("id", req.params.id).first();
    if (!veiculo) return res.status(404).json({ error: "Veículo não encontrado" });
    res.json(veiculo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar veículo" });
  }
});

app.put("/api/veiculos/:id", async (req, res) => {
  try {
    const { placa, capacidade } = req.body;
    await knex("veiculos").where("id", req.params.id).update({ placa, capacidade });
    res.json({ message: "Veículo atualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar veículo" });
  }
});

app.delete("/api/veiculos/:id", async (req, res) => {
  try {
    await knex("veiculos").where("id", req.params.id).delete();
    res.json({ message: "Veículo deletado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar veículo" });
  }
});

// ============================================
// API - CAÇAMBAS
// ============================================

app.post("/api/cacambas", async (req, res) => {
  try {
    const { tamanho, status } = req.body;
    await knex("cacambas").insert({ tamanho, status: status || "DISPONIVEL" });
    res.status(201).json({ message: "Caçamba criada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar caçamba" });
  }
});

app.get("/api/cacambas", async (req, res) => {
  try {
    const cacambas = await knex("cacambas");
    res.json(cacambas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar caçambas" });
  }
});

app.get("/api/cacambas/:id", async (req, res) => {
  try {
    const cacamba = await knex("cacambas").where("id", req.params.id).first();
    if (!cacamba) return res.status(404).json({ error: "Caçamba não encontrada" });
    res.json(cacamba);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar caçamba" });
  }
});

app.put("/api/cacambas/:id", async (req, res) => {
  try {
    const { tamanho, status } = req.body;
    await knex("cacambas").where("id", req.params.id).update({ tamanho, status });
    res.json({ message: "Caçamba atualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar caçamba" });
  }
});

app.delete("/api/cacambas/:id", async (req, res) => {
  try {
    await knex("cacambas").where("id", req.params.id).delete();
    res.json({ message: "Caçamba deletada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar caçamba" });
  }
});

app.get("/api/cacambas/manutencao", async (req, res) => {
  try {
    const cacambas = await knex("cacambas").where("status", "EM_MANUTENCAO");
    res.json(cacambas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar caçambas" });
  }
});

// ============================================
// API - TAREFAS
// ============================================

app.post("/api/tarefas", async (req, res) => {
  try {
    const { tipo, cacamba_id, cliente_id, motorista_id, veiculo_id, endereco_execucao, data_agendada, status, justificativa } = req.body;

    await knex("tarefas").insert({
      tipo,
      cacamba_id,
      cliente_id,
      motorista_id,
      veiculo_id,
      endereco_execucao,
      data_agendada,
      status: status || "EM_ANDAMENTO",
      justificativa
    });

    res.status(201).json({ message: "Tarefa criada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao criar tarefa" });
  }
});

app.get("/api/tarefas", async (req, res) => {
  try {
    const tarefas = await knex("tarefas")
      .join("clientes", "tarefas.cliente_id", "clientes.id")
      .join("motoristas", "tarefas.motorista_id", "motoristas.id")
      .select(
        "tarefas.*",
        "clientes.nome as cliente_nome",
        "motoristas.nome as motorista_nome"
      );
    res.json(tarefas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

app.get("/api/tarefas/:id", async (req, res) => {
  try {
    const tarefa = await knex("tarefas").where("id", req.params.id).first();
    if (!tarefa) return res.status(404).json({ error: "Tarefa não encontrada" });
    res.json(tarefa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
});

app.put("/api/tarefas/:id", async (req, res) => {
  try {
    const { tipo, cacamba_id, cliente_id, motorista_id, veiculo_id, endereco_execucao, data_agendada, status, justificativa } = req.body;

    await knex("tarefas").where("id", req.params.id).update({
      tipo,
      cacamba_id,
      cliente_id,
      motorista_id,
      veiculo_id,
      endereco_execucao,
      data_agendada,
      status,
      justificativa
    });

    res.json({ message: "Tarefa atualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
});

app.delete("/api/tarefas/:id", async (req, res) => {
  try {
    await knex("tarefas").where("id", req.params.id).delete();
    res.json({ message: "Tarefa deletada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao deletar tarefa" });
  }
});

app.get("/api/tarefas/pendentes", async (req, res) => {
  try {
    const tarefas = await knex("tarefas")
      .join("clientes", "tarefas.cliente_id", "clientes.id")
      .join("motoristas", "tarefas.motorista_id", "motoristas.id")
      .whereIn("tarefas.status", ["EM_ANDAMENTO"])
      .select(
        "tarefas.*",
        "clientes.nome as cliente_nome",
        "motoristas.nome as motorista_nome"
      );
    res.json(tarefas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar tarefas" });
  }
});

// ============================================
// API - DASHBOARD (ESTATÍSTICAS)
// ============================================

app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const hoje = new Date().toISOString().split('T')[0];

    // Tarefas hoje
    const tarefasHoje = await knex("tarefas")
      .whereRaw(`DATE(data_agendada) = ?`, [hoje])
      .count("* as total")
      .first();

    // Entregas pendentes
    const entregasPendentes = await knex("tarefas")
      .where("tipo", "ENTREGA")
      .whereIn("status", ["EM_ANDAMENTO"])
      .count("* as total")
      .first();

    // Coletas pendentes
    const coletasPendentes = await knex("tarefas")
      .where("tipo", "COLETA")
      .whereIn("status", ["EM_ANDAMENTO"])
      .count("* as total")
      .first();

    // Tarefas finalizadas
    const tarefasFinalizadas = await knex("tarefas")
      .whereIn("status", ["ENTREGUE", "COLETADO"])
      .count("* as total")
      .first();

    // Caçambas entregues
    const cacambasEntregues = await knex("cacambas")
      .where("status", "ENTREGUE")
      .count("* as total")
      .first();

    // Caçambas em manutenção
    const cacambasManutencao = await knex("cacambas")
      .where("status", "EM_MANUTENCAO")
      .count("* as total")
      .first();

    res.json({
      tarefasHoje: tarefasHoje.total || 0,
      entregasPendentes: entregasPendentes.total || 0,
      coletasPendentes: coletasPendentes.total || 0,
      tarefasFinalizadas: tarefasFinalizadas.total || 0,
      cacambasEntregues: cacambasEntregues.total || 0,
      cacambasManutencao: cacambasManutencao.total || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

// ============================================
// SERVIDOR
// ============================================

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Servidor rodando na porta " + (process.env.PORT || 3000));
});