# TriliumNext Plugin Manager — Contexto do Projeto

## 1. O que é TriliumNext

- Fork do [Trilium Notes](https://github.com/zadam/trilium) mantido pela comunidade
- Node.js 18+, Electron (desktop) + navegador (server), SQLite
- Dois contextos de script:
  - **Frontend** (MIME `application/javascript;env=frontend`) — roda no navegador/Electron, acesso a `api`, `$container`, jQuery
  - **Backend** (MIME `application/javascript;env=backend`) — roda no servidor, acesso a `api`, `require`, SQL direto

## 2. Arquitetura do Plugin Manager

- **Único arquivo:** `trilium-plugin-manager-v4.js`
- Tipo: JS Frontend note (MIME `application/javascript;env=frontend`)
- Renderiza cards de plugins com jQuery + event delegation
- Três fluxos de instalação:
  1. `manifestUrl` → baixa manifest.json, cria múltiplas notas
  2. `sourceUrl` → baixa `.js`/`.jsx`, cria 1 nota code
  3. `zipUrl` → download pro navegador, import manual
- Categorias por tags: Widget, Canvas, UI, Escrita, Ferramentas
- Botão "How to" por plugin se `homepage` existir

## 3. Regras CRÍTICAS (não ignorar)

### API
- `api.runOnBackend(fn, args)` — callback DEVE ser **síncrono** (sem `async`)
- Para callbacks **assíncronos**: usar `api.runAsyncOnBackendWithManualTransactionHandling(fn, args)`
- **NUNCA** chamar ETAPI via HTTP (`http.request`/`fetch`) de dentro de um callback backend → causa **deadlock SQLite**
- JS Frontend usa `api` global direto (`window.parent.api` NÃO existe)
- Inline `onclick` NÃO funciona em JS Frontend → usar event delegation jQuery (`$root.on('click', '.selector', handler)`)

### Rede (backend)
- `fetch()` global NÃO está disponível no backend do TriliumNext Electron
- Para requisições HTTP no backend: usar `require('http')`/`require('https')`
- URL `github.com/user/repo/blob/...` (blob) NÃO retorna raw content → usar `raw.githubusercontent.com/user/repo/...`

### Template literals
- Ao embutir código fonte JS em template literals no JSX, escapar:
  - Backticks: `` \` `` → `` \` ``
  - Interpolações: `${...}` → `\${...}`
  - `$` seguido de letra (ex: `$btn`, `$widget`) NÃO precisa escapar

## 4. Registry Format

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "0.1.0",
  "author": "Name",
  "description": "Description",
  "homepage": "https://github.com/user/repo",
  "tags": ["tag1", "tag2"],
  "sourceUrl": "https://raw.githubusercontent.com/.../plugin.js",
  "manifestUrl": "https://raw.githubusercontent.com/.../manifest.json",
  "zipUrl": "https://github.com/.../archive.zip"
}
```

- Pelo menos um de `sourceUrl`, `manifestUrl` ou `zipUrl` é obrigatório
- `homepage` é opcional — mostra botão "How to" no card

## 5. Manifest Format

```json
{
  "notes": [
    { "title": "Note 1", "type": "text", "content": "..." },
    { "title": "Note 2", "type": "code", "mime": "...", "sourceUrl": "file.js" }
  ],
  "relations": [
    { "type": "renderNote", "from": "Note 1", "to": "Note 2" }
  ],
  "labels": [
    { "note": "Note 2", "name": "readOnly", "value": "" }
  ]
}
```

- `sourceUrl` dentro do manifest pode ser absoluta (`https://raw...`) ou relativa ao manifest
- A primeira nota recebe automático `pluginId`, `pluginVersion`, `pluginName`
- `sourceUrl` com espaços no nome: usar `%20` (ex: `AI%20Code.js`)

## 6. Toolkit Structure

```
TriliumNext-Toolkit/
├── AI-Chat/
│   ├── manifest.json
│   ├── AI Code.js
│   └── AI-Chat/
│       └── AI Code.js
├── Weekly-Planner/
│   ├── manifest.json
│   └── js-planejador.js
├── Shared-Notes/
│   ├── manifest.json
│   ├── shared-notes-widget.js
│   └── shared-notes-handler.js
└── ...
```

## 7. Fluxo de instalação (manifestUrl)

1. Plugin Manager baixa `manifest.json` via `httpGet()`
2. Para cada nota no `notes[]`:
   - Se tem `sourceUrl`: baixa o source (absoluto ou relativo)
   - Se tem `content`: usa direto
   - Cria nota com `api.createNewNote()`
3. Aplica `labels[]` do manifest
4. Cria `relations[]` (ex: `~renderNote`)
5. Marca primeira nota com `pluginId`, `pluginVersion`, `pluginName` (automático)
