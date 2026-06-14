// Componente Global de Notificações
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // 1. Injetar o Sino de Notificação no Header
  const header = document.querySelector('header');
  if (header) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'relative flex items-center ml-4';
    notificationContainer.innerHTML = `
      <button id="btn-notificacoes" class="p-2 relative text-slate-500 hover:text-slate-800 transition rounded-full hover:bg-slate-100">
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
        <span id="notificacoes-badge" class="hidden absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">0</span>
      </button>

      <div id="notificacoes-dropdown" class="hidden absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 shadow-xl rounded-2xl z-50 overflow-hidden transform opacity-0 scale-95 transition-all duration-200">
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-slate-800">Notificações</h3>
          <button id="btn-ler-todas" class="text-xs text-teal-600 hover:text-teal-700 font-medium">Ler todas</button>
        </div>
        <div id="notificacoes-lista" class="max-h-80 overflow-y-auto divide-y divide-slate-100">
          <!-- Lista carregada via JS -->
        </div>
      </div>
    `;

    // Anexa o container no final do header para funcionar em todos os layouts
    header.appendChild(notificationContainer);

    // Comportamento do Dropdown
    const btn = document.getElementById('btn-notificacoes');
    const dropdown = document.getElementById('notificacoes-dropdown');
    
    btn.addEventListener('click', () => {
      if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        setTimeout(() => dropdown.classList.remove('opacity-0', 'scale-95'), 10);
      } else {
        dropdown.classList.add('opacity-0', 'scale-95');
        setTimeout(() => dropdown.classList.add('hidden'), 200);
      }
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!notificationContainer.contains(e.target)) {
        dropdown.classList.add('opacity-0', 'scale-95');
        setTimeout(() => dropdown.classList.add('hidden'), 200);
      }
    });

    document.getElementById('btn-ler-todas').addEventListener('click', async () => {
      await fetch('/api/notificacoes/ler-todas', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      carregarNotificacoes();
    });
  }

  // 2. Injetar o Container de Toasts
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none';
  document.body.appendChild(toastContainer);

  let notifiedIds = new Set();

  function showToast(notificacao) {
    const toast = document.createElement('div');
    toast.className = 'bg-white border border-slate-200 shadow-xl rounded-xl p-4 w-80 transform translate-x-full transition-all duration-300 pointer-events-auto flex gap-3 items-start';
    
    const colors = notificacao.tipo === 'SUCCESS' ? 'text-emerald-500 bg-emerald-50' : 'text-teal-500 bg-teal-50';
    
    toast.innerHTML = `
      <div class="p-2 rounded-lg ${colors} flex-shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
      </div>
      <div>
        <h4 class="text-sm font-bold text-slate-800">Nova Atualização</h4>
        <p class="text-sm text-slate-600 mt-0.5 leading-tight">${notificacao.mensagem}</p>
      </div>
    `;
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-x-full'), 10);
    
    // Animate out after 5s
    setTimeout(() => {
      toast.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  async function carregarNotificacoes() {
    try {
      const res = await fetch('/api/notificacoes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!Array.isArray(data)) return;

      const naoLidas = data.filter(n => !n.lida);
      
      // Atualizar Badge
      const badge = document.getElementById('notificacoes-badge');
      if (badge) {
        if (naoLidas.length > 0) {
          badge.textContent = naoLidas.length;
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      }

      // Atualizar Dropdown
      const lista = document.getElementById('notificacoes-lista');
      if (lista) {
        if (data.length === 0) {
          lista.innerHTML = '<div class="p-6 text-center text-sm text-slate-500">Nenhuma notificação</div>';
        } else {
          lista.innerHTML = data.map(n => `
            <div class="p-4 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start ${!n.lida ? 'bg-teal-50/30' : ''}" onclick="marcarLida(${n.id})">
              <div class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.lida ? 'bg-teal-500' : 'bg-transparent'}"></div>
              <div>
                <p class="text-sm text-slate-800 ${!n.lida ? 'font-medium' : ''}">${n.mensagem}</p>
                <span class="text-xs text-slate-400 mt-1 block">${new Date(n.created_at).toLocaleString('pt-BR')}</span>
              </div>
            </div>
          `).join('');
        }
      }

      // Disparar Toasts para as novas (só se for o poll subseqüente)
      if (notifiedIds.size > 0) {
        naoLidas.forEach(n => {
          if (!notifiedIds.has(n.id)) {
            showToast(n);
          }
        });
      }
      
      // Update cache
      data.forEach(n => notifiedIds.add(n.id));

    } catch (e) {
      console.error('Erro ao buscar notificações');
    }
  }

  window.marcarLida = async function(id) {
    await fetch(`/api/notificacoes/${id}/ler`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    carregarNotificacoes();
  };

  // Primeira carga e Polling de 10s
  carregarNotificacoes();
  setInterval(carregarNotificacoes, 10000);
});
