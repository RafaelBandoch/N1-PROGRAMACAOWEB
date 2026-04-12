

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
        const res = await fetch("/api/" + tipoAtual, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(dados),
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
    const res = await fetch("/api/" + tipoAtual);
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
  theadHTML += `</tr></thead>`;

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
    tbodyHTML += `</tr>`;
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

        <div class="flex items-center">
           <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusClass.replace('ring-1', '').replace('ring-inset', '')}">
              <span class="w-2 h-2 rounded-full bg-current opacity-70 mr-2"></span>
              ${rota.status}
           </span>
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
  let listHtml = '<div class="flex flex-col gap-4 py-4 px-2">';
  
  dados.forEach(tarefa => {
    const d = new Date(tarefa.data_agendada);
    const dateStr = !isNaN(d) ? d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : tarefa.data_agendada;
    
    let icon = '';
    let textColor = '';
    if (tarefa.tipo === 'ENTREGA') { icon = '⬇️'; textColor = 'text-green-400'; }
    if (tarefa.tipo === 'COLETA') { icon = '⬆️'; textColor = 'text-red-400'; }
    if (tarefa.tipo === 'TROCA') { icon = '🔄'; textColor = 'text-blue-400'; }
    
    const statusClass = STATUS_COLORS[tarefa.status] || "bg-zinc-800 text-zinc-400 ring-zinc-600/30";

    listHtml += `
      <div class="bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row gap-5 hover:border-zinc-600 hover:bg-zinc-900 transition-colors">
         <div class="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded-xl w-20 h-20 shrink-0">
            <span class="text-2xl mb-1">${icon}</span>
            <span class="text-[10px] font-bold ${textColor} tracking-widest uppercase">${tarefa.tipo}</span>
         </div>
         
         <div class="flex-1 w-full md:border-r border-zinc-800/50 md:pr-6">
            <div class="flex justify-between items-start mb-2">
               <h3 class="text-white font-semibold text-lg truncate">${tarefa.cliente_nome || 'Cliente não definido'}</h3>
            </div>
            <p class="text-zinc-400 text-sm mb-3 flex items-start gap-2">
               <span>📍</span> <span class="break-words line-clamp-2">${tarefa.endereco_execucao || 'Endereço não informado'}</span>
            </p>
            <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-500 font-medium uppercase tracking-wider">
               <span>Caçamba: <strong class="text-zinc-300">#${tarefa.cacamba_id}</strong></span>
               <span>Motorista: <strong class="text-zinc-300">${tarefa.motorista_nome || '--'}</strong></span>
               <span>Veículo: <strong class="text-zinc-300">${tarefa.veiculo_placa || '--'}</strong></span>
            </div>
         </div>
         
         <div class="flex flex-col justify-between items-end md:pl-2 shrink-0 md:w-48 gap-3 md:gap-0 mt-2 md:mt-0">
            <span class="inline-flex items-center rounded-md px-2 py-1 text-[10px] uppercase font-bold ring-1 ring-inset ${statusClass.replace('ring-1', '').replace('ring-inset', '')}">
               ${tarefa.status.replace('_', ' ')}
            </span>
            <div class="text-right">
               <span class="block text-zinc-500 text-[10px] uppercase tracking-widest">Agendado para</span>
               <span class="text-zinc-200 font-semibold">${dateStr}</span>
            </div>
         </div>
      </div>
    `;
  });
  
  listHtml += '</div>';
  listaConteudo.innerHTML = listHtml;
}

window.addEventListener('load', () => {
  const firstBtn = document.querySelector('[data-tipo="usuarios"]');
  if (firstBtn) {
    updateTabsUI(firstBtn);
    titutoLista.textContent = "Usuários";
    carregarLista(true);
  }
});