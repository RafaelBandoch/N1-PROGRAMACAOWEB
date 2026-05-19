

const STATUS_COLORS = {
  ATIVO: "bg-zinc-800 text-emerald-400 ring-emerald-500/30",
  INATIVO: "bg-zinc-800 text-zinc-400 ring-zinc-500/30",
  DISPONIVEL: "bg-zinc-800 text-blue-400 ring-blue-500/30",
  ENTREGUE: "bg-zinc-800 text-orange-400 ring-orange-500/30",
  EM_MANUTENCAO: "bg-zinc-800 text-yellow-400 ring-yellow-500/30",
  RESERVADA: "bg-zinc-800 text-purple-400 ring-purple-500/30",
  PLANEJADA: "bg-zinc-800 text-blue-400 ring-blue-500/30",
  EM_EXECUCAO: "bg-zinc-800 text-cyan-400 ring-cyan-500/30",
  FINALIZADA: "bg-zinc-800 text-teal-400 ring-teal-500/30"
};

const botoesTipo = document.querySelectorAll(".tipo-btn");
const btnCadastrar = document.getElementById("btn-cadastrar");
const modalContainer = document.getElementById("modal-container");
const listaConteudo = document.getElementById("lista-conteudo");
const titutoLista = document.getElementById("titulo-lista");

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

async function abrirModal() {
  const originalText = btnCadastrar.innerHTML;
  btnCadastrar.innerHTML = `<svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
  btnCadastrar.disabled = true;

  try {
    const res = await fetch("../components/" + tipoAtual.slice(0, -1) + "-modal.html");
    let html = await res.text();

    html = html.replace('bg-white/95 backdrop-blur-xl', 'bg-zinc-900 border border-zinc-800');
    html = html.replace('text-slate-900', 'text-white');
    html = html.replace('text-slate-700', 'text-zinc-300');
    html = html.replace(/bg-slate-50\/50/g, 'bg-zinc-800/50');
    html = html.replace(/border-slate-200/g, 'border-zinc-700');
    html = html.replace(/focus:ring-blue-600/g, 'focus:ring-zinc-400');
    html = html.replace(/focus:border-blue-600/g, 'focus:border-zinc-400');
    html = html.replace('text-slate-900', 'text-white');
    html = html.replace('text-gray-400', 'text-zinc-500');
    html = html.replace(/text-slate-900/g, 'text-zinc-100');
    html = html.replace(/bg-blue-600/g, 'bg-white');
    html = html.replace(/hover:bg-blue-700/g, 'hover:bg-zinc-200');
    html = html.replace(/text-white/g, 'text-black');
    html = html.replace(/shadow-blue-200/g, 'shadow-none');
    html = html.replace(/hover:shadow-blue-300/g, 'shadow-none');

    html = html.replace(/text-black/g, 'text-black').replace(/text-slate-700/g, 'text-zinc-400');

    modalContainer.innerHTML = html;

    const modal = document.getElementById("modal");
    const modalInner = modal.querySelector('.max-w-md');
    const btnFechar = document.getElementById("btn-fechar-modal");
    const btnCancelar = document.getElementById("btn-cancelar-modal");
    const form = document.getElementById("modal-form");

    modal.querySelector('h2').className = "text-2xl font-bold tracking-tight text-white";

    modal.classList.remove("hidden");

    modal.querySelectorAll('input, select').forEach(el => el.classList.add('text-white'));

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
          alerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-emerald-500/50 bg-emerald-500/10 text-emerald-400">Salvo com sucesso</div>';
          setTimeout(() => { closeModal(); carregarLista(); }, 1200);
        } else {
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400">${data.erro || 'Erro ao salvar'}</div>`;
          submitBtn.innerHTML = 'Salvar';
          submitBtn.disabled = false;
        }
      } catch (e) {
        alerta.innerHTML = '<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400">Erro de conexão</div>';
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
    listaConteudo.innerHTML = '<div class="text-zinc-500 py-12 text-center animate-pulse">Carregando...</div>';
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch("/api/" + tipoAtual, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const dados = await res.json();
    listaConteudo.innerHTML = "";

    if (!dados || dados.length === 0) {
      listaConteudo.innerHTML = '<div class="text-zinc-600 py-12 text-center">Nenhum registro encontrado</div>';
      return;
    }

    if (dados[0] && dados[0].id !== undefined) {
      dados.sort((a, b) => a.id - b.id);
    }

    if (tipoAtual === 'cacambas') {
      return renderCacambas(dados);
    }
    if (tipoAtual === 'rotas') {
      return renderRotas(dados);
    }
    if (tipoAtual === 'clientes') {
      return renderClientes(dados);
    }
    if (tipoAtual === 'tarefas') {
      return renderTarefas(dados);
    }

    renderizarTabelaGenerica(dados);
  } catch (err) {
    console.error(err);
    listaConteudo.innerHTML = '<div class="text-rose-400 py-12 text-center">Erro ao carregar dados da API</div>';
  }
}

