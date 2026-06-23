

const STATUS_COLORS = {
  ATIVO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  INATIVO: "bg-slate-100 text-slate-500 ring-slate-200",
  DISPONIVEL: "bg-sky-50 text-sky-700 ring-sky-200",
  ENTREGUE: "bg-amber-50 text-amber-700 ring-amber-200",
  EM_MANUTENCAO: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  RESERVADA: "bg-purple-50 text-purple-700 ring-purple-200",
  PLANEJADA: "bg-sky-50 text-sky-700 ring-sky-200",
  EM_EXECUCAO: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  FINALIZADA: "bg-teal-50 text-teal-700 ring-teal-200",
  PENDENTE: "bg-orange-50 text-orange-700 ring-orange-200",
  ACEITO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJEITADO: "bg-red-50 text-red-700 ring-red-200"
};

const botoesTipo = document.querySelectorAll(".tipo-btn");
const btnCadastrar = document.getElementById("btn-cadastrar");
const modalContainer = document.getElementById("modal-container");
const listaConteudo = document.getElementById("lista-conteudo");
const titutoLista = document.getElementById("titulo-lista");

let tipoAtual = "usuarios";

function updateTabsUI(selectedBtn) {
  botoesTipo.forEach((b) => {
    b.className = "tipo-btn flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group text-slate-400 hover:text-white hover:bg-slate-800/50";
  });

  selectedBtn.className = "tipo-btn flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-md shadow-teal-500/20 transform scale-[1.02]";
}

botoesTipo.forEach((btn) => {
  btn.addEventListener("click", () => {
    tipoAtual = btn.dataset.tipo;
    updateTabsUI(btn);
    titutoLista.textContent = btn.innerText.trim().replace(/^[^\w\s]+/, '').trim() || (tipoAtual.charAt(0).toUpperCase() + tipoAtual.slice(1));
    
    if (tipoAtual === 'dashboard' || tipoAtual === 'relatorio-financeiro' || tipoAtual === 'clientes-gasto') {
      btnCadastrar.style.display = 'none';
    } else {
      btnCadastrar.style.display = 'flex';
    }
    
    carregarLista(true);
  });
});

async function abrirModal() {
  const originalText = btnCadastrar.innerHTML;
  btnCadastrar.innerHTML = `<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
  btnCadastrar.disabled = true;

  try {
    const res = await fetch("../components/" + tipoAtual.slice(0, -1) + "-modal.html");
    let html = await res.text();

    modalContainer.innerHTML = html;

    const modal = document.getElementById("modal");
    const modalInner = modal.querySelector('.max-w-md');
    const btnFechar = document.getElementById("btn-fechar-modal");
    const btnCancelar = document.getElementById("btn-cancelar-modal");
    const form = document.getElementById("modal-form");

    modal.classList.remove("hidden");

    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modalInner.classList.remove('scale-95', 'opacity-0');
      modalInner.classList.add('scale-100', 'opacity-100');
    }, 10);

    const closeModal = () => {
      modal.classList.add('opacity-0');
      modalInner.classList.remove('scale-100', 'opacity-100');
      modalInner.classList.add('scale-95', 'opacity-0');
      setTimeout(() => { modal.classList.add("hidden"); }, 300);
    };

    btnFechar.addEventListener("click", closeModal);
    btnCancelar.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const dados = Object.fromEntries(new FormData(form).entries());
      const alerta = document.getElementById("modal-alerta");
      const submitBtn = form.querySelector('button[type="submit"]');

      submitBtn.innerHTML = 'Salvando...';
      submitBtn.disabled = true;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch("/api/" + tipoAtual, {
          method: "POST", 
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }, 
          body: JSON.stringify(dados),
        });
        const data = await res.json();
        if (res.ok) {
          alerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-emerald-200 bg-emerald-50 text-emerald-700">Salvo com sucesso</div>';
          setTimeout(() => { closeModal(); carregarLista(); }, 1200);
        } else {
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm border border-red-200 bg-red-50 text-red-600">${data.erro || 'Erro ao salvar'}</div>`;
          submitBtn.innerHTML = 'Salvar';
          submitBtn.disabled = false;
        }
      } catch (e) {
        alerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-red-200 bg-red-50 text-red-600">Erro de conexão</div>';
        submitBtn.innerHTML = 'Salvar';
        submitBtn.disabled = false;
      }
    });

  } catch (err) {
    console.error("Modal load error", err);
  } finally {
    btnCadastrar.innerHTML = originalText;
    btnCadastrar.disabled = false;
  }
}

btnCadastrar.addEventListener("click", () => abrirModal());

