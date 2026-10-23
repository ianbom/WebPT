# PT Liftco Indo Perkasa

Next.js App Router frontend with a locally stored 68-product catalog, verified Liftco assets, and HKA-reference page compositions. Indonesian UI. No backend, CMS, authentication, or runtime catalog API.

## Local development

Requires Node.js 24 (validated runtime; tests use native TypeScript stripping).

```powershell
npm ci
npm run dev
```

## Checks and production

```powershell
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` before building for a different public hostname; see `.env.example`. No secrets are required. Contact forms open an email draft in the visitor's application and never claim to submit or store messages.

## Content and evidence

- `src/data/products.json`: exact product names, source hierarchy, local imagery, descriptions and verified specifications.
- `src/data/company.ts`: company, offices and services. `src/data/articles.ts`: new educational material without invented dates/authors.
- `docs/reference-analysis.md`: design reconnaissance and deliberate adaptations.
- `docs/asset-inventory.md`: image sources, dimensions and publication-rights limitations.
- `docs/catalog-provenance.json`: original product-page extraction for audit, excluded from runtime imports.
- `docs/implementation-report.md`: validation evidence and remaining differences.
- `docs/screenshots/`: reference captures, separated blocked captures, and local QA passes.

Before external publication, confirm Liftco/manufacturer image rights and final rental/warranty terms with the company. Catalog availability is not a live inventory claim. Raw source data and source URLs are provenance, not runtime integrations.

The optional `scripts/import-content.py` rebuilds local content from the included provenance JSON and downloads official assets; it requires Python with Pillow. Runtime and normal builds require neither Python nor access to the source site.

## Browser QA

Start `npm start -- --port 3121` in a separate terminal. With browser-harness installed and Chrome remote debugging approved:

```powershell
$env:WEBPT_ORIGIN='http://127.0.0.1:3121'
$env:WEBPT_QA_PASS='pass3'
Get-Content -Raw scripts/browser-qa.py | browser-harness
Get-Content -Raw scripts/interaction-qa.py | browser-harness
node scripts/smoke.mjs
```

The browser scripts currently use this checkout's absolute Windows path. Update their `ROOT` when moving the project. Screenshots and JSON results are stored under `docs/screenshots/local/`. HTTP coverage is recorded in `docs/http-smoke.json`. Browser checks complement manual reference comparisons; they do not establish pixel-perfect equivalence.
