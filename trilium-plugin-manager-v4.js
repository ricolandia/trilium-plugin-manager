// ════════════════════════════════════════════════════════════════
//  TriliumNext Plugin Manager — Render Note (JS Frontend)
// ════════════════════════════════════════════════════════════════
//  Modo de usar:
//    1. Crie uma nota do tipo "Code" com MIME "application/javascript;env=frontend"
//    2. Cole este código
//    3. Adicione ~renderNote apontando para a nota onde quer exibir o painel
//    4. Abra a nota de destino (ou a nota Render, se for nota separada)
// ════════════════════════════════════════════════════════════════

const $root = $container;

$root.html(`
<style>
  /* ── Variáveis: herda o tema do Trilium, com fallbacks ── */
  :root {
    --bg:       var(--main-background-color,   #16161e);
    --surface:  var(--accented-background-color, #1f1f2e);
    --border:   var(--main-border-color,         #2e2e42);
    --text:     var(--main-text-color,           #c0caf5);
    --muted:    var(--muted-text-color,          #565f89);
    --accent:   #7aa2f7;
    --green:    #9ece6a;
    --red:      #f7768e;
    --yellow:   #e0af68;
    --r:        8px;
    --mono:     'JetBrains Mono', 'Fira Mono', monospace;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pm-container {
    font-family: var(--font-family, 'Segoe UI', system-ui, sans-serif);
    background: transparent;
    color: var(--text);
    padding: 20px 24px 40px;
    font-size: 14px;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .header-left h1 {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .header-left p {
    color: var(--muted);
    font-size: 0.8rem;
    margin-top: 3px;
  }
  .btn-refresh {
    padding: 5px 12px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--r);
    color: var(--muted);
    font-size: 0.8rem;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }
  .btn-refresh:hover { color: var(--text); border-color: var(--accent); }

  /* ── Config banner ── */
  .banner {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: var(--r);
    margin-bottom: 20px;
    font-size: 0.82rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    transition: all 0.2s;
  }
  .banner.ok     { border-color: var(--green); color: var(--green); }
  .banner.warn   { border-color: var(--yellow); color: var(--yellow); }
  .banner.error  { border-color: var(--red);   color: var(--red); }
  .banner .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
  }

  /* ── Grid de cards ── */
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 14px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    transition: border-color 0.15s, transform 0.1s;
  }
  .card:hover { border-color: var(--accent); transform: translateY(-1px); }
  .card.is-installed { border-color: var(--green); }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }
  .card-name {
    font-weight: 600;
    font-size: 0.95rem;
  }
  .card-version {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--muted);
    background: var(--bg);
    padding: 2px 8px;
    border-radius: 99px;
    white-space: nowrap;
    border: 1px solid var(--border);
  }
  .card-author {
    font-size: 0.78rem;
    color: var(--muted);
  }
  .card-desc {
    font-size: 0.85rem;
    line-height: 1.55;
    color: var(--text);
    flex-grow: 1;
  }
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .tag {
    font-size: 0.7rem;
    padding: 2px 8px;
    border-radius: 99px;
    background: var(--bg);
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 6px;
    border-top: 1px solid var(--border);
    margin-top: auto;
  }
  .badge-ok {
    font-size: 0.75rem;
    color: var(--green);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* ── Botões ── */
  .btn {
    padding: 6px 14px;
    border-radius: 6px;
    border: none;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.1s;
  }
  .btn:hover:not(:disabled) { opacity: 0.85; transform: scale(0.98); }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-install {
    background: var(--accent);
    color: #16161e;
  }
  .btn-reinstall {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.75rem;
  }
  .btn-reinstall:hover { border-color: var(--accent); color: var(--accent); }
  .btn-download {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .btn-download:hover { border-color: var(--accent); color: var(--accent); }
  .btn-howto {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.75rem;
    padding: 4px 8px;
    float: left;
  }
  .btn-howto:hover { border-color: var(--accent); color: var(--accent); }

  /* ── Estados ── */
  .state-center {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  .state-center .icon { font-size: 2rem; margin-bottom: 12px; }
  .state-center p { font-size: 0.85rem; line-height: 1.6; }
  .state-center code {
    font-family: var(--mono);
    background: var(--surface);
    padding: 1px 6px;
    border-radius: 4px;
    border: 1px solid var(--border);
    color: var(--yellow);
  }

  /* ── Toast ── */
  .toast {
    position: fixed;
    bottom: 18px; right: 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 10px 16px;
    font-size: 0.82rem;
    z-index: 9999;
    max-width: 280px;
    animation: toastIn 0.2s cubic-bezier(.22,1,.36,1);
  }
  .toast.ok    { border-color: var(--green); color: var(--green); }
  .toast.error { border-color: var(--red);   color: var(--red); }
  @keyframes toastIn {
    from { transform: translateY(14px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  /* ── Source pill (remote/local) ── */
  .source-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 18px;
    font-size: 0.78rem;
    color: var(--muted);
  }
  .source-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 2px 10px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--muted);
  }
  .source-pill.remote { border-color: var(--accent); color: var(--accent); }
  .source-pill.local  { border-color: var(--yellow); color: var(--yellow); }
  .source-pill.error  { border-color: var(--red);    color: var(--red); }
  .source-pill .icon-s { font-style: normal; }

  .badge-update {
    font-size: 0.75rem;
    color: var(--yellow);
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .btn-update {
    background: var(--yellow);
    color: #16161e;
    font-size: 0.82rem;
  }
  .card.has-update { border-color: var(--yellow); }

  .btn-uninstall {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--red);
    font-size: 0.75rem;
    padding: 6px 10px;
  }
  .btn-uninstall:hover { border-color: var(--red); background: color-mix(in srgb, var(--red) 10%, transparent); }

  /* ── Spinner inline ── */
  .spinner {
    display: inline-block;
    width: 10px; height: 10px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    vertical-align: middle;
    margin-right: 4px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
</style>

<div class="pm-container">

<div class="header">
  <div class="header-left">
    <h1>🧩 Plugin Manager</h1>
    <p>Gerencie plugins do TriliumNext</p>
  </div>
  <button class="btn-refresh">↻ Atualizar</button>
</div>

<div id="banner" class="banner">
  <div class="dot"></div>
  <span>Inicializando...</span>
</div>

<div id="source-bar" class="source-bar" style="display:none">
  <span>Registry:</span>
  <span id="source-pill" class="source-pill"></span>
  <span id="source-ts"></span>
</div>

<div id="content">
  <div class="state-center"><div class="icon">⏳</div><p>Carregando registry...</p></div>
</div>

</div>
`);