async function carregarLista(showLoading = false) {
  if (showLoading) {
    listaConteudo.innerHTML = '<div class="text-slate-400 py-12 text-center animate-pulse">Carregando...</div>';
  }

  try {
    const token = localStorage.getItem('token');
    let url = "/api/" + tipoAtual;
    
    // Rotas especiais para relatórios
    if (tipoAtual === 'relatorio-financeiro') {
      url = "/api/relatorios/financeiro";
    } else if (tipoAtual === 'clientes-gasto') {
      url = "/api/relatorios/clientes-maior-gasto";
    }
    
    const res = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const dados = await res.json();
    listaConteudo.innerHTML = "";

    if (tipoAtual === 'dashboard') {
      return renderDashboard(dados);
    }
    
    if (tipoAtual === 'relatorio-financeiro') {
      return renderRelatorioFinanceiro(dados);
    }
    
    if (tipoAtual === 'clientes-gasto') {
      return renderClientesGasto(dados);
    }

    if (!dados || dados.length === 0) {
      listaConteudo.innerHTML = '<div class="text-slate-400 py-12 text-center">Nenhum registro encontrado</div>';
      return;
    }

    if (dados[0] && dados[0].id !== undefined) {
      dados.sort((a, b) => a.id - b.id);
    }

    if (tipoAtual === 'cacambas') return renderCacambas(dados);
    if (tipoAtual === 'rotas') return renderRotas(dados);
    if (tipoAtual === 'clientes') return renderClientes(dados);
    if (tipoAtual === 'tarefas') return renderTarefas(dados);
    if (tipoAtual === 'usuarios') return renderUsuarios(dados);
    if (tipoAtual === 'motoristas') return renderMotoristas(dados);
    if (tipoAtual === 'veiculos') return renderVeiculos(dados);
    if (tipoAtual === 'solicitacoes') return renderSolicitacoes(dados);

    renderizarTabelaGenerica(dados);
  } catch (err) {
    console.error(err);
    listaConteudo.innerHTML = '<div class="text-red-500 py-12 text-center">Erro ao carregar dados da API</div>';
  }
}

function renderizarTabelaGenerica(dados) {
  const table = document.createElement("table");
  table.className = "w-full text-left text-sm";
  const colunas = Object.keys(dados[0]);

  let theadHTML = `<thead class="text-xs uppercase text-slate-400 border-b border-slate-200"><tr class="table-header-row">`;
  colunas.forEach(col => {
    const nomes = { 'created_at': 'Criado Em', 'updated_at': 'Atualizado Em', 'motorista_id': 'Cód Motorista', 'cpf_cnpj': 'CPF / CNPJ' };
    theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">${nomes[col] || col.replace('_', ' ')}</th>`;
  });
  theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Ações</th></tr></thead>`;

  let tbodyHTML = `<tbody class="table-body divide-y divide-slate-100">`;
  dados.forEach(row => {
    tbodyHTML += `<tr class="hover:bg-slate-50 transition-colors duration-150 group">`;
    colunas.forEach((col, i) => {
      let content = row[col] || "-";
      if (col.toLowerCase().includes("status")) {
        const classes = STATUS_COLORS[content] || "bg-slate-100 text-slate-500 ring-slate-200";
        tbodyHTML += `<td class="px-4 py-3 text-sm"><span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}">${content}</span></td>`;
      } else {
        if (content && (col === 'created_at' || col === 'updated_at' || col === 'data')) {
          const d = new Date(content);
          if (!isNaN(d)) content = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        tbodyHTML += `<td class="px-4 py-3 text-sm ${i === 0 ? 'font-medium text-slate-800' : 'text-slate-600'}">${content}</td>`;
      }
    });
    tbodyHTML += `<td class="px-4 py-3 text-right"><button onclick="deleteItem(tipoAtual, ${row.id})" class="text-slate-400 hover:text-red-500" title="Excluir">🗑️</button></td></tr>`;
  });
  tbodyHTML += `</tbody>`;

  table.innerHTML = theadHTML + tbodyHTML;
  listaConteudo.appendChild(table);
}

