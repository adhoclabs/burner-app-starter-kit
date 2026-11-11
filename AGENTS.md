# PROJECT KNOWLEDGE BASE

**Generated:** 2026-11-11
**Commit:** 3588632
**Branch:** master

## OVERVIEW
Burner OAuth and messaging demo built on React Starter Kit.
React 15, Express, Sequelize/PostgreSQL, Babel 6, and Webpack 1.

## STRUCTURE
```text
./
|-- src/server.js       # OAuth, sessions, API, webhook, server rendering
|-- src/client.js       # Browser routing and rendering
|-- src/components/     # Shared UI and CSS insertion context
|-- src/routes/         # Universal Router action objects and page UI
|-- src/core/           # Burner client, encryption, browser/server helpers
|-- src/data/           # Sequelize models and inherited content query
|-- src/content/        # Markdown pages
|-- tools/              # Babel-executed build/dev/deployment tasks
|-- test/setup.js       # Mocha environment and asset import stubs
`-- docs/               # Starter Kit guides and recipes
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| OAuth callback and session | `src/server.js` | Callback persists authorized Burners |
| Incoming message behavior | `src/server.js` | `/messages` reverses incoming text |
| Burner HTTP requests | `src/core/BurnerApi.js` | Bearer headers and status handling |
| Token persistence | `src/data/models/User.js` | Uses encryption helper |
| Model associations | `src/data/models/index.js` | User has many Burners |
| Database connection | `src/data/sequelize.js` | Reads URL from `src/config.js` |
| Client navigation | `src/client.js` | History listener and route resolution |
| Build targets | `tools/webpack.config.js` | Separate web and Node configurations |
| Build sequence | `tools/build.js` | Clean, copy, bundle; optional static render |

## CODE MAP
Ast-grep confirmed exports and import shapes. LSP is unavailable;
reference centrality is unmeasured. Import counts below are syntactic sites.

| Symbol | Type | Location | Refs | Role |
|--------|------|----------|------|------|
| BurnerApi | Class | `src/core/BurnerApi.js` | Unmeasured | Burner API wrapper |
| App | Class | `src/components/App.js` | 3 imports | CSS context provider |
| Layout | Styled export | `src/components/Layout/Layout.js` | 8 page imports | Shared page shell |
| sync | Function | `src/data/models/index.js` | Unmeasured | Sequelize synchronization |
| build | Async function | `tools/build.js` | Unmeasured | Build orchestration |

## CONVENTIONS
- Existing package scripts use npm; minimum engines declare Node 6.5/npm 3.10.
- JavaScript files contain JSX and stage-0 syntax; Babel configuration lives in `package.json`.
- ESLint extends Airbnb with project overrides; stylelint configuration is also in `package.json`.
- `src/core/fetch/package.json` selects server and browser implementations.
- Tests live beside source as `*.test.js`; `test/setup.js` stubs asset imports.

## ANTI-PATTERNS (THIS PROJECT)
- Keep wildcard routes last, as required by `src/routes/index.js`.
- Put shared header/footer changes in Layout, per the explicit note in App.
- Do not edit generated `build/` output as application source.

## UNIQUE STYLES
- Dual rendering uses the same route tree with distinct browser/server context.
- Client asset paths are emitted by Webpack as `assets.js`; the server import is generated.
- Development startup uses node-foreman before the Babel task runner.

## COMMANDS
```bash
npm install
npm start
npm start -- --release
npm run build
npm run lint
npm test
```

## NOTES
- PostgreSQL and Burner OAuth configuration are needed for the complete app flow.
- Runtime code reads environment variables; consult code when README examples differ.
- `npm run deploy` invokes Heroku deployment; it is an external action.
- Startup calls `models.sync()` before listening; starting the server can affect the database.
- `src/data/queries/content.js` imports absent `src/data/types/ContentType`; treat inherited content recipes as unverified.
- The initial checkout contains an untracked `bun.lock`; preserve it.
