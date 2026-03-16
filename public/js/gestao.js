const CAMPOS = {
  usuarios: [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "senha", label: "Senha", type: "password", required: true },
  ],
  veiculos: [
    { name: "placa", label: "Placa", type: "text", required: true },
    { name: "capacidade", label: "Capacidade (m³)", type: "number", required: true },
  ],
  motoristas: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "status", label: "Status", type: "select", options: ["ATIVO", "INATIVO"], required: true },
  ],
  clientes: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "cpf_cnpj", label: "CPF/CNPJ", type: "text", required: true },
    { name: "endereco", label: "Endereço", type: "text", required: true },
  ],
  cacambas: [
    { name: "tamanho", label: "Tamanho", type: "select", options: ["GRANDE", "MEDIO"], required: true },
    { name: "status", label: "Status", type: "select", options: ["DISPONIVEL", "ENTREGUE", "EM_MANUTENCAO", "RESERVADA"], required: true },
  ],
  rotas: [
    { name: "data", label: "Data", type: "date", required: true },
    { name: "motorista_id", label: "ID do Motorista", type: "number", required: true },
    { name: "status", label: "Status", type: "select", options: ["PLANEJADA", "EM_EXECUCAO", "FINALIZADA"], required: true },
  ],
};

const STATUS_COLORS = {
  ATIVO: "bg-zinc-800 text-emerald-400 ring-emerald-500/30",
  INATIVO: "bg-zinc-800 text-zinc-400 ring-zinc-500/30",
  DISPONIVEL: "bg-zinc-800 text-blue-400 ring-blue-500/30",
  ENTREGUE: "bg-zinc-800 text-orange-400 ring-orange-500/30",
  EM_MANUTENCAO: "bg-zinc-800 text-yellow-400 ring-yellow-500/30",
  RESERVADA: "bg-zinc-800 text-purple-400 ring-purple-500/30",
  PLANEJADA: "bg-zinc-800 text-indigo-400 ring-indigo-500/30",
  EM_EXECUCAO: "bg-zinc-800 text-cyan-400 ring-cyan-500/30",
  FINALIZADA: "bg-zinc-800 text-teal-400 ring-teal-500/30"
};

const botoesTipo = document.querySelectorAll(".tipo-btn");
const btnCadastrar = document.getElementById("btn-cadastrar");
const modal = document.getElementById("modal");
const modalInner = document.getElementById("modal-inner");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const btnCancelarModal = document.getElementById("btn-cancelar-modal");
const modalForm = document.getElementById("modal-form");
const listaConteudo = document.getElementById("lista-conteudo");
const titutoLista = document.getElementById("titulo-lista");
const modalAlerta = document.getElementById("modal-alerta");
const btnSalvar = document.getElementById("btn-salvar-modal");

let tipoAtual = "usuarios";

function updateTabsUI(selectedBtn) {
  botoesTipo.forEach((b) => {
    b.className = "tipo-btn flex-1 min-w-[120px] px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50";
  });

  selectedBtn.className = "tipo-btn flex-1 min-w-[120px] px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-zinc-800 text-white shadow-lg ring-1 ring-zinc-700 scale-105 transform z-10";
}

botoesTipo.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipoAtual = btn.dataset.tipo;
    updateTabsUI(btn);
    titutoLista.textContent = tipoAtual.charAt(0).toUpperCase() + tipoAtual.slice(1);
    carregarLista(true);
  });
});

