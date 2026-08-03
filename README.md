# huaweicloud-open-capability-home

Huawei Cloud open capability portal built with Vue 3 and Vite.

## Directory Boundaries

- `portal/vue/`: the Vue/Vite application source, including homepage, AI Agent roadmap pages, Icons library, docs, data, utilities, styles, and Vite public assets.
- `portal/public/`: generated publish output from `npm run build`; do not commit generated files.
- `scripts/`: build, validation, and data tooling.
- `dist/`: historical publish output; not used by the current build pipeline.

The old `portal/src` static HTML/CSS/JS portal has been removed. Development, build, preview, and validation all use the Vue application as the only portal source. Legacy public URLs such as `activity.html`, `cases.html`, `case-detail.html`, `community.html`, `open-data.html`, `ai-agent-roadmap.html`, `icons.html`, and `docs.html` are now Vite multi-page HTML entries that mount the same Vue app.

## Commands

```bash
npm run dev
```

Starts the Vite dev server at `http://127.0.0.1:5176/`.

```bash
npm run build
```

Builds the Vue portal into `portal/public/`.

```bash
npm run preview
```

Serves the generated `portal/public/` output at `http://127.0.0.1:4176/`.

```bash
npm run lint
```

Builds the portal and verifies the Vue-only project boundary.

```bash
npm test
```

Runs the full project verification and Node test suite.