// ════════════════════════════════════════════════════════════════
//  CONFIG — atributos (labels) necessários no Trilium:
//
//  Na nota com #pluginRegistry:
//    #etapiToken    → token gerado em Options > ETAPI  (opcional — só necessário se o registry usar zipUrl)
//    #triliumPort   → porta do Trilium (padrão: 37840) (opcional)
//    #registryUrl   → URL remota do JSON do registry   (opcional)
//                     ex: https://gist.githubusercontent.com/user/id/raw/registry.json
//                     Se ausente, usa o conteúdo local da nota como fallback.
//
//  Notas com esses atributos:
//    #installedPlugins  → nota "Installed" (recebe os imports de ZIP)
//    #pluginRegistry    → nota com JSON local + labels de config
// ════════════════════════════════════════════════════════════════

let CFG = {};
let installedMap = new Map(); // pluginId → versão instalada
let pluginsMap = {};          // pluginId → objeto do plugin (para event delegation)

// ── INIT ─────────────────────────────────────────────────────────
async function init() {
  setBanner('Conectando ao backend...', '');
  setContent('<div class="state-center"><div class="icon">⏳</div><p>Carregando...</p></div>');
  $root.find('#source-bar').hide();

  try {
    const data = await api.runAsyncOnBackendWithManualTransactionHandling(async () => {
      const registryNote  = api.getNoteWithLabel('pluginRegistry');
      const installedNote = api.getNoteWithLabel('installedPlugins');

      if (!registryNote)  throw new Error('Nota com #pluginRegistry não encontrada.');
      if (!installedNote) throw new Error('Nota com #installedPlugins não encontrada.');

      const etapiToken  = registryNote.getAttribute('label', 'etapiToken')?.value;
      const port        = parseInt(registryNote.getAttribute('label', 'triliumPort')?.value || '0') || 37840;
      const registryUrl = registryNote.getAttribute('label', 'registryUrl')?.value || null;

      // Plugins já instalados — retorna { id → version }
      const installedChildren = await installedNote.getChildNotes();
      const installedVersions = {};
      for (const n of installedChildren) {
        const id  = n.getAttribute('label', 'pluginId')?.value;
        const ver = n.getAttribute('label', 'pluginVersion')?.value || '0.0.0';
        if (id) installedVersions[id] = ver;
      }

      // ── Fetch do registry: remoto com fallback local ──────────
      let registryContent = null;
      let source          = 'local';    // 'remote' | 'local' | 'fallback'
      let fetchError      = null;
      let fetchedAt       = new Date().toISOString();

      if (registryUrl) {
        try {
          const resp = await fetch(registryUrl, {
            headers: { 'Cache-Control': 'no-cache' }   // sempre busca versão fresca
          });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          registryContent = await resp.text();
          source = 'remote';
        } catch (err) {
          fetchError = err.message;
          source = 'fallback';
          // cai no conteúdo local abaixo
        }
      }

      if (!registryContent) {
        registryContent = await registryNote.getContent();
        if (source !== 'fallback') source = 'local';
      }

      return {
        etapiToken,
        port,
        registryUrl,
        installedNoteId: installedNote.noteId,
        installedVersions,
        registry: registryContent,
        source,
        fetchError,
        fetchedAt,
        serverOrigin: registryNote.getAttribute('label', 'serverOrigin')?.value || null
      };
    }, []);

    CFG = {
      etapiToken:      data.etapiToken,
      port:            data.port,
      installedNoteId: data.installedNoteId,
      serverOrigin:    data.serverOrigin || window.location.origin
    };
    installedMap = new Map(Object.entries(data.installedVersions));

    // Valida token (opcional — só necessário para registry com zipUrl)
    if (!CFG.etapiToken) {
      setBanner('Token ETAPI não configurado. Instalação via sourceUrl funciona sem ele, mas plugins zipUrl exigem token em Options > ETAPI.', 'warn');
    }

    // Parse plugins para contar updates antes do banner
    let plugins = [];
    try { plugins = JSON.parse(data.registry).plugins || []; }
    catch { setBanner('Erro ao parsear o JSON do registry.', 'error'); return; }

    const updateCount = plugins.filter(p =>
      installedMap.has(p.id) && semverGt(p.version, installedMap.get(p.id))
    ).length;

    const updateNote = updateCount > 0 ? ` · 🔔 ${updateCount} update(s) disponível(is)` : '';
    setBanner(
      `Conectado · porta ${CFG.port} · ${installedMap.size} plugin(s) instalado(s)${updateNote}`,
      updateCount > 0 ? 'warn' : 'ok'
    );

    setSourcePill(data.source, data.registryUrl, data.fetchedAt, data.fetchError);
    renderPlugins(plugins);

  } catch (err) {
    setBanner('Erro: ' + err.message, 'error');
    setContent('<div class="state-center"><div class="icon">⚠</div><p>' + escHtml(err.message) + '</p></div>');
    console.error('[PluginManager]', err);
  }
}

