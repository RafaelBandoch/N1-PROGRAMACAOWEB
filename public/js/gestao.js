

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
    html = html.replace(/focus:ring-indigo-600/g, 'focus:ring-zinc-400');
    html = html.replace(/focus:border-indigo-600/g, 'focus:border-zinc-400');
    html = html.replace('text-slate-900', 'text-white');
    html = html.replace('text-gray-400', 'text-zinc-500');
    html = html.replace(/text-slate-900/g, 'text-zinc-100');
    html = html.replace(/bg-indigo-600/g, 'bg-white');
    html = html.replace(/hover:bg-indigo-700/g, 'hover:bg-zinc-200');
    html = html.replace(/text-white/g, 'text-black');
    html = html.replace(/shadow-indigo-200/g, 'shadow-none');
    html = html.replace(/hover:shadow-indigo-300/g, 'shadow-none');

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

    const table = document.createElement("table");
    table.className = "w-full text-left text-sm";
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
        if (col.toLowerCase().includes("status")) {
          const classes = STATUS_COLORS[content] || "bg-slate-100 text-slate-600 ring-slate-500/10";
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
  } catch {
    listaConteudo.innerHTML = '<div class="text-rose-400 py-12 text-center">Erro ao carregar dados da API</div>';
  }
}

window.addEventListener('load', () => {
  const firstBtn = document.querySelector('[data-tipo="usuarios"]');
  if (firstBtn) {
    updateTabsUI(firstBtn);
    titutoLista.textContent = "Usuários";
    carregarLista(true);
  }
});