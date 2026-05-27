# Skill: Registry Manager

## Domain
Managing `registry.json` — the catalog of plugins for the Plugin Manager.

## Registry Structure

```json
{
  "meta": {
    "name": "TriliumNext Plugins — Official Registry",
    "author": "ricolandia",
    "description": "Plugin registry for TriliumNext Plugin Manager.",
    "homepage": "https://github.com/ricolandia/trilium-plugin-manager",
    "updated": "2025-05-26"
  },
  "plugins": [
    {
      "id": "my-plugin",
      "name": "My Plugin",
      "description": "Short description.",
      "version": "0.6.0",
      "author": "Author Name",
      "homepage": "https://github.com/user/repo",
      "tags": ["tag1", "tag2"],
      "sourceUrl": "https://raw.githubusercontent.com/.../plugin.js",
      "manifestUrl": "https://raw.githubusercontent.com/.../manifest.json",
      "zipUrl": "https://github.com/.../archive.zip"
    }
  ]
}
```

## Field rules

| Field | Required | Notes |
|-------|:--------:|-------|
| `id` | ✅ | Unique. Used to track installed state. Never change after publishing. |
| `name` | ✅ | Display name on the card. |
| `version` | ✅ | Semver string. Compared against installed `#pluginVersion`. |
| `author` | | Shown on the card. |
| `description` | | Shown on the card. |
| `tags` | | Determines category (Widget/Canvas/UI/Writing/Tools). |
| `homepage` | | Shows "How to" button on the card. |
| `sourceUrl` | | Single-file plugin. Raw URL. |
| `manifestUrl` | | Multi-note plugin. Raw URL to manifest.json. |
| `zipUrl` | | Legacy fallback. GitHub URL (blob). |

At least one of `sourceUrl`, `manifestUrl` or `zipUrl` must exist.

## URL format

- `sourceUrl` and `manifestUrl`: ALWAYS `raw.githubusercontent.com/...`
- `zipUrl`: GitHub URL (can be `github.com/.../blob/...`)
- `homepage`: GitHub tree URL (`github.com/.../tree/main/Folder`)

## Version rules

- Semver: `0.6.0`, `1.0.0`, `0.1.9`
- Higher version = newer. Compared by `semverGt()` in the Plugin Manager.
- Update `version` when the plugin source changes.

## Category mapping (tags → category)

| Category | Matching tags |
|----------|---------------|
| Widget | widget, pomodoro, timer, word, counter, ai, chat, openrouter |
| Canvas | canvas, excalidraw, visual, templates |
| Writing | writing, screenplay, comics, render, export, longform |
| UI | kanban, planning, board, productivity |
| Tools | notes, cleaner, attribute, share, comment, network |

## Publishing checklist

- [ ] Plugin files (source + manifest) are uploaded to Toolkit
- [ ] `sourceUrl`/`manifestUrl` tested by visiting the raw URL in browser
- [ ] `homepage` points to the Toolkit tree folder
- [ ] `tags` include at least one keyword from the category mapping
- [ ] `version` is higher than the previous entry (if updating)
- [ ] `id` is unique across all entries
- [ ] JSON is valid (no trailing commas, no syntax errors)

## When to consult this skill
- Adding a new plugin to the registry
- Updating a plugin's version, URL, or metadata
- Correcting registry field values
- Reviewing a pull request that modifies registry.json
