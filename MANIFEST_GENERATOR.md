# 📝 Gerador de Manifest para Plugins TriliumNext

Preencha os dados abaixo e cole em um chat de IA (ou use como checklist manual) para gerar o `manifest.json` do seu plugin.

---

## Instruções

1. Preencha todas as seções marcadas com `[PREENCHER]`
2. Cole o prompt completo em um chat de IA (Claude, ChatGPT, etc.)
3. O AI retornará o `manifest.json` pronto
4. Salve o arquivo na pasta do seu plugin no Toolkit

---

## Prompt

```
Crie um arquivo manifest.json para um plugin TriliumNext com as seguintes caracteristicas:

## Dados do Plugin (registry)
- ID: [PREENCHER — ex: my-plugin]
- Nome: [PREENCHER — ex: My Plugin]
- Versao: [PREENCHER — ex: 0.1.0]
- Autor: [PREENCHER — ex: Seu Nome]
- Descricao: [PREENCHER — ex: Faz algo incrivel]
- Homepage (URL do repo/docs): [PREENCHER — ex: https://github.com/seuuser/seurepo]
- Tags: [PREENCHER — ex: ["tag1", "tag2"]]

## URL base dos sources (raw.githubusercontent.com)
[Copie e cole a URL base onde os arquivos .js/.jsx estarao hospedados]
Ex: https://raw.githubusercontent.com/seuuser/seurepo/main/Meu-Plugin/

## Notas do Plugin (preencha uma tabela para cada nota)

### Nota 1 — Render Note (principal)
- Titulo: [PREENCHER — ex: My Plugin]
- Tipo: text
- Conteudo: [PREENCHER — ex: "Abra esta nota para usar o plugin."]
- Labels: [PREENCHER — deixar vazio se nao tiver]
- Relation ~renderNote aponta para qual nota?: [PREENCHER — ex: My Plugin Code]

### Nota 2 — Codigo (JS Frontend)
- Titulo: [PREENCHER — ex: My Plugin Code]
- Tipo: code
- MIME: application/javascript;env=frontend
- sourceUrl (nome do arquivo): [PREENCHER — ex: plugin.js]
- Labels: [PREENCHER — ex: readOnly, widget, etc]

### Nota 3 — Codigo (JS Backend) — se houver
- Titulo: [PREENCHER — ex: My Plugin Handler]
- Tipo: code
- MIME: application/javascript;env=backend
- sourceUrl (nome do arquivo): [PREENCHER — ex: handler.js]
- Labels: [PREENCHER — ex: customRequestHandler=my-endpoint]

### Nota 4 — Config/Data — se houver
- Titulo: [PREENCHER — ex: My Plugin Config]
- Tipo: text ou code
- MIME: [PREENCHER — ex: application/json]
- Conteudo: [PREENCHER — ex: "{}" se for JSON, ou texto de instrucoes]
- Labels: [PREENCHER — ex: myPluginConfig]

[Repita para quantas notas o plugin tiver]

## Regras importantes
1. sourceUrl dentro do manifest deve ser URL ABSOLUTA (https://raw.githubusercontent.com/...) ou RELATIVA ao manifest
2. Se o arquivo tiver espacos no nome, use %20 (ex: AI%20Code.js)
3. Todo label com valor vazio fica como string vazia ""
4. Relations sao opcionais — inclua apenas se o plugin usar ~renderNote
5. A primeira nota do manifest recebe automaticamente as labels pluginId, pluginVersion, pluginName

Gere apenas o JSON do manifest, sem explicacoes.
```

---

## Exemplo preenchido

Use como referencia:

```
Crie um arquivo manifest.json para um plugin TriliumNext com as seguintes caracteristicas:

## Dados do Plugin (registry)
- ID: shared-notes
- Nome: Shared Notes
- Versao: 0.6.0
- Autor: ricolandia
- Descricao: Compartilhe notas entre instancias do TriliumNext
- Homepage: https://github.com/ricolandia/TriliumNext-Toolkit/tree/main/Shared-Notes
- Tags: ["share", "comment"]

## URL base dos sources
https://raw.githubusercontent.com/ricolandia/TriliumNext-Toolkit/main/Shared-Notes/

## Notas do Plugin

### Nota 1 — Render Note
- Titulo: Shared Notes
- Tipo: text
- Conteudo: "Compartilhe notas entre instancias. Abra esta nota para usar."
- Labels: nenhum
- Relation ~renderNote: shared-notes-widget

### Nota 2 — Widget (JS Frontend)
- Titulo: shared-notes-widget
- Tipo: code
- MIME: application/javascript;env=frontend
- sourceUrl: shared-notes-widget.js
- Labels: widget, originalFileName=shared-notes-widget.js, readOnly

### Nota 3 — Handler (JS Backend)
- Titulo: shared-notes-handler
- Tipo: code
- MIME: application/javascript;env=backend
- sourceUrl: shared-notes-handler.js
- Labels: customRequestHandler=shared-notes-reply, originalFileName=shared-notes-handler.js, readOnly

### Nota 4 — Config
- Titulo: Shared Notes Config
- Tipo: text
- Conteudo: "Configure #myName e #myEndpoint na label desta nota."
- Labels: sharedNotesConfig, myName=yourname, myEndpoint=http://yoururl/
```

---

## Validacao

Depois de gerar o manifest, verifique:

- [ ] JSON valido (use jsonlint.com ou similar)
- [ ] `sourceUrl` aponta para raw.githubusercontent.com (nao github.com/blob)
- [ ] Arquivos de source existem no caminho indicado
- [ ] Nomes com espaco usam %20 (ex: `AI%20Code.js`)
- [ ] Labels com valor usam ` nome=valor `
- [ ] Labels sem valor usam `"nome": ""`
- [ ] `~renderNote` de ORIGEM existe nas notes do manifest
- [ ] `~renderNote` de DESTINO existe nas notes do manifest
- [ ] Primeira nota nao precisa de pluginId/pluginVersion/pluginName (sao automaticos)
