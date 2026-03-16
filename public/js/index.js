const dashboardGrid = document.getElementById('dashboard-grid');

const TIPOS = ['usuarios', 'veiculos', 'motoristas', 'clientes', 'cacambas', 'rotas'];


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
            'PLANEJADA': 'bg-blue-50 text-blue-700 ring-blue-600/20'
          };
          const classes = colorMap[content] || 'bg-slate-100 text-slate-600 ring-slate-500/10';
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