function renderizarTabelaGenerica(dados) {
  const table = document.createElement("table");
  table.className = "w-full text-left text-sm";
  const colunas = Object.keys(dados[0]);

  let theadHTML = `<thead class="text-xs uppercase text-zinc-400 border-b border-zinc-800"><tr class="table-header-row">`;
  colunas.forEach(col => {
    const nomes = { 'created_at': 'Criado Em', 'updated_at': 'Atualizado Em', 'motorista_id': 'Cód Motorista', 'cpf_cnpj': 'CPF / CNPJ' };
    theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">${nomes[col] || col.replace('_', ' ')}</th>`;
  });
  theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Ações</th></tr></thead>`;

  let tbodyHTML = `<tbody class="table-body divide-y divide-zinc-800/50">`;
  dados.forEach(row => {
    tbodyHTML += `<tr class="hover:bg-zinc-800/30 transition-colors duration-150 group">`;
    colunas.forEach((col, i) => {
      let content = row[col] || "-";
      if (col.toLowerCase().includes("status")) {
        const classes = STATUS_COLORS[content] || "bg-zinc-800 text-zinc-400 ring-zinc-500/30";
        tbodyHTML += `<td class="px-4 py-3 text-sm"><span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}">${content}</span></td>`;
      } else {
        if (content && (col === 'created_at' || col === 'updated_at' || col === 'data')) {
          const d = new Date(content);
          if (!isNaN(d)) content = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        tbodyHTML += `<td class="px-4 py-3 text-sm ${i === 0 ? 'font-medium text-white' : 'text-zinc-300'}">${content}</td>`;
      }
    });
    tbodyHTML += `<td class="px-4 py-3 text-right"><button onclick="deleteItem(tipoAtual, ${row.id})" class="text-zinc-500 hover:text-red-400" title="Excluir">🗑️</button></td></tr>`;
  });
  tbodyHTML += `</tbody>`;

  table.innerHTML = theadHTML + tbodyHTML;
  listaConteudo.appendChild(table);
}

