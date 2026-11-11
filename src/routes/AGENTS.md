# ROUTE GUIDANCE

## OVERVIEW
Universal Router actions and page UI; score 11, distinct routing domain.
Scoring: >20 files (3), >5 subdirectories (2), >70% code (2),
index module boundary (2), >10 ast-grep-confirmed exports (2).
Reference centrality is unmeasured.

## STRUCTURE
```text
routes/
|-- index.js        # Ordered children and title defaults
|-- home/          # Landing page
|-- dashboard/     # Burner authorization and list
|-- login/         # Inherited login UI
|-- register/      # Registration UI
|-- admin/         # Lazy-loaded admin example
|-- contact/       # Contact page
|-- content/       # Markdown GraphQL lookup fallback
|-- notFound/      # Final 404 fallback
`-- error/         # Explicit error page action
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| Add a page | `index.js`, page `index.js` | Register an action object |
| Authentication branching | `dashboard/index.js` | Browser cookie versus server token |
| Dashboard display | `dashboard/Dashboard.js` | Owns its Layout wrapper |
| Lazy chunks | `admin/index.js`, `dashboard/index.js` | `require.ensure` and chunk name |
| Content fallback | `content/index.js` | Returns undefined when content is absent |

## CONVENTIONS
- Page actions return metadata and a React `component`, or redirect information.
- Root action calls `next()` and supplies title and description defaults.
- Dashboard can return `oauthRedirect: true` for server handling.
- Browser dashboard data comes from `/api/burners` with same-origin credentials.

## ANTI-PATTERNS
- Do not wrap Dashboard in a second Layout; its component already owns one.
- Do not make browser-only OAuth navigation run during server rendering.
- Do not assume `error/index.js` is registered among the root children.
