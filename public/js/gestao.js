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
  'ATIVO': 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  'INATIVO': 'bg-slate-100 text-slate-700 ring-slate-600/20',
  'DISPONIVEL': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  'ENTREGUE': 'bg-amber-50 text-amber-700 ring-amber-600/20',
  'FINALIZADA': 'bg-teal-50 text-teal-700 ring-teal-600/20',
  'PLANEJADA': 'bg-blue-50 text-blue-700 ring-blue-600/20'
};

const el = (id) => document.getElementById(id);

let tipoAtual = 'usuarios';

// Elementos
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

// Inicializa tabs visuais
function updateTabsUI(selectedBtn) {
  botoesTipo.forEach((b) => {
    b.className = "tipo-btn flex-1 min-w-[120px] px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 text-slate-500 hover:text-slate-700 hover:bg-slate-50/80";
  });
  selectedBtn.className = "tipo-btn flex-1 min-w-[120px] px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 bg-white text-indigo-600 shadow-sm ring-1 ring-slate-900/5 group scale-105 transform z-10";
}

// Eventos de tipo
botoesTipo.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipoAtual = btn.dataset.tipo;
    updateTabsUI(btn);
    btnCadastrar.disabled = false;
    carregarLista(true);
  });
});

// Show first tab on load
setTimeout(() => {
  const firstBtn = document.querySelector('[data-tipo="usuarios"]');
  updateTabsUI(firstBtn);
  btnCadastrar.disabled = false;
  carregarLista(true);
}, 100);

// Modal
function abrirModal() {
  const campos = CAMPOS[tipoAtual];
  let html = "";
  campos.forEach((campo) => {
    html += `
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-1.5">${campo.label}</label>`;
    
    if (campo.type === "select") {
      html += `
        <div class="relative">
          <select
            name="${campo.name}"
            class="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 shadow-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 appearance-none transition-all cursor-pointer"
            ${campo.required ? "required" : ""}
          >`;
      campo.options.forEach(opt => {
        html += `<option value="${opt}">${opt}</option>`;
      });
      html += `</select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>`;
    } else {
      html += `
        <input
          type="${campo.type}"
          name="${campo.name}"
          class="w-full px-4 py-3 rounded-xl text-sm text-slate-700 border border-slate-200 shadow-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
          placeholder="Insira ${campo.label.toLowerCase()}"
          ${campo.required ? "required" : ""}
        />`;
    }
    html += `</div>`;
  });
  document.getElementById("modal-campos").innerHTML = html;
  document.getElementById("modal-titulo").textContent = `Cadastrar ${tipoAtual.charAt(0).toUpperCase() + tipoAtual.slice(1)}`;
  
  modal.classList.remove("hidden");
  // Animate modal entry
  setTimeout(() => {
    modal.classList.remove("opacity-0");
    modalInner.classList.remove("scale-95", "opacity-0");
  }, 10);
}

function fecharModal() {
  // Animate modal exit
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

// Enviar formulário
modalForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(modalForm);
  const dados = Object.fromEntries(formData.entries());
  
  btnSalvar.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Salvando...`;
  btnSalvar.disabled = true;

  const showMessage = (msg, isSuccess) => {
    const colors = isSuccess ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100';
    const icon = isSuccess 
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>';
    
    modalAlerta.innerHTML = `
      <div class="p-4 rounded-xl text-sm border ${colors} flex items-center gap-3">
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">${icon}</svg>
        <span class="font-medium">${msg}</span>
      </div>`;
  };

  try {
    const res = await fetch("/api/" + tipoAtual, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const data = await res.json();

    if (res.ok) {
      showMessage(data.mensagem, true);
      setTimeout(() => {
        fecharModal();
        carregarLista();
      }, 1500);
    } else {
      showMessage(data.erro, false);
    }
  } catch (e) {
    showMessage('Erro ao conectar com o serviço.', false);
  } finally {
    btnSalvar.innerHTML = 'Salvar Registo';
    btnSalvar.disabled = false;
  }
});

// Carregar lista
async function carregarLista(showLoading = false) {
  if (showLoading) {
    listaConteudo.innerHTML = `
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
        <span class="text-indigo-600 font-medium tracking-wide text-sm">Atualizando dados...</span>
      </div>`;
  }
  
  try {
    const res = await fetch("/api/" + tipoAtual);
    const dados = await res.json();
    const nomeAmigavel = tipoAtual.charAt(0).toUpperCase() + tipoAtual.slice(1);
    
    titutoLista.innerHTML = `${nomeAmigavel} <span class="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full ml-3 align-middle">${dados.length || 0}</span>`;

    if (!dados || dados.length === 0) {
      listaConteudo.innerHTML = `
        <div class="flex flex-col items-center justify-center p-12 opacity-50">
          <svg class="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          <p class="text-slate-500 font-medium text-lg">Nenhum registro encontrado</p>
          <p class="text-slate-400 text-sm mt-1">Clique em "Cadastrar Novo" para adicionar o primeiro.</p>
        </div>`;
      return;
    }

    const colunas = Object.keys(dados[0]);
    let html = '<table class="w-full text-left whitespace-nowrap"><thead><tr>';
    
    colunas.forEach((col) => {
      const nomesAmigaveis = {
        'created_at': 'Criado Em',
        'updated_at': 'Atualizado Em',
        'motorista_id': 'Cód Motorista',
        'cpf_cnpj': 'CPF / CNPJ'
      };
      const nomeExibicao = nomesAmigaveis[col] || col.replace('_', ' ');
      html += '<th class="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200/60 bg-slate-50/50">' + nomeExibicao + "</th>";
    });
    html += "</tr></thead><tbody class='divide-y divide-slate-100/80'>";

    dados.forEach((row) => {
      html += '<tr class="hover:bg-indigo-50/30 transition-colors duration-150 group">';
      colunas.forEach((col, i) => {
        const isFirst = i === 0;
        let content = row[col] || "-";
        
        if (col.toLowerCase().includes('status')) {
          const colorMap = {
            'ATIVO': 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
            'INATIVO': 'bg-slate-100 text-slate-700 ring-slate-600/20',
            'DISPONIVEL': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
            'ENTREGUE': 'bg-amber-50 text-amber-700 ring-amber-600/20',
            'FINALIZADA': 'bg-teal-50 text-teal-700 ring-teal-600/20',
            'PLANEJADA': 'bg-blue-50 text-blue-700 ring-blue-600/20'
          };
          const classes = colorMap[content] || 'bg-slate-100 text-slate-600 ring-slate-500/10';
          content = `<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${classes}">${content}</span>`;
        } else if (content && (col === 'created_at' || col === 'updated_at' || col === 'data')) {
           const dateObj = new Date(content);
           if (!isNaN(dateObj)) {
             content = dateObj.toLocaleDateString('pt-BR', {
               day: '2-digit', month: '2-digit', year: 'numeric',
               hour: col !== 'data' ? '2-digit' : undefined,
               minute: col !== 'data' ? '2-digit' : undefined
             });
           }
        }

        html += `<td class="px-6 py-4 text-sm ${isFirst ? 'font-semibold text-slate-900' : 'text-slate-600 font-medium'}">${content}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";
    listaConteudo.innerHTML = html;
  } catch (e) {
    listaConteudo.innerHTML = `
      <div class="flex items-center justify-center p-8">
        <div class="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl border border-rose-100 flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span class="font-medium">Erro ao carregar os dados.</span>
        </div>
      </div>`;
  }
}

// Fechar modal ao clicar fora
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});
