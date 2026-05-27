# Skill: Manifest Designer

## Domain
Designing and validating `manifest.json` files for multi-note TriliumNext plugins.

## Manifest Format

```json
{
  "notes": [
    {
      "title": "Plugin Name",
      "type": "text",
      "content": "Description text shown when user opens the note."
    },
    {
      "title": "Plugin Code",
      "type": "code",
      "mime": "application/javascript;env=frontend",
      "sourceUrl": "plugin.js"
    }
  ],
  "relations": [
    { "type": "renderNote", "from": "Plugin Name", "to": "Plugin Code" }
  ],
  "labels": [
    { "note": "Plugin Code", "name": "readOnly", "value": "" }
  ]
}
```

## Source URL rules

- Can be ABSOLUTE: `https://raw.githubusercontent.com/user/repo/main/plugin.js`
- Can be RELATIVE to the manifest: `plugin.js` resolves to `/user/repo/main/folder/plugin.js`
- If relative: the manifest's base URL is derived from `manifestUrl`
- **MUST** use `raw.githubusercontent.com`, NEVER `github.com/user/repo/blob/...`
- Filenames with spaces: replace with `%20` (e.g. `AI%20Code.js`)

## Note types

| type | mime | When to use |
|------|------|-------------|
| `text` | — | Render note, config, instructions |
| `code` | `application/javascript;env=frontend` | JS Frontend scripts, widgets |
| `code` | `application/javascript;env=backend` | Backend request handlers |
| `code` | `application/json` | Data/state notes |

## Labels

- Each label entry: `{ "note": "Note Title", "name": "labelName", "value": "labelValue" }`
- If no value: `"value": ""`
- Labels with values: `{ "note": "X", "name": "myLabel", "value": "myValue" }` → `#myLabel=myValue`
- Labels without values: `{ "note": "X", "name": "myLabel", "value": "" }` → `#myLabel`
- Relations: `{ "type": "renderNote", "from": "Source Title", "to": "Target Title" }`
- FROM and TO must match note titles in the `notes[]` array

## Auto-generated labels

The first note in `notes[]` automatically receives:
- `#pluginId` = plugin's registry id
- `#pluginVersion` = plugin's registry version
- `#pluginName` = plugin's registry name

Do NOT include these in the manifest — they are set by the Plugin Manager.

## Validation checklist

- [ ] Valid JSON
- [ ] All `sourceUrl` are `raw.githubusercontent.com` (not `github.com/blob`)
- [ ] Source files exist at the resolved URL
- [ ] `%20` replaces spaces in filenames
- [ ] `relations[].from` and `relations[].to` match `notes[].title`
- [ ] First note does NOT include pluginId/pluginVersion/pluginName labels

## When to consult this skill
- Creating a new manifest for a multi-note plugin
- Modifying an existing manifest (adding/removing notes, labels, relations)
- Debugging why a manifest-based installation failed
- Converting a single-file plugin to multi-note format