function renderCacambas(dados) {
  const counts = dados.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const totaisHtml = `
    <div class="flex flex-wrap gap-4 mb-8 pt-4 justify-between lg:justify-start">
      <div class="flex-1 min-w-[200px] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
         <div class="absolute right-0 top-0 opacity-10 blur-xl w-32 h-32 bg-white rounded-full -mr-10 -mt-10"></div>
         <span class="text-zinc-400 text-xs font-bold uppercase tracking-widest block mb-4">Total Inventário</span>
         <div class="flex items-end gap-3"><span class="text-5xl font-black text-white tracking-tighter">${dados.length}</span><span class="text-zinc-500 mb-1">uni.</span></div>
      </div>
      <div class="flex-1 min-w-[200px] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
         <div class="absolute right-0 top-0 opacity-10 w-24 h-24 bg-blue-500 rounded-full blur-2xl"></div>
         <span class="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Pátio Livre</span>
         <div class="flex items-end gap-3"><span class="text-4xl font-black text-white tracking-tighter">${counts['DISPONIVEL'] || 0}</span></div>
      </div>
      <div class="flex-1 min-w-[200px] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
         <div class="absolute right-0 top-0 opacity-10 w-24 h-24 bg-orange-500 rounded-full blur-2xl"></div>
         <span class="text-orange-400 text-xs font-bold uppercase tracking-widest block mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Locadas</span>
         <div class="flex items-end gap-3"><span class="text-4xl font-black text-white tracking-tighter">${counts['ENTREGUE'] || 0}</span></div>
      </div>
    </div>
  `;

  let gridCards = '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 pb-8">';
  dados.forEach(c => {
    let rawStatusColor = STATUS_COLORS[c.status] || "bg-zinc-800 text-zinc-400";
    let statusBg = rawStatusColor.split(" ")[0].replace('bg-', '');
    if(statusBg === 'bg-zinc-800') statusBg = 'zinc-500';

    gridCards += `
      <div class="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-3xl p-6 flex flex-col justify-between h-auto min-h-[180px] shadow-sm hover:shadow-2xl transition duration-300 relative">
        <div class="flex justify-between items-start mb-6">
           <div class="bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-bold text-white shadow-inner">
             <span class="text-zinc-500 font-normal mr-1">#</span>${c.id}
           </div>
           <button onclick="deleteItem('cacambas', ${c.id})" class="text-zinc-500 hover:text-red-400 p-1" title="Excluir">🗑️</button>
           <span class="w-3 h-3 rounded-full bg-${statusBg} shadow-[0_0_12px_rgba(0,0,0,0.5)] shadow-${statusBg}" title="${c.status}"></span>
        </div>
        <div>
           <div class="text-2xl font-black text-zinc-100 mb-1 tracking-tight uppercase">${c.tamanho}</div>
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
    const statusClass = STATUS_COLORS[rota.status] || "bg-zinc-800 text-zinc-400 border border-zinc-700/50";

    listHtml += `
      <div class="bg-gradient-to-r from-zinc-900 to-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all w-full">
        <div class="flex items-center gap-5">
           <div class="w-14 h-14 rounded-full bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center shadow-inner">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
           </div>
           <div>
              <p class="text-[11px] font-bold tracking-widest text-zinc-500 uppercase mb-1">Rota Operacional #${rota.id}</p>
              <h3 class="text-xl font-semibold text-white tracking-tight">${dateStr}</h3>
           </div>
        </div>

        <div class="flex-1 w-full md:w-auto md:px-8 border-t md:border-t-0 md:border-l border-zinc-800/50 pt-4 md:pt-0">
           <p class="text-xs text-zinc-500 uppercase tracking-widest mb-1.5 font-medium">Motorista Responsável</p>
           <p class="text-base text-zinc-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              ${rota.motorista_nome || (rota.motorista_id ? 'Registro Cód. ' + rota.motorista_id : 'Não Definido')}
           </p>
        </div>

        <div class="flex flex-col md:flex-row items-end md:items-center gap-4">
           <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass.replace('ring-1', '').replace('ring-inset', '')}">
              <span class="w-2 h-2 rounded-full bg-current opacity-70 mr-2"></span>
              ${rota.status}
           </span>
           <button onclick="viewRouteMap(${rota.id})" class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            Ver Melhor Rota
          </button>
          <button onclick="deleteItem('rotas', ${rota.id})" class="bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 p-2 rounded-lg transition-colors" title="Excluir">🗑️</button>
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
      <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1 transition duration-300 w-full overflow-hidden relative group">
         <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
         <div class="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center text-2xl font-black text-blue-400 flex-shrink-0 shadow-inner">
            ${cliente.nome ? cliente.nome.charAt(0).toUpperCase() : '?'}
         </div>
         <div class="flex-1 min-w-0">
            <h3 class="text-white font-bold text-xl mb-1 truncate" title="${cliente.nome}">${cliente.nome}</h3>
            <div class="flex flex-col gap-2 mt-4 text-sm">
              <div class="flex items-start gap-3 text-zinc-400">
                 <div class="w-8 h-8 rounded-lg bg-zinc-950/50 flex items-center justify-center shrink-0">📍</div>
                 <span class="break-words line-clamp-2">${cliente.endereco || 'Endereço não informado'}</span>
              </div>
              <div class="flex items-center gap-3 text-zinc-500 mt-1">
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
    'EM_ANDAMENTO': { title: 'A Fazer (Andamento)', border: 'border-blue-500/30' },
    'ENTREGUE': { title: 'Entregue', border: 'border-orange-500/30' },
    'COLETADO': { title: 'Coletado', border: 'border-red-500/30' },
    'CANCELADO': { title: 'Cancelado', border: 'border-zinc-500/30' },
    'JUSTIFICADO': { title: 'Justificado', border: 'border-purple-500/30' }
  };

  let kanbanHtml = '<div class="flex gap-4 overflow-x-auto pb-4 h-full min-h-[600px] p-2">';

  Object.keys(statusCols).forEach(statusKey => {
    const col = statusCols[statusKey];
    kanbanHtml += `
      <div class="flex flex-col min-w-[320px] max-w-[320px] bg-zinc-950/80 border border-zinc-800 rounded-2xl flex-shrink-0"
           ondragover="allowDrop(event)" ondrop="dropTask(event, '${statusKey}')">
        <div class="p-4 border-b border-zinc-800 flex justify-between items-center">
          <h3 class="text-white font-bold tracking-wide">${col.title}</h3>
          <span class="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded-md font-bold">${dados.filter(t => t.status === statusKey).length}</span>
        </div>
        <div class="p-3 flex flex-col gap-3 flex-1 overflow-y-auto min-h-[100px]" id="col-${statusKey}">
    `;

    dados.filter(t => t.status === statusKey).forEach(tarefa => {
      const d = new Date(tarefa.data_agendada);
      const dateStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : tarefa.data_agendada;
      
      let icon = '';
      let textColor = '';
      if (tarefa.tipo === 'ENTREGA') { icon = '⬇️'; textColor = 'text-green-400'; }
      if (tarefa.tipo === 'COLETA') { icon = '⬆️'; textColor = 'text-red-400'; }
      if (tarefa.tipo === 'TROCA') { icon = '🔄'; textColor = 'text-blue-400'; }

      kanbanHtml += `
        <div id="task-${tarefa.id}" draggable="true" ondragstart="dragTask(event, ${tarefa.id})"
             class="bg-zinc-900 border ${col.border} rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-zinc-500 transition-colors shadow-lg group">
           <div class="flex justify-between items-start mb-3">
              <span class="text-[10px] font-bold ${textColor} tracking-widest uppercase flex items-center gap-1">${icon} ${tarefa.tipo}</span>
              <div class="flex gap-2">
                 <span class="text-zinc-500 text-xs font-mono">#${tarefa.id}</span>
                 <button onclick="deleteItem('tarefas', ${tarefa.id})" class="text-zinc-500 hover:text-red-400" title="Excluir">🗑️</button>
              </div>
           </div>
           <h4 class="text-white font-semibold text-sm mb-2 line-clamp-2">${tarefa.cliente_nome || 'Cliente não definido'}</h4>
           <div class="flex items-start gap-2 mb-3">
             <span class="text-zinc-400 text-xs line-clamp-2 flex-1">📍 ${tarefa.endereco_execucao || 'Endereço não informado'}</span>
             <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tarefa.endereco_execucao || '')}" target="_blank" title="Abrir no Google Maps" 
                class="opacity-0 group-hover:opacity-100 p-1.5 bg-zinc-800 hover:bg-indigo-600 rounded-lg text-zinc-400 hover:text-white transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             </a>
           </div>
           <div class="flex justify-between items-center text-[10px] text-zinc-500 font-medium">
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

window.addEventListener('load', () => {
  const firstBtn = document.querySelector('[data-tipo="usuarios"]');
  if (firstBtn) {
    updateTabsUI(firstBtn);
    titutoLista.textContent = "Usuários";
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