// ── SOURCE PILL ──────────────────────────────────────────────────
function setSourcePill(source, url, fetchedAt, fetchError) {
  const bar  = $root.find('#source-bar');
  const pill = $root.find('#source-pill');
  const ts   = $root.find('#source-ts');

  const labels = {
    remote:   { icon: '🌐', text: url ? shortenUrl(url) : 'remoto',    cls: 'remote' },
    local:    { icon: '📄', text: 'nota local',                         cls: 'local'  },
    fallback: { icon: '⚠', text: 'fallback local (fetch falhou)',       cls: 'error'  }
  };
  const cfg = labels[source] || labels.local;

  pill.attr('class', 'source-pill ' + cfg.cls);
  pill.html('<i class="icon-s">' + cfg.icon + '</i> ' + escHtml(cfg.text));

  const d = new Date(fetchedAt);
  const hm = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  ts.text('· atualizado às ' + hm + (fetchError ? ' · erro: ' + fetchError : ''));

  bar.css('display', 'flex');
}

function shortenUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.length > 30 ? u.pathname.slice(0, 28) + '…' : u.pathname;
    return u.hostname + path;
  } catch { return url.slice(0, 40) + '…'; }
}

// ── RENDER ───────────────────────────────────────────────────────
function renderPlugins(plugins) {
  pluginsMap = {};
  for (const p of plugins) pluginsMap[p.id] = p;
  if (!plugins.length) {
    setContent(`<div class="state-center">
      <div class="icon">📭</div>
      <p>Nenhum plugin no registry.<br>
      Edite a nota com <code>#pluginRegistry</code> para adicionar plugins.</p>
    </div>`);
    return;
  }
  setContent('<div class="grid">' + plugins.map(p => cardHTML(p)).join('') + '</div>');
}

