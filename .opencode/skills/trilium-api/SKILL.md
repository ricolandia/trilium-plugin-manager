# Skill: TriliumNext API Specialist

## Domain
TriliumNext scripting API — frontend and backend contexts.

## Key Rules

### Frontend API (MIME: `application/javascript;env=frontend`)
- `api` is a global variable — do NOT use `window.parent.api`
- `$container` is a jQuery element — use it as root for rendering HTML
- All `api.*` methods return Promises (await them)
- `api.runOnBackend(syncCallback, args)` — callback MUST be synchronous (no `async`, no `await`)
- For async backend code: use `api.runAsyncOnBackendWithManualTransactionHandling(asyncCallback, args)`
- NEVER call `onclick=` in HTML — use jQuery event delegation: `$root.on('click', '.selector', handler)`
- NEVER call ETAPI endpoints via HTTP from inside a backend callback → causes SQLite deadlock
- `fetch()` is available in frontend context (browser) — use it freely

### Backend API (MIME: `application/javascript;env=backend`)
- `api.req` and `api.res` are available for custom request handlers
- `api.sql.getRows(query)` for direct SQL
- `api.getNote(noteId)`, `api.searchForNotes(query)`, `api.getNoteWithLabel(label)`
- `api.createNewNote({ parentNoteId, title, content, type, mime })` — returns `{ note }`
- `note.setAttribute('label', name, value)`, `note.setRelation(type, targetNoteId)`
- `note.getContent()`, `note.setContent(content)`, `note.save()`
- `note.getChildNotes()`, `note.getAttribute('label', name)`
- Most backend API methods are SYNCHRONOUS — no `await` needed (except `save()`, `delete()`)

### Networking (backend)
- `fetch()` is NOT available in backend (Electron). Use `require('http')` / `require('https')`
- `require('http')` and `require('https')` are available — use `http.get()` / `https.get()` for downloads
- `http.request()` for POST requests with custom body
- GitHub raw content: use `raw.githubusercontent.com`, NOT `github.com/blob/`

### Critical Anti-patterns (NEVER do)
- `api.runOnBackend(async () => {...})` → will crash with "async not supported"
- ETAPI call from inside `runAsyncOnBackendWithManualTransactionHandling` → SQLite deadlock
- Inline `onclick` in HTML → ReferenceError (function not in scope)
- `parent.api.*` → `api` is global, not on parent window
- `Buffer` as `fetch()` body in Electron/Uint8Array — may crash

## When to consult this skill
- Before writing any code that uses `api.*` methods
- When choosing between `runOnBackend` vs `runAsyncOnBackendWithManualTransactionHandling`
- When making HTTP requests from backend context
- When creating or modifying notes programmatically