function renderUsuarios(dados) {
  let listHtml = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">';
  dados.forEach(u => {
    let roleBadge = '';
    let roleBg = '';
    if (u.role === 'admin') { roleBadge = 'Admin'; roleBg = 'bg-purple-100 text-purple-700'; }
    else if (u.role === 'motorista') { roleBadge = 'Motorista'; roleBg = 'bg-emerald-100 text-emerald-700'; }
    else { roleBadge = 'Cliente'; roleBg = 'bg-sky-100 text-sky-700'; }

    listHtml += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
        <div class="flex items-start justify-between mb-6">
           <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-2xl uppercase shadow-inner">
             ${u.email.charAt(0)}
           </div>
           <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${roleBg}">
             ${roleBadge}
           </span>
        </div>
        <div>
           <h3 class="text-lg font-bold text-slate-800 break-all mb-1">${u.email}</h3>
           <p class="text-xs text-slate-400 uppercase tracking-widest font-semibold flex items-center gap-2">
             <span class="w-2 h-2 rounded-full bg-emerald-400"></span> Conta #${u.id}
           </p>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-100 flex justify-end">
           <button onclick="deleteItem('usuarios', ${u.id})" class="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-xl transition" title="Excluir Usuário">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      </div>
    `;
  });
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

function renderMotoristas(dados) {
  let listHtml = '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">';
  dados.forEach(m => {
    const statusColor = STATUS_COLORS[m.status] || "bg-slate-100 text-slate-500";
    listHtml += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-teal-300 transition duration-300 relative overflow-hidden group">
        <div class="absolute top-0 right-0 p-5 z-10">
           <span class="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor} shadow-sm">
             <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span> ${m.status || 'ATIVO'}
           </span>
        </div>
        
        <div class="w-16 h-16 bg-gradient-to-br from-slate-100 to-white border border-slate-200 rounded-2xl flex items-center justify-center mb-6 text-3xl shadow-inner relative">
          👷‍♂️
          <div class="absolute -bottom-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px]">✅</div>
        </div>
        
        <h3 class="text-xl font-bold text-slate-800 mb-1 tracking-tight">${m.nome}</h3>
        
        <div class="flex items-center gap-3 mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <div class="p-1.5 bg-white rounded shadow-sm text-xs">🪪</div>
           <div>
             <div class="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-0.5">Nº Registro CNH</div>
             <div class="font-mono tracking-wider font-semibold">${m.cnh || 'Não informada'}</div>
           </div>
        </div>
        
        <div class="mt-6 flex justify-between items-center pt-5 border-t border-slate-100">
           <span class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Cód. Motorista #${m.id}</span>
           <button onclick="deleteItem('motoristas', ${m.id})" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition" title="Demitir/Excluir">
             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      </div>
    `;
  });
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

function renderVeiculos(dados) {
  let listHtml = '<div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-2">';
  dados.forEach(v => {
    const statusColor = STATUS_COLORS[v.status] || "bg-slate-100 text-slate-500";
    listHtml += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-lg hover:-translate-y-1 transition duration-300">
        
        <!-- Placa Mercosul Fake -->
        <div class="flex flex-col items-center bg-white border-2 border-slate-800 rounded-xl overflow-hidden w-full max-w-[200px] shadow-sm">
           <div class="bg-[#003399] w-full text-center py-1 flex items-center justify-between px-3">
             <span class="text-[8px] font-bold text-white tracking-widest uppercase">Brasil</span>
             <div class="w-3 h-2 flex gap-[1px]">
               <div class="flex-1 bg-green-500"></div><div class="flex-1 bg-yellow-400"></div>
             </div>
           </div>
           <div class="py-3 px-4 text-3xl font-black font-mono tracking-widest text-slate-800 text-center w-full bg-slate-50">${v.placa}</div>
        </div>

        <div class="flex-1 w-full flex flex-col">
          <h3 class="text-xl font-bold text-slate-800 mb-1">${v.modelo || 'Caminhão Padrão'}</h3>
          
          <div class="flex items-center gap-3 mt-3 mb-5">
             <span class="bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-sky-100 flex items-center gap-2">
               ⚖️ Cap: ${v.capacidade || 'N/A'}
             </span>
             <span class="bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 font-mono">
               Frota #${v.id}
             </span>
          </div>
          
          <div class="mt-auto pt-5 border-t border-slate-100 flex justify-between items-center">
             <span class="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}">
               <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span> ${v.status || 'ATIVO'}
             </span>
             <button onclick="deleteItem('veiculos', ${v.id})" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition" title="Excluir Veículo">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>
        </div>
      </div>
    `;
  });
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

function renderCacambas(dados) {
  const counts = dados.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const totaisHtml = `
    <div class="flex flex-wrap gap-4 mb-8 pt-4 justify-between lg:justify-start">
      <div class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
         <span class="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-4">Total Inventário</span>
         <div class="flex items-end gap-3"><span class="text-5xl font-black text-slate-800 tracking-tighter">${dados.length}</span><span class="text-slate-400 mb-1">uni.</span></div>
      </div>
      <div class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
         <span class="text-sky-600 text-xs font-bold uppercase tracking-widest block mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span> Pátio Livre</span>
         <div class="flex items-end gap-3"><span class="text-4xl font-black text-slate-800 tracking-tighter">${counts['DISPONIVEL'] || 0}</span></div>
      </div>
      <div class="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
         <span class="text-amber-600 text-xs font-bold uppercase tracking-widest block mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Locadas</span>
         <div class="flex items-end gap-3"><span class="text-4xl font-black text-slate-800 tracking-tighter">${counts['ENTREGUE'] || 0}</span></div>
      </div>
    </div>
  `;

  let gridCards = '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">';
  dados.forEach(c => {
    let rawStatusColor = STATUS_COLORS[c.status] || "bg-slate-100 text-slate-500";
    let dotColor = 'bg-slate-400';
    if (c.status === 'DISPONIVEL') dotColor = 'bg-sky-500';
    if (c.status === 'ENTREGUE') dotColor = 'bg-amber-500';
    if (c.status === 'EM_MANUTENCAO') dotColor = 'bg-yellow-500';
    if (c.status === 'RESERVADA') dotColor = 'bg-purple-500';

    gridCards += `
      <div class="group bg-white border border-slate-200 hover:border-teal-300 rounded-3xl p-6 flex flex-col justify-between h-auto min-h-[180px] shadow-sm hover:shadow-lg hover:shadow-teal-50 transition duration-300 relative">
        <div class="flex justify-between items-start mb-6">
           <div class="bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-inner">
             <span class="text-slate-400 font-normal mr-1">#</span>${c.id}
           </div>
           <button onclick="deleteItem('cacambas', ${c.id})" class="text-slate-400 hover:text-red-500 p-1" title="Excluir">🗑️</button>
           <span class="w-3 h-3 rounded-full ${dotColor}" title="${c.status}"></span>
        </div>
        <div>
           <div class="text-2xl font-black text-slate-800 mb-1 tracking-tight uppercase">${c.tamanho}</div>
           <div class="text-[10px] uppercase font-bold tracking-widest mt-2 ${rawStatusColor.split(' ')[1]}">${c.status.replace('_', ' ')}</div>
        </div>
      </div>
    `;
  });
  gridCards += '</div>';

  listaConteudo.innerHTML = totaisHtml + gridCards;
}

function renderRotas(dados) {
  let listHtml = '<div class="flex flex-col gap-5 py-4">';
  
  dados.forEach(rota => {
    const d = new Date(rota.data);
    const dateStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') : rota.data;
    const statusClass = STATUS_COLORS[rota.status] || "bg-slate-100 text-slate-500";

    listHtml += `
      <div class="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-teal-300 hover:shadow-md transition-all w-full">
        <div class="flex items-center gap-5">
           <div class="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
              <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           </div>
           <div>
              <p class="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">Rota Operacional #${rota.id}</p>
              <h3 class="text-xl font-semibold text-slate-800 tracking-tight">${dateStr}</h3>
           </div>
        </div>

        <div class="flex-1 w-full md:w-auto md:px-8 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0">
           <p class="text-xs text-slate-400 uppercase tracking-widest mb-1.5 font-medium">Motorista Responsável</p>
           <p class="text-base text-slate-700 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              ${rota.motorista_nome || (rota.motorista_id ? 'Registro Cód. ' + rota.motorista_id : 'Não Definido')}
           </p>
        </div>

        <div class="flex flex-col md:flex-row items-end md:items-center gap-4">
           <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass}">
              <span class="w-2 h-2 rounded-full bg-current opacity-70 mr-2"></span>
              ${rota.status}
           </span>
           <button onclick="viewRouteMap(${rota.id})" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Ver Melhor Rota
          </button>
          <button onclick="deleteItem('rotas', ${rota.id})" class="bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 p-2 rounded-lg transition-colors" title="Excluir">🗑️</button>
        </div>
      </div>
    `;
  });
  
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

function renderClientes(dados) {
  let gridCards = '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">';
  
  dados.forEach(cliente => {
    gridCards += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 transition duration-300 w-full overflow-hidden relative group">
         <div class="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div class="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-teal-50 border border-teal-200 flex items-center justify-center text-2xl font-black text-teal-600 flex-shrink-0">
            ${cliente.nome ? cliente.nome.charAt(0).toUpperCase() : '?'}
         </div>
         <div class="flex-1 min-w-0">
            <h3 class="text-slate-800 font-bold text-xl mb-1 truncate" title="${cliente.nome}">${cliente.nome}</h3>
            <div class="flex flex-col gap-2 mt-4 text-sm">
              <div class="flex items-start gap-3 text-slate-500">
                 <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">📍</div>
                 <span class="break-words line-clamp-2">${cliente.endereco || 'Endereço não informado'}</span>
              </div>
              <div class="flex items-center gap-3 text-slate-400 mt-1">
                 <div class="w-8 h-8 flex items-center justify-center shrink-0 text-xs font-mono">DOC</div>
                 <span class="font-mono text-xs truncate break-all">${cliente.cpf_cnpj || 'Não registrado'}</span>
              </div>
            </div>
         </div>
      </div>
    `;
  });
  
  gridCards += '</div>';
  listaConteudo.innerHTML = gridCards;
}

