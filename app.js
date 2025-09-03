
(function(){
  const CONFIG_URL = "./config.json";
  let cfg = null;
  let mode = "direct"; // 'direct' (default) or 'graph'
  const cards = [
    { id: "politicas",    label: "Políticas",                icon: "📜" },
    { id: "manuais",      label: "Manuais",                  icon: "📘" },
    { id: "modelos",      label: "Modelos de Documentos",    icon: "📄" },
    { id: "backoffice",   label: "BackOffice",               icon: "🗂️" },
    { id: "engenharia",   label: "Engenharia",               icon: "🛠️" },
    { id: "negocios",     label: "Negócios",                 icon: "💼" },
    { id: "lmd",          label: "Lista Mestre de Documentos", icon: "🧭" },
  ];

  const grid = document.getElementById('grid');
  const panel = document.getElementById('panel');
  const panelTitle = document.getElementById('panelTitle');
  const panelContent = document.getElementById('panelContent');
  const btnBack = document.getElementById('btnBack');

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = "";
    cards.forEach(c => {
      const el = document.createElement('button');
      el.className = "card bg-white rounded-2xl p-5 text-left shadow-sm hover:shadow-lg";
      el.innerHTML = `
        <div class="text-3xl mb-3">${c.icon}</div>
        <div class="font-semibold text-gray-800">${c.label}</div>
        <div class="text-xs text-gray-500 mt-1">Clique para acessar</div>
      `;
      el.addEventListener('click', () => openPanel(c));
      grid.appendChild(el);
    });
  }

  function switchToPanel() {
    grid.classList.add('hidden');
    panel.classList.remove('hidden');
    btnBack.classList.remove('hidden');
  }

  function backToGrid() {
    panel.classList.add('hidden');
    grid.classList.remove('hidden');
    btnBack.classList.add('hidden');
    panelContent.innerHTML = "";
    panelTitle.textContent = "Documentos";
  }

  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_URL, {cache: 'no-store'});
      cfg = await res.json();
    } catch(e) {
      console.warn("Falha ao carregar config.json, usando defaults", e);
      cfg = { mode: "direct" };
    }
    // wire mode toggles
    document.getElementById('modeDirect')?.addEventListener('click', () => {
      mode = "direct";
      document.getElementById('modeDirect').classList.add('bg-gray-900','text-white');
      document.getElementById('modeGraph').classList.remove('bg-gray-900','text-white');
    });
    document.getElementById('modeGraph')?.addEventListener('click', async () => {
      mode = "graph";
      document.getElementById('modeGraph').classList.add('bg-gray-900','text-white');
      document.getElementById('modeDirect').classList.remove('bg-gray-900','text-white');
      await ensureGraphProvider();
    });
    if (cfg.mode === "graph") {
      mode = "graph";
      document.getElementById('modeGraph').click();
    }
  }

  async function ensureGraphProvider() {
    try {
      if (!window.mgt) {
        console.error("MGT não carregado");
        panelContent.innerHTML = "<div class='text-sm text-red-600'>Microsoft Graph Toolkit não carregado. Verifique a rede/domínio.</div>";
        return;
      }
      try { microsoftTeams.app.initialize(); } catch(e) {}
      const Providers = mgt.Providers;
      const TeamsMsal2Provider = mgt.TeamsMsal2Provider;
      if (!Providers || !TeamsMsal2Provider) return;
      if (Providers.globalProvider && Providers.globalProvider.state === 2) return;
      if (!cfg.aadClientId) return;
      Providers.globalProvider = new TeamsMsal2Provider({
        clientId: cfg.aadClientId,
        authPopupUrl: "./auth.html",
        scopes: ["User.Read", "Files.Read.All", "Sites.Read.All"]
      });
    } catch(e) {
      console.error("Falha no Graph Provider", e);
    }
  }

  function openPanel(card) {
    panelTitle.textContent = card.label;
    switchToPanel();
    if (mode === "graph" && cfg?.sharepoint?.siteId) {
      const area = cfg.sharepoint.areas[card.id];
      if (!area) {
        panelContent.innerHTML = "<div class='text-sm text-red-600'>Área não configurada no config.json</div>";
        return;
      }
      panelContent.innerHTML = `
        <mgt-file-list style="--file-list-box-shadow: none"
          page-size="50"
          site-id="${cfg.sharepoint.siteId}"
          drive-id="${(area.driveId || '')}"
          item-path="${(area.path || '')}">
        </mgt-file-list>
      `;
    } else {
      const area = cfg?.directLinks?.[card.id];
      if (!area) {
        panelContent.innerHTML = "<div class='text-sm text-red-600'>Link direto não configurado no config.json</div>";
        return;
      }
      const html = `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${area.links.map(l => `
            <a class="block border rounded-xl p-4 hover:bg-gray-50" href="${l.url}" target="_blank" rel="noopener">
              <div class="font-medium text-gray-800">${l.name}</div>
              <div class="text-xs text-gray-500 mt-1">Abrir pasta/documentos</div>
            </a>
          `).join('')}
        </div>
        <p class="text-xs text-gray-400 mt-4">Dica: para experiência 100% embedded (sem layout do SharePoint), configure o modo Graph no <code>config.json</code>.</p>
      `;
      panelContent.innerHTML = html;
    }
  }

  // Wire back button
  btnBack?.addEventListener('click', backToGrid);

  // Boot
  document.addEventListener('DOMContentLoaded', function(){
    renderGrid();
    loadConfig();
  });
})();