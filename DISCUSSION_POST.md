---
title: "🧩 Plugin Manager — install community plugins with one click"
labels: ["show-and-tell", "plugins", "tooling"]
---

## 🧩 Plugin Manager for TriliumNext

I've been working on a **Plugin Manager** that lives inside TriliumNext. It's a self-contained Render Note that fetches a plugin registry, shows a card-based UI, and lets you install / update / uninstall plugins with one click.

### ✨ How it works

- Paste one JS file into a Code note → add `~renderNote` → done
- No external tools, no CLI, no Docker
- Works with a remote registry (GitHub Gist) or local note content
- Updates detected automatically — yellow cards when a new version is available

### 🔌 Two plugin formats

The registry supports two installation methods:

**`sourceUrl` (recommended)** — the registry points directly to a `.js` or `.jsx` file on GitHub. The Plugin Manager downloads the source and creates a Code note. No token needed, no ZIP, no deadlock.

**`zipUrl` (legacy)** — downloads a Trilium export ZIP for manual import. Requires an ETAPI token.

### 🛠 Developer-friendly

I wrote a **[Plugin Developer Guide](https://github.com/ricolandia/Trilium-plugin-manager/blob/main/PLUGIN_DEV_GUIDE.md)** showing how to create plugins in two formats:

1. **Plain JS** — for widgets and tools using `$container` + `api`
2. **JSX Preact** — for full UI components using `import from "trilium:preact"`

Both are single-file, self-contained, and hosted at a public URL. No build tools, no packaging.

### 📦 Included plugins

The example registry already has:

- **Weekly Planner** — kanban-style weekly board (Preact/JSX)
- **Canvas Note Tools** — Excalidraw integration helpers
- **Fountain Renderer** — screenplay rendering
- **Longform Compiler** — subtree aggregation
- **AI Chat** — OpenRouter-powered chat widget
- **Pomodoro Timer** — time tracker
- **Word Counter** — right-panel word/char count

### 📖 Resources

- **GitHub repo:** [github.com/ricolandia/Trilium-plugin-manager](https://github.com/ricolandia/Trilium-plugin-manager)
- **Plugin Developer Guide:** see `PLUGIN_DEV_GUIDE.md` in the repo
- **Try it:** paste `trilium-plugin-manager-v4.js` into a Code note with MIME `application/javascript;env=frontend`, add `~renderNote`, done

### 🙌 Call for plugins

I'd love to see more community plugins in the registry! If you have a TriliumNext tool or widget:

1. Host it as a single `.js` or `.jsx` file on GitHub
2. Add an entry to your `registry.json` with `sourceUrl`
3. Open a PR adding it to the example registry

The developer guide covers everything — format, MIME types, backend API rules, registry fields, best practices.

Let me know what you think! Feedback, issues, and plugin submissions are all welcome.