function renderTarefas(dados) {
  const statusCols = {
    'EM_ANDAMENTO': { title: 'A Fazer (Andamento)', border: 'border-sky-200' },
    'ENTREGUE': { title: 'Entregue', border: 'border-amber-200' },
    'COLETADO': { title: 'Coletado', border: 'border-red-200' },
    'CANCELADO': { title: 'Cancelado', border: 'border-slate-200' },
    'JUSTIFICADO': { title: 'Justificado', border: 'border-purple-200' }
  };

  let kanbanHtml = '<div class="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px] p-2">';

  Object.keys(statusCols).forEach(statusKey => {
    const col = statusCols[statusKey];
    kanbanHtml += `
      <div class="flex flex-col min-w-[320px] max-w-[320px] bg-slate-50 border border-slate-200 rounded-2xl flex-shrink-0"
           ondragover="allowDrop(event)" ondrop="dropTask(event, '${statusKey}')">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 class="text-slate-800 font-bold tracking-wide">${col.title}</h3>
          <span class="bg-white text-slate-500 text-xs px-2 py-1 rounded-md font-bold border border-slate-200">${dados.filter(t => t.status === statusKey).length}</span>
        </div>
        <div class="p-3 flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]" id="col-${statusKey}">
    `;

    dados.filter(t => t.status === statusKey).forEach(tarefa => {
      const d = new Date(tarefa.data_agendada);
      const dateStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : tarefa.data_agendada;
      
      let icon = '';
      let textColor = '';
      if (tarefa.tipo === 'ENTREGA') { icon = '⬇️'; textColor = 'text-emerald-600'; }
      if (tarefa.tipo === 'COLETA') { icon = '⬆️'; textColor = 'text-red-500'; }
      if (tarefa.tipo === 'TROCA') { icon = '🔄'; textColor = 'text-sky-600'; }

      kanbanHtml += `
        <div id="task-${tarefa.id}" draggable="true" ondragstart="dragTask(event, ${tarefa.id})"
             class="bg-white border ${col.border} rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-teal-300 transition-colors shadow-sm group">
           <div class="flex justify-between items-start mb-3">
              <span class="text-[10px] font-bold ${textColor} tracking-widest uppercase flex items-center gap-1">${icon} ${tarefa.tipo}</span>
              <div class="flex gap-2">
                 <span class="text-slate-400 text-xs font-mono">#${tarefa.id}</span>
                 <button onclick="deleteItem('tarefas', ${tarefa.id})" class="text-slate-400 hover:text-red-500" title="Excluir">🗑️</button>
              </div>
           </div>
           <h4 class="text-slate-800 font-semibold text-sm mb-2 line-clamp-2">${tarefa.cliente_nome || 'Cliente não definido'}</h4>
           <div class="flex items-start gap-2 mb-3">
             <span class="text-slate-500 text-xs line-clamp-2 flex-1">📍 ${tarefa.endereco_execucao || 'Endereço não informado'}</span>
             <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tarefa.endereco_execucao || '')}" target="_blank" title="Abrir no Google Maps" 
                class="opacity-0 group-hover:opacity-100 p-1.5 bg-slate-100 hover:bg-teal-600 rounded-lg text-slate-400 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             </a>
           </div>
           <div class="flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>Caçamba: #${tarefa.cacamba_id}</span>
              <span>${dateStr}</span>
           </div>
        </div>
      `;
    });

    kanbanHtml += `
        </div>
      </div>
    `;
  });

  kanbanHtml += '</div>';
  listaConteudo.innerHTML = kanbanHtml;
}

