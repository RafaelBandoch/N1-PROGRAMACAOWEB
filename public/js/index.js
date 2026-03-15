const SECTIONS = [
  { id: 'usuarios', title: 'Usuários', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>' },
  { id: 'veiculos', title: 'Veículos', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>' }, // Using an exchange/truck placeholder
  { id: 'motoristas', title: 'Motoristas', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>' },
  { id: 'clientes', title: 'Clientes', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>' },
  { id: 'cacambas', title: 'Caçambas', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>' },
  { id: 'rotas', title: 'Rotas', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>' }
];

const dashboardGrid = document.getElementById('dashboard-grid');

SECTIONS.forEach(sec => {
  dashboardGrid.innerHTML += `
    <section class="glass p-7 rounded-[2rem] hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 transform group border border-white/60">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <div class="p-3.5 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl text-indigo-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">${sec.icon}</svg>
          </div>
          <h2 class="text-xl font-bold text-slate-800 tracking-tight">${sec.title}</h2>
        </div>
        <button
          class="btn-cadastrar px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-300"
          data-tipo="${sec.id}"
        >
          + Novo
        </button>
      </div>
      <div id="lista-${sec.id}" class="bg-white/50 rounded-2xl p-4 overflow-x-auto text-sm no-scrollbar border border-white/40 min-h-[140px]">
        <div class="animate-pulse flex space-x-4 items-center h-full justify-center">
          <div class="text-slate-400 font-medium tracking-wide">Carregando dados...</div>
        </div>
      </div>
    </section>
  `;
});

const TIPOS = SECTIONS.map(s => s.id);
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

    if (!dados || dados.length === 0) {
      container.innerHTML = '<div class="flex h-full items-center justify-center py-6 text-slate-400 font-medium">Nenhum registro encontrado</div>';
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
      html += '<th class="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">' + nomeExibicao + "</th>";
    });
    html += "</tr></thead><tbody class='divide-y divide-slate-100/60'>";

    dados.forEach((row, index) => {
      html += `<tr class="hover:bg-white/80 transition-colors duration-150 rounded-xl group">`;
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
          content = `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}">${content}</span>`;
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

        html += `<td class="px-4 py-3 text-sm ${isFirst ? 'font-medium text-slate-900' : 'text-slate-600'}">${content}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (e) {
    document.getElementById("lista-" + tipo).innerHTML =
      '<div class="flex items-center justify-center p-4 text-red-500 font-medium text-sm bg-red-50 rounded-xl">Erro ao carregar dados.</div>';
  }
}

async function abrirModal(tipo) {
  tipoAtual = tipo;
  
  // Add a loading state to button
  const btn = document.querySelector(`button[data-tipo="${tipo}"]`);
  const originalText = btn.innerHTML;
  btn.innerHTML = `<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
  btn.disabled = true;

  try {
    const res = await fetch("components/" + tipo.slice(0, -1) + "-modal.html");
    let html = await res.text();
    
    // Inject modern styling into existing modal HTML
    // Because we don't want to re-write 6 modal htmls right now, we can just replace classes dynamically here to keep them looking fresh.
    html = html.replace('bg-white rounded max-w-md w-full', 'bg-white/95 backdrop-blur-xl rounded-[2rem] max-w-md w-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 transform transition-all scale-95 opacity-0 duration-300 ease-out');
    html = html.replace('bg-black/50', 'bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 opacity-0');
    html = html.replace('sticky top-0 bg-white border-b border-gray-200 px-6 py-4', 'px-8 py-6 flex justify-between items-center border-b border-slate-100');
    html = html.replace('text-lg font-normal', 'text-2xl font-bold tracking-tight text-slate-900');
    html = html.replace('p-6', 'p-8');
    html = html.replace(/bg-gray-900 text-white hover:bg-gray-800/g, 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5');
    html = html.replace(/focus:ring-gray-900/g, 'focus:ring-indigo-600 focus:border-indigo-600 transition-all');
    html = html.replace(/border-gray-200/g, 'border-slate-200 shadow-sm bg-slate-50/50');
    html = html.replace(/font-normal text-gray-900/g, 'font-medium text-slate-700');
    html = html.replace(/rounded/g, 'rounded-xl');
    
    const container = document.getElementById("modal-container");
    container.innerHTML = html;

    const modal = document.getElementById("modal");
    const modalInner = modal.querySelector('.max-w-md');
    const btnFechar = document.getElementById("btn-fechar-modal");
    const btnCancelar = document.getElementById("btn-cancelar-modal");
    const form = document.getElementById("modal-form");

    modal.classList.remove("hidden");
    
    // Animate in
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
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 mb-6 flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="font-medium">${data.mensagem}</span></div>`;
          setTimeout(() => {
            closeModal();
            carregarLista(tipoAtual);
          }, 1500);
        } else {
          alerta.innerHTML = `<div class="p-4 rounded-xl text-sm bg-rose-50 text-rose-700 border border-rose-100 mb-6 flex items-center gap-2"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg><span class="font-medium">${data.erro}</span></div>`;
          submitBtn.innerHTML = 'Salvar';
          submitBtn.disabled = false;
        }
      } catch (e) {
        alerta.innerHTML = `<div class="p-4 rounded-xl text-sm bg-rose-50 text-rose-700 border border-rose-100 mb-6 flex items-center gap-2"><span class="font-medium">Erro ao conectar com o servidor.</span></div>`;
        submitBtn.innerHTML = 'Salvar';
        submitBtn.disabled = false;
      }
    });
    
  } catch(err) {
    console.error("Modal load error", err);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// Attach event listeners via delegation because buttons are dynamically added
document.addEventListener('click', (e) => {
  if (e.target.closest('.btn-cadastrar')) {
    const btn = e.target.closest('.btn-cadastrar');
    abrirModal(btn.dataset.tipo);
  }
});

carregarListas();
