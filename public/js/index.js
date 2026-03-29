const dashboardGrid = document.getElementById('dashboard-grid');

const TIPOS = ['solicitacoes', 'usuarios', 'veiculos', 'motoristas', 'clientes', 'cacambas', 'rotas'];


let tipoAtual = null;

async function carregarListas() {
  for (const tipo of TIPOS) {
    carregarLista(tipo);
  }
}

async function carregarLista(tipo) {
  try {
    const res = await fetch("/api/" + tipo);
    const dados = await res.json();
    const container = document.getElementById("lista-" + tipo);
    container.innerHTML = '';

    if (!dados || dados.length === 0) {
      const emptyState = document.getElementById('empty-state-template').content.cloneNode(true);
      container.appendChild(emptyState);
      return;
    }

    if (dados[0] && dados[0].id !== undefined) {
      dados.sort((a, b) => a.id - b.id);
    }

    const colunas = Object.keys(dados[0]);
    let theadHTML = `<thead class="text-xs uppercase text-zinc-400 border-b border-zinc-800"><tr class="table-header-row">`;
    colunas.forEach(col => {
      const nomes = { 'created_at': 'Criado Em', 'updated_at': 'Atualizado Em', 'motorista_id': 'Cód Motorista', 'cpf_cnpj': 'CPF / CNPJ' };
      theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">${nomes[col] || col.replace('_', ' ')}</th>`;
    });
    if(tipo === 'solicitacoes') {
      theadHTML += `<th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60 text-right">Ações</th>`;
    }
    theadHTML += `</tr></thead>`;

    let tbodyHTML = `<tbody class="table-body divide-y divide-zinc-800">`;
    dados.forEach(row => {
      tbodyHTML += `<tr class="hover:bg-white/80 transition-colors duration-150 rounded-xl group">`;
      colunas.forEach((col, i) => {
        let content = row[col] || "-";
        if (col.toLowerCase().includes('status')) {
          const colorMap = {
            'ATIVO': 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
            'INATIVO': 'bg-slate-100 text-slate-700 ring-slate-600/20',
            'DISPONIVEL': 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
            'ENTREGUE': 'bg-amber-50 text-amber-700 ring-amber-600/20',
            'FINALIZADA': 'bg-teal-50 text-teal-700 ring-teal-600/20',
            'PLANEJADA': 'bg-blue-50 text-blue-700 ring-blue-600/20',
            'PENDENTE': 'bg-amber-100 text-amber-800 ring-amber-600/20',
            'ACEITO': 'bg-emerald-100 text-emerald-800 ring-emerald-600/20',
            'REJEITADO': 'bg-rose-100 text-rose-800 ring-rose-600/20'
          };
          const classes = colorMap[content] || 'bg-slate-100 text-slate-600 ring-slate-500/10';
          tbodyHTML += `<td class="px-4 py-3 text-sm"><span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}">${content}</span></td>`;
        } else {
          if (content && (col === 'created_at' || col === 'updated_at' || col === 'data' || col === 'data_agendada')) {
            const d = new Date(content);
            if (!isNaN(d)) content = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
          }
          tbodyHTML += `<td class="px-4 py-3 text-sm flex-wrap max-w-[200px] whitespace-pre-wrap ${i === 0 ? 'font-medium text-white' : 'text-zinc-300'}">${content}</td>`;
        }
      });
      if(tipo === 'solicitacoes') {
        if(row.status === 'PENDENTE') {
          tbodyHTML += `<td class="px-4 py-3 text-sm text-right whitespace-nowrap">
            <button onclick="abrirModalAprovacao(${row.id})" class="mr-3 text-emerald-500 font-medium hover:text-emerald-400 transition">Aceitar</button>
            <button onclick="atualizarStatusSolicitacao(${row.id}, 'REJEITADO')" class="text-rose-500 font-medium hover:text-rose-400 transition">Rejeitar</button>
          </td>`;
        } else {
          tbodyHTML += `<td class="px-4 py-3 text-sm text-zinc-500 text-right">-</td>`;
        }
      }
      tbodyHTML += `</tr>`;
    });
    tbodyHTML += `</tbody>`;

    const tableStr = `<table class="w-full text-left text-sm">${theadHTML}${tbodyHTML}</table>`;
    container.innerHTML = tableStr;
  } catch (e) {
    const errorState = document.getElementById('error-state-template').content.cloneNode(true);
    const container = document.getElementById("lista-" + tipo);
    container.innerHTML = '';
    container.appendChild(errorState);
  }
}