function renderDashboard(dados) {
  const totais = dados.totais || {};
  const recentes = dados.atividadesRecentes || [];

  let html = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div class="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-teal-500/30">
        <span class="text-teal-100 text-xs font-bold uppercase tracking-widest block mb-2">Caçambas Locadas</span>
        <div class="flex items-end gap-3"><span class="text-5xl font-black">${totais.cacambasLocadas || 0}</span><span class="text-teal-200 mb-1">/ ${totais.cacambas || 0}</span></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <span class="text-slate-400 text-xs font-bold uppercase tracking-widest block mb-2">Clientes Ativos</span>
        <div class="flex items-end gap-3"><span class="text-5xl font-black text-slate-800">${totais.clientes || 0}</span></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <span class="text-amber-500 text-xs font-bold uppercase tracking-widest block mb-2">Tarefas Pendentes</span>
        <div class="flex items-end gap-3"><span class="text-5xl font-black text-slate-800">${totais.tarefasPendentes || 0}</span><span class="text-slate-400 mb-1">/ ${totais.tarefas || 0}</span></div>
      </div>
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <span class="text-sky-500 text-xs font-bold uppercase tracking-widest block mb-2">Usuários / Staff</span>
        <div class="flex items-end gap-3"><span class="text-5xl font-black text-slate-800">${totais.usuarios || 0}</span><span class="text-slate-400 mb-1">contas</span></div>
      </div>
    </div>

    <div class="px-6 pb-6">
      <h3 class="text-lg font-bold text-slate-800 mb-4 tracking-tight">Atividades Recentes do Site</h3>
      <div class="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
  `;

  if (recentes.length === 0) {
    html += '<div class="p-6 text-center text-slate-400 text-sm">Nenhuma solicitação recente.</div>';
  } else {
    recentes.forEach(r => {
      const d = new Date(r.created_at);
      const dataStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') : '-';
      html += `
        <div class="p-4 flex items-center justify-between hover:bg-white transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-teal-600 font-bold">#${r.id}</div>
            <div>
              <p class="text-sm font-bold text-slate-800">${r.nome}</p>
              <p class="text-xs text-slate-500 line-clamp-1">${r.endereco}</p>
            </div>
          </div>
          <div class="text-right flex items-center gap-4">
            <div class="flex flex-col items-end">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 uppercase ${STATUS_COLORS[r.status] || ''}">${r.status || 'NOVO'}</span>
              <p class="text-[10px] text-slate-400 mt-1">${dataStr}</p>
            </div>
            ${r.status === 'PENDENTE' ? `
              <div class="flex gap-2 shrink-0">
                <button onclick="abrirModalAprovacao(${r.id})" class="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3 rounded-xl transition shadow-sm">Aceitar</button>
                <button onclick="atualizarStatusSolicitacao(${r.id}, 'REJEITADO')" class="text-xs bg-red-100 hover:bg-red-200 text-red-600 font-bold py-1.5 px-3 rounded-xl transition">Rejeitar</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
  }

  html += `
      </div>
    </div>
  `;

  listaConteudo.innerHTML = html;
}

window.addEventListener('load', () => {
  const firstBtn = document.querySelector('[data-tipo="dashboard"]');
  if (firstBtn) {
    updateTabsUI(firstBtn);
    titutoLista.textContent = "Visão Geral";
    tipoAtual = "dashboard";
    btnCadastrar.style.display = 'none';
    carregarLista(true);
  }
});

// Drag and Drop Logic para Kanban
function allowDrop(ev) {
  ev.preventDefault();
}

function dragTask(ev, taskId) {
  ev.dataTransfer.setData("taskId", taskId);
}

async function dropTask(ev, newStatus) {
  ev.preventDefault();
  const taskId = ev.dataTransfer.getData("taskId");
  if (!taskId) return;

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/tarefas/${taskId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      carregarLista(); 
    } else {
      alert('Erro ao atualizar status da tarefa.');
    }
  } catch (err) {
    alert('Erro de conexão ao atualizar tarefa.');
  }
}

// Redirecionamento Direto para o Site do Google Maps (Não necessita de API Key)
async function viewRouteMap(rotaId) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/rotas/${rotaId}/tarefas`, { headers: { 'Authorization': `Bearer ${token}` } });
    if (res.ok) {
      const tarefas = await res.json();
      if (tarefas.length === 0) {
        alert('Esta rota não possui tarefas cadastradas.');
        return;
      }
      
      // Origem fixa
      const origin = encodeURIComponent("Rua Visconde de Taunay, Joinville, SC");
      
      // O último endereço da rota vira o destino final
      const destination = encodeURIComponent(tarefas[tarefas.length - 1].endereco_execucao);
      
      // Os demais viram waypoints (paradas no caminho)
      let waypointsStr = '';
      if (tarefas.length > 1) {
        const wpArr = tarefas.slice(0, -1).map(t => encodeURIComponent(t.endereco_execucao));
        waypointsStr = `&waypoints=${wpArr.join('|')}`;
      }

      // Gera o link para abrir no site do Google Maps
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypointsStr}&travelmode=driving`;
      
      // Abre em uma nova aba
      window.open(mapsUrl, '_blank');
      
    } else {
      alert('Erro ao buscar tarefas da rota');
    }
  } catch (err) {
    alert('Erro de conexão ao buscar tarefas');
  }
}

// Apenas mantido por compatibilidade com botões do modal que possam existir no HTML
function closeMapModal() {
  const modal = document.getElementById('mapModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    const mapContainer = document.getElementById('map');
    if (mapContainer) mapContainer.innerHTML = '';
  }
}

async function deleteItem(tipo, id) {
  if (!confirm('Tem certeza que deseja apagar este item? Esta ação não pode ser desfeita.')) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/${tipo}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (res.ok) {
      carregarLista();
    } else {
      alert(data.error || 'Erro ao apagar o registro.');
    }
  } catch (e) {
    alert('Erro de conexão.');
  }
}

function renderSolicitacoes(dados) {
  let listHtml = '<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">';
  dados.forEach(s => {
    const statusColor = STATUS_COLORS[s.status] || "bg-slate-100 text-slate-500 ring-slate-200";
    const d = new Date(s.data_agendada);
    const dataAgendadaStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') : s.data_agendada;
    const c = new Date(s.created_at);
    const dataCriacaoStr = !isNaN(c) ? c.toLocaleDateString('pt-BR') : '-';
    
    listHtml += `
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-teal-300 transition duration-300 relative flex flex-col justify-between gap-4">
        <div>
          <div class="flex justify-between items-start mb-4">
             <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusColor}">
               <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span> ${s.status || 'PENDENTE'}
             </span>
             <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">#${s.id}</span>
          </div>
          
          <h3 class="text-lg font-bold text-slate-800 mb-2 truncate" title="${s.nome}">${s.nome}</h3>
          
          <div class="flex flex-col gap-2 text-sm text-slate-600 mt-3">
             <div class="flex items-start gap-2">
               <span class="text-slate-400 font-medium w-20 shrink-0">📍 Endereço:</span>
               <span class="break-words">${s.endereco}</span>
             </div>
             <div class="flex items-center gap-2">
               <span class="text-slate-400 font-medium w-20 shrink-0">📞 Telefone:</span>
               <span>${s.telefone}</span>
             </div>
             <div class="flex items-center gap-2">
               <span class="text-slate-400 font-medium w-20 shrink-0">🗄️ Tamanho:</span>
               <span class="font-bold text-teal-600">${s.tamanho}</span>
             </div>
             <div class="flex items-center gap-2">
               <span class="text-slate-400 font-medium w-20 shrink-0">📅 Agendado:</span>
               <span class="font-semibold">${dataAgendadaStr}</span>
             </div>
             ${s.observacoes ? `
               <div class="flex items-start gap-2 mt-1 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                 <span class="text-slate-400 font-medium shrink-0">💬 Obs:</span>
                 <span class="italic text-slate-500 break-words">${s.observacoes}</span>
               </div>
             ` : ''}
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
          <span class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Criado em ${dataCriacaoStr}</span>
          
          <div class="flex gap-2">
             ${s.status === 'PENDENTE' ? `
               <button onclick="abrirModalAprovacao(${s.id})" class="text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3 rounded-xl transition shadow-sm" title="Aprovar Solicitação">Aceitar</button>
               <button onclick="atualizarStatusSolicitacao(${s.id}, 'REJEITADO')" class="text-xs bg-red-100 hover:bg-red-200 text-red-600 font-bold py-1.5 px-3 rounded-xl transition" title="Rejeitar Solicitação">Rejeitar</button>
             ` : ''}
             <button onclick="deleteItem('solicitacoes', ${s.id})" class="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors" title="Excluir Registro">
               <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
             </button>
          </div>
        </div>
      </div>
    `;
  });
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

async function atualizarStatusSolicitacao(id, status) {
  if(!confirm(`Deseja marcar essa solicitação como ${status}?`)) return;
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`/api/solicitacoes/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if(res.ok) {
      carregarLista();
    } else {
      alert("Erro ao atualizar!");
    }
  } catch(e) {
    alert("Erro de conexão!");
  }
}

