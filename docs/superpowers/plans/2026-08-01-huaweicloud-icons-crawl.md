# Huawei Cloud Icons Crawl Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a repeatable crawler that reads the Huawei Cloud product page, extracts public product logo assets, downloads them into the portal source tree, and emits a versioned manifest for later website, CLI, and Agent reuse.

**Architecture:** Add one Node.js script that exposes pure parsing helpers for tests and also runs as a CLI. The script fetches `https://www.huaweicloud.com/product/`, parses product cards from `.first-content` sections, writes normalized logo files under `portal/src/icons/assets/logo`, and writes `portal/src/icons/manifest.v1.json`.

**Tech Stack:** Node.js >=18 built-in `fetch`, `fs`, `path`, `node:test`, and `assert`; no third-party dependencies.

---

### Task 1: Product Card Parser Tests

**Files:**
- Create: `scripts/huaweicloud-icons-crawler.test.cjs`
- Create: `scripts/huaweicloud-icons-crawler.cjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing parser tests**

Add `scripts/huaweicloud-icons-crawler.test.cjs` with tests that import `parseProductCards`, `deriveServiceId`, and `normalizeAssetUrl` from `scripts/huaweicloud-icons-crawler.cjs`.

The tests must cover:
- Parsing two cards from a Huawei Cloud product-page HTML snippet.
- Preserving top-level category and second-level category.
- Normalizing protocol-relative image URLs.
- Deriving stable lowercase service IDs from product URL slugs and icon filenames.
- Deduplicating the same product when it appears in both "featured" and a real category.

- [ ] **Step 2: Run parser tests and verify RED**

Run: `node --test scripts/huaweicloud-icons-crawler.test.cjs`

Expected: FAIL because `scripts/huaweicloud-icons-crawler.cjs` does not export the required functions yet.

- [ ] **Step 3: Implement pure parser helpers**

Add `scripts/huaweicloud-icons-crawler.cjs` with:
- `decodeHtmlEntities(text)`
- `stripTags(text)`
- `normalizeWhitespace(text)`
- `normalizeAssetUrl(url, baseUrl)`
- `deriveServiceId(productUrl, iconUrl, title)`
- `parseProductCards(html, options)`
- `dedupeProducts(products)`

Export these helpers for tests. Do not download files in this task.

- [ ] **Step 4: Run parser tests and verify GREEN**

Run: `node --test scripts/huaweicloud-icons-crawler.test.cjs`

Expected: PASS.

### Task 2: Manifest Builder Tests

**Files:**
- Modify: `scripts/huaweicloud-icons-crawler.test.cjs`
- Modify: `scripts/huaweicloud-icons-crawler.cjs`

- [ ] **Step 1: Write failing manifest tests**

Add tests for `buildManifest(products, options)`:
- Manifest includes `schema_version: "1.0.0"`.
- Manifest includes the source URL and generated timestamp.
- Each icon entry includes `id`, `name`, `category`, `subcategory`, `product_url`, `logo.source_url`, `logo.local_path`, `architecture.status`, `aliases`, and `tags`.
- Local logo path uses `icons/assets/logo/<id>.<ext>`.

- [ ] **Step 2: Run manifest tests and verify RED**

Run: `node --test scripts/huaweicloud-icons-crawler.test.cjs`

Expected: FAIL because `buildManifest` is not implemented or exported.

- [ ] **Step 3: Implement manifest builder**

Add `buildManifest(products, options)` and supporting helpers:
- `getAssetExtension(url)`
- `toLocalAssetPath(id, sourceUrl)`
- `extractAliases(title, id)`
- `buildTags(product)`

- [ ] **Step 4: Run manifest tests and verify GREEN**

Run: `node --test scripts/huaweicloud-icons-crawler.test.cjs`

Expected: PASS.

### Task 3: Crawl CLI and Asset Download

**Files:**
- Modify: `scripts/huaweicloud-icons-crawler.cjs`
- Modify: `package.json`
- Create generated: `portal/src/icons/assets/logo/*`
- Create generated: `portal/src/icons/manifest.v1.json`

- [ ] **Step 1: Write failing CLI smoke test**

Add a test that calls `parseArgs(["--dry-run", "--limit", "2"])` and verifies the returned options.

- [ ] **Step 2: Run test and verify RED**

Run: `node --test scripts/huaweicloud-icons-crawler.test.cjs`

Expected: FAIL because `parseArgs` is not implemented.

- [ ] **Step 3: Implement CLI runner**

Add:
- `parseArgs(argv)`
- `ensureDirectory(dirPath)`
- `downloadAsset(fetchImpl, url, targetPath)`
- `writeJson(filePath, data)`
- `runCrawler(options)`

The default command downloads all parsed products. `--dry-run` prints counts without writing assets. `--limit N` downloads only the first N parsed products for local checks.

- [ ] **Step 4: Add npm script**

Modify `package.json`:
- Add `"crawl:icons": "node scripts/huaweicloud-icons-crawler.cjs"`
- Add `"test:unit": "node --test scripts/*.test.cjs"`
- Change `"test"` to run lint and unit tests.

- [ ] **Step 5: Run tests and verify GREEN**

Run: `npm run test:unit`

Expected: PASS.

- [ ] **Step 6: Run dry crawl**

Run: `npm run crawl:icons -- --dry-run`

Expected: prints the number of parsed product icon entries and exits 0.

- [ ] **Step 7: Run limited crawl**

Run: `npm run crawl:icons -- --limit 12`

Expected: writes `portal/src/icons/manifest.v1.json` and 12 logo assets under `portal/src/icons/assets/logo`.

### Task 4: Build Boundary Verification

**Files:**
- Modify if needed: `scripts/verify-engineering-foundation.cjs`

- [ ] **Step 1: Run full verification**

Run: `npm test`

Expected: PASS. Build copies `portal/src/icons/**` into `portal/public/icons/**`; verify accepts generated publish output because it has matching source files.

- [ ] **Step 2: Inspect git status**

Run: `git status --short`

Expected: shows crawler script, test, package file, plan file, and generated icon assets.

- [ ] **Step 3: Create PR**

Run: `git diff --stat`, then create a PR if tests pass and repository remote auth is available. Use issue key `VC-16` in the PR title.