function abrirModal() {
  const campos = CAMPOS[tipoAtual];
  const modalCampos = document.getElementById("modal-campos");
  modalCampos.innerHTML = "";

  const fieldTemplate = document.getElementById("form-field-template");
  const selectTemplate = document.getElementById("form-select-template");
  const inputTemplate = document.getElementById("form-input-template");

  campos.forEach((campo) => {
    const fieldClone = fieldTemplate.content.cloneNode(true);
    fieldClone.querySelector(".field-label").textContent = campo.label;
    const container = fieldClone.querySelector(".field-container");

    if (campo.type === "select") {
      const selectClone = selectTemplate.content.cloneNode(true);
      const selectObj = selectClone.querySelector("select");
      selectObj.name = campo.name;
      campo.options.forEach((opt) => {
        const option = document.createElement("option");
        option.value = opt;
        option.textContent = opt;
        selectObj.appendChild(option);
      });
      container.appendChild(selectClone);
    } else {
      const inputClone = inputTemplate.content.cloneNode(true);
      const inputObj = inputClone.querySelector("input");
      inputObj.type = campo.type;
      inputObj.name = campo.name;
      inputObj.placeholder = `Insira ${campo.label.toLowerCase()}`;
      if (campo.required) inputObj.required = true;
      container.appendChild(inputClone);
    }
    modalCampos.appendChild(fieldClone);
  });

  document.getElementById("modal-titulo").textContent = `Cadastrar ${tipoAtual}`;
  modal.classList.remove("hidden");
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modalInner.classList.remove("scale-95", "opacity-0");
  }, 10);
}

function fecharModal() {
  modal.classList.add("opacity-0");
  modalInner.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("hidden");
    modalForm.reset();
    modalAlerta.innerHTML = "";
  }, 300);
}

btnCadastrar.addEventListener("click", abrirModal);
btnFecharModal.addEventListener("click", fecharModal);
btnCancelarModal.addEventListener("click", fecharModal);

modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(modalForm);
  const dados = Object.fromEntries(formData.entries());

  btnSalvar.innerHTML = "Salvando...";
  btnSalvar.disabled = true;

  try {
    const res = await fetch("/api/" + tipoAtual, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (res.ok) {
      modalAlerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">Salvo com sucesso</div>';
      setTimeout(() => { fecharModal(); carregarLista(); }, 1200);
    } else {
      modalAlerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400">Erro ao salvar</div>';
    }
  } catch {
    modalAlerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400">Erro de conexão</div>';
  }

  btnSalvar.innerHTML = "Salvar Registro";
  btnSalvar.disabled = false;
});

async function carregarLista(showLoading = false) {
  if (showLoading) {
    listaConteudo.innerHTML = '<div class="text-zinc-500 py-12 text-center animate-pulse">Carregando...</div>';
  }

  try {
    const res = await fetch("/api/" + tipoAtual);
    const dados = await res.json();
    listaConteudo.innerHTML = "";

    if (!dados || dados.length === 0) {
      listaConteudo.innerHTML = '<div class="text-zinc-600 py-12 text-center">Nenhum registro encontrado</div>';
      return;
    }

    const table = document.createElement("table");
    table.className = "w-full text-left border-collapse";
    const colunas = Object.keys(dados[0]);

    let theadHTML = `<thead class="bg-zinc-800/50 border-b border-zinc-800"><tr>`;
    colunas.forEach(col => {
      theadHTML += `<th class="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">${col.replace("_", " ")}</th>`;
    });
    theadHTML += `</tr></thead>`;
    
    let tbodyHTML = `<tbody class="divide-y divide-zinc-800">`;
    dados.forEach(row => {
      tbodyHTML += `<tr class="hover:bg-zinc-800/30 transition-colors">`;
      colunas.forEach(col => {
        let content = row[col] || "-";
        if (col.toLowerCase().includes("status")) {
          const classes = STATUS_COLORS[content] || "bg-zinc-800 text-zinc-400 ring-zinc-700/50";
          tbodyHTML += `<td class="px-6 py-4"><span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}">${content}</span></td>`;
        } else {
          tbodyHTML += `<td class="px-6 py-4 text-sm text-zinc-300">${content}</td>`;
        }
      });
      tbodyHTML += `</tr>`;
    });
    tbodyHTML += `</tbody>`;

    table.innerHTML = theadHTML + tbodyHTML;
    listaConteudo.appendChild(table);
  } catch {
    listaConteudo.innerHTML = '<div class="text-rose-400 py-12 text-center">Erro ao carregar dados da API</div>';
  }
}

window.addEventListener('load', () => {
    const firstBtn = document.querySelector('[data-tipo="usuarios"]');
    if(firstBtn) {
        updateTabsUI(firstBtn);
        titutoLista.textContent = "Usuários";
        carregarLista(true);
    }
});