function renderRelatorioFinanceiro(dados) {
  const resumo = dados.resumo || {};
  const porTamanho = dados.porTamanho || {};
  const solicitacoes = dados.solicitacoes || [];

  let html = `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 shadow-sm">
        <span class="text-emerald-600 text-xs font-bold uppercase tracking-widest block mb-2">Total de Receita</span>
        <div class="flex items-end gap-3">
          <span class="text-5xl font-black text-emerald-700">R$ ${(resumo.totalReceita || 0).toFixed(2).replace('.', ',')}</span>
        </div>
        <p class="text-xs text-emerald-600 mt-2">Todos os pedidos aprovados</p>
      </div>

      <div class="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-3xl p-6 shadow-sm">
        <span class="text-blue-600 text-xs font-bold uppercase tracking-widest block mb-2">Total de Pedidos</span>
        <div class="flex items-end gap-3">
          <span class="text-5xl font-black text-blue-700">${resumo.totalPedidos || 0}</span>
        </div>
        <p class="text-xs text-blue-600 mt-2">Solicitações processadas</p>
      </div>

      <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-6 shadow-sm">
        <span class="text-purple-600 text-xs font-bold uppercase tracking-widest block mb-2">Ticket Médio</span>
        <div class="flex items-end gap-3">
          <span class="text-5xl font-black text-purple-700">R$ ${(resumo.recebitaMedio || 0).toFixed(2).replace('.', ',')}</span>
        </div>
        <p class="text-xs text-purple-600 mt-2">Valor médio por pedido</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Receita por Tamanho de Caçamba</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between p-4 bg-sky-50 rounded-2xl border border-sky-100">
            <div>
              <p class="text-sm font-bold text-slate-800">Caçamba Média</p>
              <p class="text-xs text-slate-500">${porTamanho.MEDIO?.quantidade || 0} pedidos</p>
            </div>
            <span class="text-2xl font-black text-sky-600">R$ ${(porTamanho.MEDIO?.receita || 0).toFixed(2).replace('.', ',')}</span>
          </div>
          <div class="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div>
              <p class="text-sm font-bold text-slate-800">Caçamba Grande</p>
              <p class="text-xs text-slate-500">${porTamanho.GRANDE?.quantidade || 0} pedidos</p>
            </div>
            <span class="text-2xl font-black text-amber-600">R$ ${(porTamanho.GRANDE?.receita || 0).toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h3 class="text-lg font-bold text-slate-800 mb-6">Distribuição de Pedidos</h3>
        <div class="space-y-4">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-semibold text-slate-700">Médio</span>
              <span class="text-xs font-bold text-slate-500">${Math.round((porTamanho.MEDIO?.quantidade || 0) / ((porTamanho.MEDIO?.quantidade || 0) + (porTamanho.GRANDE?.quantidade || 0)) * 100)}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div class="bg-sky-500 h-full rounded-full" style="width: ${Math.round((porTamanho.MEDIO?.quantidade || 0) / ((porTamanho.MEDIO?.quantidade || 0) + (porTamanho.GRANDE?.quantidade || 0)) * 100)}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-semibold text-slate-700">Grande</span>
              <span class="text-xs font-bold text-slate-500">${Math.round((porTamanho.GRANDE?.quantidade || 0) / ((porTamanho.MEDIO?.quantidade || 0) + (porTamanho.GRANDE?.quantidade || 0)) * 100)}%</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div class="bg-amber-500 h-full rounded-full" style="width: ${Math.round((porTamanho.GRANDE?.quantidade || 0) / ((porTamanho.MEDIO?.quantidade || 0) + (porTamanho.GRANDE?.quantidade || 0)) * 100)}%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-slate-800 mb-6">Detalhes de Solicitações</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="text-xs uppercase text-slate-400 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Cliente</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tamanho</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Preço</th>
              <th class="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Data</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${solicitacoes.map(s => `
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-4 py-3 text-sm font-medium text-slate-800">#${s.id}</td>
                <td class="px-4 py-3 text-sm text-slate-600">${s.nome}</td>
                <td class="px-4 py-3 text-sm">
                  <span class="inline-block px-2 py-1 rounded-lg text-xs font-semibold ${s.tamanho === 'MEDIO' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}">
                    ${s.tamanho}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm font-bold text-teal-600">R$ ${parseFloat(s.preco).toFixed(2).replace('.', ',')}</td>
                <td class="px-4 py-3 text-sm text-slate-500">${new Date(s.data_agendada).toLocaleDateString('pt-BR')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  listaConteudo.innerHTML = html;
}

function renderClientesGasto(dados) {
  const clientes = dados.clientes || [];
  const totalGeral = dados.totalReceitaGeral || 0;

  let html = `
    <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl p-6 shadow-sm mb-8">
      <span class="text-purple-600 text-xs font-bold uppercase tracking-widest block mb-2">Receita Total dos Top Clientes</span>
      <div class="flex items-end gap-3">
        <span class="text-5xl font-black text-purple-700">R$ ${totalGeral.toFixed(2).replace('.', ',')}</span>
      </div>
    </div>

    <div class="grid gap-6">
      ${clientes.map((cliente, idx) => `
        <div class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:border-teal-300 transition duration-300">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 border border-teal-200 flex items-center justify-center text-2xl font-black text-teal-600">
                ${idx + 1}
              </div>
              <div>
                <p class="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-1">Cliente #${idx + 1}</p>
                <h3 class="text-xl font-bold text-slate-800">${cliente.nome}</h3>
                <p class="text-xs text-slate-500 font-mono">${cliente.cpf_cnpj}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Gasto</p>
              <p class="text-2xl font-black text-teal-600">R$ ${cliente.totalGasto.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pedidos</span>
              <span class="text-2xl font-black text-slate-800">${cliente.totalPedidos}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Gasto Médio</span>
              <span class="text-2xl font-black text-slate-800">R$ ${cliente.gastoMedio.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Percentual</span>
              <span class="text-2xl font-black text-slate-800">${(cliente.totalGasto / totalGeral * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Histórico de Pedidos</p>
            <div class="space-y-2">
              ${cliente.detalhes.slice(0, 3).map(d => `
                <div class="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span class="text-slate-600">${d.tamanho} - ${new Date(d.data_agendada).toLocaleDateString('pt-BR')}</span>
                  <span class="font-bold text-teal-600">R$ ${parseFloat(d.preco).toFixed(2).replace('.', ',')}</span>
                </div>
              `).join('')}
              ${cliente.detalhes.length > 3 ? `<p class="text-[10px] text-slate-400 text-center pt-2">+ ${cliente.detalhes.length - 3} pedido(s)</p>` : ''}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  listaConteudo.innerHTML = html;
}

async function abrirModalAprovacao(id) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch("../components/aprovar-solicitacao-modal.html");
    const html = await res.text();
    
    const container = document.getElementById("modal-container");
    container.innerHTML = `<div id="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm hidden transition-all duration-300 opacity-0">
      <div class="relative bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl transition-all duration-300 transform scale-95 opacity-0 mx-auto">
        ${html}
        <button id="btn-fechar-modal" class="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>`;

    const modal = document.getElementById("modal");
    const modalInner = modal.querySelector('.max-w-md');
    document.getElementById('aprovar-solicitacao-id').value = id;

    // Load generic selects data
    const resC = await fetch('/api/cacambas', { headers: { "Authorization": `Bearer ${token}` } });
    const cacambas = await resC.json();
    const selC = modal.querySelector('.select-cacambas');
    selC.innerHTML = '<option value="" disabled selected>Selecione uma caçamba</option>' + cacambas.filter(c => c.status === 'DISPONIVEL').map(c => `<option value="${c.id}">${c.tamanho} (ID: ${c.id})</option>`).join('');

    const resM = await fetch('/api/motoristas', { headers: { "Authorization": `Bearer ${token}` } });
    const motoristas = await resM.json();
    const selM = modal.querySelector('.select-motoristas');
    selM.innerHTML = '<option value="" disabled selected>Selecione um motorista</option>' + motoristas.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');

    const resV = await fetch('/api/veiculos', { headers: { "Authorization": `Bearer ${token}` } });
    const veiculos = await resV.json();
    const selV = modal.querySelector('.select-veiculos');
    selV.innerHTML = '<option value="" disabled selected>Selecione um veículo</option>' + veiculos.map(v => `<option value="${v.id}">${v.placa} - ${v.modelo}</option>`).join('');

    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      modalInner.classList.remove('scale-95', 'opacity-0');
      modalInner.classList.add('scale-100', 'opacity-100');
    }, 10);

    const closeModal = () => {
      modal.classList.add('opacity-0');
      modalInner.classList.remove('scale-100', 'opacity-100');
      modalInner.classList.add('scale-95', 'opacity-0');
      setTimeout(() => modal.classList.add("hidden"), 300);
    };

    document.getElementById("btn-fechar-modal").addEventListener("click", closeModal);
    document.getElementById("btn-cancelar-modal").addEventListener("click", closeModal);

    const form = document.getElementById("modal-form");
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dados = Object.fromEntries(formData.entries());
      const submitBtn = form.querySelector('button[type="submit"]');
      const alerta = document.getElementById("modal-alerta");
      submitBtn.innerHTML = 'Aprovando...';
      submitBtn.disabled = true;

      try {
        const fetchRes = await fetch(`/api/solicitacoes/${dados.solicitacao_id}/aprovar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(dados)
        });
        const respData = await fetchRes.json();
        
        if (fetchRes.ok) {
          alerta.innerHTML = `<div class="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">${respData.mensagem}</div>`;
          setTimeout(() => { closeModal(); carregarLista(); }, 1500);
        } else {
          alerta.innerHTML = `<div class="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">${respData.erro}</div>`;
          submitBtn.innerHTML = 'Aprovar e Criar Tarefa';
          submitBtn.disabled = false;
        }
      } catch(err) {
        alerta.innerHTML = `<div class="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">Erro de conexão</div>`;
        submitBtn.disabled = false;
      }
    });

  } catch(e) {
    console.error(e);
  }
}