function cardHTML(p) {
  const installedVer = installedMap.get(p.id);
  const isInstalled  = installedVer !== undefined;
  const hasUpdate    = isInstalled && semverGt(p.version, installedVer);
  const hasSourceUrl = !!p.sourceUrl;
  const btnLabel     = hasSourceUrl ? 'Instalar' : 'Baixar ZIP';
  const btnClass     = hasSourceUrl ? 'btn-install' : 'btn-download';

  const tagsHtml = (p.tags || []).map(t => `<span class="tag">${escHtml(t)}</span>`).join('');
  const hasHowto = !!p.homepage;

  let howtoHtml = hasHowto
    ? `<button class="btn btn-howto" data-plugin-id="${escHtml(p.id)}">📖 How to</button>`
    : '';

  let cardClass  = 'card';
  let footerHtml = '';

  if (!isInstalled) {
    cardClass  = 'card';
    footerHtml = `${howtoHtml}
      <span></span>
      <button class="btn ${btnClass}" data-plugin-id="${escHtml(p.id)}">${btnLabel}</button>`;
  } else if (hasUpdate) {
    cardClass  = 'card has-update';
    footerHtml = `${howtoHtml}
      <span class="badge-update">↑ v${escHtml(installedVer)} → v${escHtml(p.version)}</span>
      <div style="display:flex;gap:6px">
        <button class="btn ${btnClass}" data-plugin-id="${escHtml(p.id)}">${btnLabel}</button>
        <button class="btn btn-uninstall" data-plugin-id="${escHtml(p.id)}">✕</button>
      </div>`;
  } else {
    cardClass  = 'card is-installed';
    footerHtml = `${howtoHtml}
      <span class="badge-ok">✓ v${escHtml(installedVer)}</span>
      <div style="display:flex;gap:6px">
        <button class="btn btn-reinstall" data-plugin-id="${escHtml(p.id)}">↺</button>
        <button class="btn btn-uninstall" data-plugin-id="${escHtml(p.id)}">✕</button>
      </div>`;
  }

  return `
    <div class="${cardClass}" id="card-${p.id}">
      <div class="card-top">
        <div class="card-name">${escHtml(p.name)}</div>
        <div class="card-version">v${escHtml(p.version)}</div>
      </div>
      <div class="card-author">por ${escHtml(p.author || '—')}</div>
      <div class="card-desc">${escHtml(p.description || '')}</div>
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
      <div class="card-footer">${footerHtml}</div>
    </div>`;
}

// ── INSTALL ──────────────────────────────────────────────────────
async function installPlugin(p, btn) {
  if (!btn) btn = $root.find(`[data-plugin-id="${p.id}"]`).first();
  if (btn.length) { btn.prop('disabled', true); btn.html('<span class="spinner"></span>Instalando...'); }

  try {
    if (p.sourceUrl) {
      // ── Fluxo sourceUrl: baixa o .js/.jsx e cria nota code diretamente ──
      btn.html('<span class="spinner"></span>Baixando...');
      const noteId = await api.runAsyncOnBackendWithManualTransactionHandling(
        async (sourceUrl, parentNoteId, pluginId, pluginVersion, pluginName) => {
          function httpGet(url, depth) {
            if ((depth || 0) > 5) return Promise.reject(new Error('Muitos redirects'));
            return new Promise((resolve, reject) => {
              const mod = url.startsWith('https') ? require('https') : require('http');
              mod.get(url, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                  res.resume();
                  return httpGet(res.headers.location, (depth || 0) + 1).then(resolve, reject);
                }
                if (res.statusCode >= 400) { res.resume(); return reject(new Error(`HTTP ${res.statusCode}`)); }
                const chunks = [];
                res.on('data', c => chunks.push(c));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
              }).on('error', reject)
                .setTimeout(30000, function() { this.destroy(); reject(new Error('Timeout (30s)')); });
            });
          }
          const buf = await httpGet(sourceUrl);
          if (!buf.length) throw new Error('Source vazio: ' + sourceUrl);
          const source = buf.toString('utf-8');

          const mime = sourceUrl.endsWith('.jsx')
            ? 'application/javascript;env=frontend'
            : 'application/javascript;env=frontend';

          const created = await api.createNewNote({
            parentNoteId,
            title: pluginName,
            content: source,
            type: 'code',
            mime
          });
          const note = created.note;
          await note.setAttribute('label', 'pluginId',      pluginId);
          await note.setAttribute('label', 'pluginVersion', pluginVersion);
          await note.setAttribute('label', 'pluginName',    pluginName);
          return note.noteId;
        },
        [p.sourceUrl, CFG.installedNoteId, p.id, p.version, p.name]
      );

      installedMap.set(p.id, p.version);
      showToast(`✓ ${p.name} v${p.version} instalado!`, 'ok');

      const card = $root.find('#card-' + p.id);
      if (card.length) {
        card.attr('class', 'card is-installed');
        card.find('.card-footer').html(
          `<span class="badge-ok">✓ v${escHtml(p.version)}</span>
           <div style="display:flex;gap:6px">
             <button class="btn btn-reinstall" data-plugin-id="${escHtml(p.id)}">↺</button>
             <button class="btn btn-uninstall" data-plugin-id="${escHtml(p.id)}">✕</button>
           </div>`
        );
      }

    } else if (p.zipUrl) {
      // ── Fluxo zipUrl: download do ZIP para o usuário instalar manualmente ──
      const a = document.createElement('a');
      a.href = p.zipUrl;
      a.download = (p.name || 'plugin') + '.zip';
      a.target = '_blank';
      a.rel = 'noopener';
      a.click();
      showToast(`📥 ${p.name} — ZIP baixado. Importe manualmente em Options > Import`, 'ok');
      if (btn.length) { btn.prop('disabled', false); btn.text('Baixar'); }

    } else {
      throw new Error('Plugin sem sourceUrl nem zipUrl');
    }

  } catch (err) {
    showToast(`✗ ${p.name}: ${err.message || err || 'Erro desconhecido'}`, 'error');
    if (btn.length) { btn.prop('disabled', false); btn.text('Instalar'); }
    console.error('[PluginManager] install error:', err);
  }
}

