# COMPONENT GUIDANCE

## OVERVIEW
Shared React UI and server-rendering CSS context; score 9, distinct UI domain.
Scoring: >20 files (3), >5 subdirectories (2), >70% code (2),
>10 ast-grep-confirmed exports (2).
Reference centrality is unmeasured.

## STRUCTURE
```text
components/
|-- App.js          # Context provider
|-- Html.js         # Server document shell
|-- Layout/         # Shared page layout and its test
|-- Link/           # Internal navigation wrapper
|-- Burner/         # One Burner display
|-- Header/         # Header and logo assets
|-- Footer/         # Footer links
|-- Navigation/     # Navigation links
|-- Feedback/       # Feedback link
`-- variables.css   # Shared CSS values
```

## WHERE TO LOOK
| Task | Location | Notes |
|------|----------|-------|
| CSS context contract | `App.js` | `insertCss` is required |
| Document markup | `Html.js` | Server HTML shell |
| Child rendering test | `Layout/Layout.test.js` | Wraps Layout in App |
| Internal link handling | `Link/Link.js` | Used by shared navigation |

## CONVENTIONS
- Component directories use `package.json` entry points rather than index files.
- Styled components import adjacent CSS as `s` and export `withStyles(s)(Component)`.
- Existing components use React 15 classes and `PropTypes` from React.
- Layout's test supplies `context={{ insertCss: () => {} }}` to App.

## ANTI-PATTERNS
- Do not bypass the CSS context contract when mounting styled UI in tests.
- Do not assume a component directory resolves through `index.js`; inspect its manifest.