async function abrirModal(tipo, btn) {
  tipoAtual = tipo;

  const originalText = btn.innerHTML;
  btn.innerHTML = `<svg class="animate-spin h-4 w-4 text-white inline flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
  btn.disabled = true;

  try {
    const res = await fetch("components/" + tipo.slice(0, -1) + "-modal.html");
    let html = await res.text();

    html = html.replace('max-h-[90vh]', 'max-h-[90vh] overflow-y-auto');

    const container = document.getElementById("modal-container");
    container.innerHTML = html;

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
      setTimeout(() => {
        modal.classList.add("hidden");
      }, 300);
    };

    btnFechar.addEventListener("click", closeModal);
    btnCancelar.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const dados = Object.fromEntries(formData.entries());
      const alerta = document.getElementById("modal-alerta");

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerHTML = 'Salvando...';
      submitBtn.disabled = true;

      try {
        const res = await fetch("/api/" + tipoAtual, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });

        const data = await res.json();

        if (res.ok) {
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 mb-6 flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-medium">${data.mensagem}</span></div>`;
          setTimeout(() => {
            closeModal();
            carregarLista(tipoAtual);
          }, 1500);
        } else {
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400 mb-6 flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-medium">${data.erro}</span></div>`;
          submitBtn.innerHTML = 'Salvar';
          submitBtn.disabled = false;
        }
      } catch (e) {
        alerta.innerHTML = `<div class="p-4 rounded-xl text-sm border border-rose-500/50 bg-rose-500/10 text-rose-400 mb-6 flex items-center gap-2"><span class="font-medium">Erro ao conectar com o servidor.</span></div>`;
        submitBtn.innerHTML = 'Salvar';
        submitBtn.disabled = false;
      }
    });

  } catch (err) {
    console.error("Modal load error", err);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-cadastrar')) {
    const btn = e.target.closest('.btn-cadastrar');
    abrirModal(btn.dataset.tipo, btn);
  }
});

carregarListas();

async function atualizarStatusSolicitacao(id, status) {
  if(!confirm(`Deseja marcar essa solicitação como ${status}?`)) return;
  try {
    const res = await fetch(`/api/solicitacoes/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    if(res.ok) {
      alert("Status atualizado!");
      carregarLista('solicitacoes');
    } else {
      alert("Erro ao atualizar!");
    }
  } catch(e) {
    alert("Erro de conexão!");
  }
}

async function abrirModalAprovacao(id) {
  try {
    const res = await fetch("components/aprovar-solicitacao-modal.html");
    const html = await res.text();
    
    const container = document.getElementById("modal-container");
    container.innerHTML = `<div id="modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm hidden transition-all duration-300 opacity-0">
      <div class="relative bg-zinc-950 w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl transition-all duration-300 transform scale-95 opacity-0 mx-auto">
        ${html}
        <button id="btn-fechar-modal" class="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>`;

    const modal = document.getElementById("modal");
    const modalInner = modal.querySelector('.max-w-md');
    document.getElementById('aprovar-solicitacao-id').value = id;

    // Load generic selects data
    const resC = await fetch('/api/cacambas');
    const cacambas = await resC.json();
    const selC = modal.querySelector('.select-cacambas');
    selC.innerHTML = '<option value="" disabled selected>Selecione uma caçamba</option>' + cacambas.filter(c => c.status === 'DISPONIVEL').map(c => `<option value="${c.id}">${c.tamanho} (ID: ${c.id})</option>`).join('');

    const resM = await fetch('/api/motoristas');
    const motoristas = await resM.json();
    const selM = modal.querySelector('.select-motoristas');
    selM.innerHTML = '<option value="" disabled selected>Selecione um motorista</option>' + motoristas.map(m => `<option value="${m.id}">${m.nome}</option>`).join('');

    const resV = await fetch('/api/veiculos');
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
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dados)
        });
        const respData = await fetchRes.json();
        
        if (fetchRes.ok) {
          alerta.innerHTML = `<div class="p-3 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/50 rounded">${respData.mensagem}</div>`;
          setTimeout(() => { closeModal(); carregarLista('solicitacoes'); }, 1500);
        } else {
          alerta.innerHTML = `<div class="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/50 rounded">${respData.erro}</div>`;
          submitBtn.innerHTML = 'Aprovar e Criar Tarefa';
          submitBtn.disabled = false;
        }
      } catch(err) {
        alerta.innerHTML = `<div class="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/50 rounded">Erro de conexão</div>`;
        submitBtn.disabled = false;
      }
    });

  } catch(e) {
    console.error(e);
  }
}