// ── UNINSTALL ────────────────────────────────────────────────────
async function uninstallPlugin(p, btn) {
  if (!btn) btn = $root.find(`[data-plugin-id="${p.id}"]`).first();
  if (btn.length) { btn.prop('disabled', true); btn.html('<span class="spinner"></span>'); }

  try {
    await api.runAsyncOnBackendWithManualTransactionHandling(async (installedNoteId, pluginId) => {
      try {
        const installedNote   = await api.getNote(installedNoteId);
        const children = await installedNote.getChildNotes();
        const target   = children.find(n => n.getAttribute('label', 'pluginId')?.value === pluginId);
        if (!target) throw new Error(`Nota do plugin "${pluginId}" não encontrada em Installed.`);
        await target.delete();
      } catch (err) {
        console.error('[PluginManager] backend uninstall err:', err);
        throw new Error(String(err?.message || err || 'Erro desconhecido no backend'));
      }
    }, [CFG.installedNoteId, p.id]);

    installedMap.delete(p.id);
    showToast(`🗑 ${p.name} removido.`, 'ok');

    // Volta o card ao estado "não instalado"
    const card = $root.find('#card-' + p.id);
    if (card.length) {
      const hasSrc = !!p.sourceUrl;
      card.attr('class', 'card');
      card.find('.card-footer').html(
        `<span></span>
         <button class="btn ${hasSrc ? 'btn-install' : 'btn-download'}" data-plugin-id="${escHtml(p.id)}">${hasSrc ? 'Instalar' : 'Baixar ZIP'}</button>`
      );
    }

  } catch (err) {
    showToast(`✗ ${err.message || err || 'Erro desconhecido'}`, 'error');
    if (btn.length) { btn.prop('disabled', false); btn.text('✕'); }
    console.error('[PluginManager] uninstall error:', err);
  }
}

// ── UTILS ────────────────────────────────────────────────────────
function semverGt(a, b) {
  const parse = v => String(v || '0').split('.').map(n => parseInt(n) || 0);
  const [a1, a2, a3] = parse(a);
  const [b1, b2, b3] = parse(b);
  if (a1 !== b1) return a1 > b1;
  if (a2 !== b2) return a2 > b2;
  return a3 > b3;
}

function setBanner(msg, type) {
  const el = $root.find('#banner');
  el.attr('class', 'banner ' + (type || ''));
  el.html('<div class="dot"></div><span>' + escHtml(msg) + '</span>');
}

function setContent(html) {
  $root.find('#content').html(html);
}

function escHtml(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type) {
  const t = Object.assign(document.createElement('div'), {
    className: 'toast ' + type,
    textContent: msg
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 4000);
}

// ── EVENT DELEGATION ─────────────────────────────────────────────
$root.find('.btn-refresh').on('click', init);

$root.on('click', '.btn-install, .btn-update, .btn-reinstall, .btn-download', function(e) {
  const $btn = $(this);
  const p = pluginsMap[$btn.data('plugin-id')];
  if (p) installPlugin(p, $btn);
});

$root.on('click', '.btn-uninstall', function(e) {
  const $btn = $(this);
  const p = pluginsMap[$btn.data('plugin-id')];
  if (p) uninstallPlugin(p, $btn);
});

$root.on('click', '.btn-howto', function(e) {
  e.preventDefault();
  const p = pluginsMap[$(this).data('plugin-id')];
  if (p && p.homepage) window.open(p.homepage, '_blank', 'noopener');
});

// ── START ─────────────────────────────────────────────────────────
init();
