# AGENTS.md — Plugin Manager

## Stack & Convenções

- **Linguagem:** JS/JSX puro, sem transpiladores ou bundlers
- **DOM:** jQuery (global no TriliumNext). Preferir `$root.find()` sobre `document.getElementById()`
- **CSS:** inline em template literals dentro do `.js` — sem arquivos `.css` separados
- **Nomes:** inglês para variáveis, funções, arquivos e chaves de registry
- **Comentários:** não adicionar a menos que explicitamente solicitado
- **Async:** `async/await` para operações backend. `try/catch` em todo callback `runAsyncOnBackendWithManualTransactionHandling`
- **jQuery:** prefixo `$` para variáveis jQuery (ex: `$btn`, `$root`, `$card`)

## Estrutura de pastas

```
/trilium-plugin-manager/
├── trilium-plugin-manager-v4.js    ← Único arquivo principal
├── registry.json                    ← Catálogo de plugins
├── CONTEXTO.md                      ← Contexto do projeto
├── AGENTS.md                        ← Este arquivo
├── .opencodeignore                  ← Arquivos ignorados pela IA
├── .opencode/
│   └── skills/
│       ├── trilium-api/SKILL.md
│       ├── manifest-designer/SKILL.md
│       └── registry-manager/SKILL.md
├── MANIFEST_GENERATOR.md
├── PLUGIN_DEV_GUIDE.md
├── README.md
└── imagens/
```

## Regras do projeto

1. `trilium-plugin-manager-v4.js` é o único arquivo de código — toda lógica fica nele
2. `registry.json` é o catálogo — mudanças de versão/URL passam por ele
3. Manifest `.json` fica no repositório Toolkit, NÃO neste repo
4. `sourceUrl` e `manifestUrl` usam SEMPRE `raw.githubusercontent.com`
5. Funções `httpGet()` são definidas DENTRO dos callbacks backend (não podem ser globais)
6. Nunca misturar `api.runOnBackend` com `async` — causa erro

## Delegação para especialistas

| Tarefa | Especialista | Quando chamar |
|--------|-------------|---------------|
| Dúvidas sobre API do TriliumNext | `@trilium-api` | Antes de escrever código que usa `api.*`, `runOnBackend`, `createNewNote`, `setAttribute` |
| Criar/modificar manifest.json | `@manifest-designer` | Sempre que um novo plugin precisar de manifest, ou houver mudança no formato |
| Alterar registry.json | `@registry-manager` | Para adicionar/editar plugins no catálogo, atualizar versões, corrigir URLs |
| Múltiplos domínios | Agente principal | Coordena os especialistas, resolve conflitos, toma decisões finais |

## Fluxo de desenvolvimento

1. Agente principal recebe a tarefa
2. Se envolve API → delega para `@trilium-api`
3. Se envolve manifest → delega para `@manifest-designer`
4. Se envolve registry → delega para `@registry-manager`
5. Se envolve múltiplas áreas → coordena, pede pareceres, e integra
6. Agente principal faz o commit final
