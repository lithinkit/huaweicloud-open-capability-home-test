const fs = require("fs");
const path = require("path");

const defaultSourceUrl = "https://www.huaweicloud.com/product/";
const featuredCategory = "精选推荐";
const defaultOutputRoot = "portal/vue/public";
const manifestPath = "icons/manifest.v1.json";
const categoryFallbackBySubcategory = new Map([
  ["保护您的应用服务", "安全"],
  ["保护您的云工作负载", "安全"],
  ["保护您的数据资产", "安全"],
  ["管理您系统的安全态势", "安全"],
  ["关系型数据库", "数据库"],
  ["非关系型数据库", "数据库"],
  ["数据库生态工具&中间件", "数据库"],
  ["大数据计算", "大数据"],
  ["大数据搜索与分析", "大数据"],
  ["数据可视化", "大数据"],
  ["大数据治理与开发", "大数据"],
]);

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(text) {
  return decodeHtmlEntities(String(text || "").replace(/<[^>]*>/g, ""));
}

function normalizeWhitespace(text) {
  return stripTags(text).replace(/\s+/g, " ").trim();
}

function getAttribute(tag, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const match = String(tag || "").match(pattern);
  return match ? decodeHtmlEntities(match[1] || match[2] || match[3] || "") : "";
}

function normalizeAssetUrl(url, baseUrl = defaultSourceUrl) {
  const rawUrl = decodeHtmlEntities(String(url || "").trim());
  if (!rawUrl) return "";
  if (rawUrl.startsWith("//")) return `https:${rawUrl}`;
  return new URL(rawUrl, baseUrl).href;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function deriveServiceId(productUrl, iconUrl, title) {
  const normalizedProductUrl = normalizeAssetUrl(productUrl, defaultSourceUrl);
  const product = new URL(normalizedProductUrl);
  const pathParts = product.pathname
    .split("/")
    .filter(Boolean)
    .map((part) => part.replace(/\.html?$/i, ""))
    .filter(Boolean);
  const productIndex = pathParts.indexOf("product");

  if (productIndex >= 0 && pathParts.length > productIndex + 1) {
    return slugify(pathParts.slice(productIndex + 1).join("-"));
  }

  const iconPath = new URL(normalizeAssetUrl(iconUrl, defaultSourceUrl)).pathname;
  const iconName = path.basename(iconPath).replace(/\.[^.]+$/i, "");
  const iconSlug = slugify(iconName);
  if (iconSlug) return iconSlug;

  return slugify(title);
}

function findBlocks(html, className) {
  const blocks = [];
  const openPattern = new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "gi");
  let match;

  while ((match = openPattern.exec(html))) {
    let cursor = openPattern.lastIndex;
    let depth = 1;

    while (depth > 0) {
      const nextOpen = html.slice(cursor).search(/<div\b/i);
      const nextClose = html.slice(cursor).search(/<\/div>/i);

      if (nextClose < 0) break;

      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth += 1;
        cursor += nextOpen + 4;
      } else {
        depth -= 1;
        cursor += nextClose + 6;
      }
    }

    blocks.push(html.slice(match.index, cursor));
    openPattern.lastIndex = cursor;
  }

  return blocks;
}

function extractFirstTitle(sectionHtml) {
  const match = sectionHtml.match(/<div\b[^>]*class=["'][^"']*\bfirst-title\b[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>/i);
  return match ? normalizeWhitespace(match[1]) : "";
}

function extractSecondTitle(blockHtml) {
  const match = blockHtml.match(/<div\b[^>]*class=["'][^"']*\bsecond-title\b[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*>([\s\S]*?)<\/span>/i);
  return match ? normalizeWhitespace(match[1]) : "";
}

function extractField(cardHtml, className) {
  const pattern = new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>`, "i");
  const match = cardHtml.match(pattern);
  return match ? normalizeWhitespace(match[1]) : "";
}

function parseCardsFromBlock(blockHtml, category, subcategory, sourceUrl) {
  const products = [];
  const cardPattern = /<a\b(?=[^>]*class=["'][^"']*\bcard-icon\b[^"']*["'])([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardPattern.exec(blockHtml))) {
    const anchorTag = match[1];
    const cardHtml = match[2];
    const imageMatch = cardHtml.match(/<img\b([^>]*)>/i);
    const rawProductUrl = getAttribute(anchorTag, "href");
    const rawIconUrl = imageMatch ? getAttribute(imageMatch[1], "src") || getAttribute(imageMatch[1], "data-src") : "";
    const name = extractField(cardHtml, "card-title");

    if (!rawProductUrl || !rawIconUrl || !name) {
      continue;
    }

    const productUrl = normalizeAssetUrl(rawProductUrl, sourceUrl);
    const iconUrl = normalizeAssetUrl(rawIconUrl, sourceUrl);

    products.push({
      id: deriveServiceId(productUrl, iconUrl, name),
      name,
      category,
      subcategory,
      description: extractField(cardHtml, "card-description"),
      product_url: productUrl,
      logo: {
        source_url: iconUrl,
      },
    });
  }

  return products;
}

function dedupeProducts(products) {
  const byId = new Map();

  for (const product of products) {
    const existing = byId.get(product.id);
    if (!existing) {
      byId.set(product.id, product);
      continue;
    }

    if (existing.category === featuredCategory && product.category !== featuredCategory) {
      byId.set(product.id, product);
    }
  }

  return Array.from(byId.values());
}

function getAssetExtension(url) {
  const pathname = new URL(normalizeAssetUrl(url, defaultSourceUrl)).pathname;
  const extension = path.extname(pathname).replace(".", "").toLowerCase();
  return extension || "png";
}

function toLocalAssetPath(id, sourceUrl) {
  return `icons/assets/logo/${id}.${getAssetExtension(sourceUrl)}`;
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function extractAliases(title, id) {
  const asciiMatches = String(title || "").match(/[A-Za-z][A-Za-z0-9-]{1,}/g) || [];
  return unique([...asciiMatches.map(slugify), id]);
}

function buildTags(product) {
  return unique([
    product.category,
    product.subcategory,
    ...extractAliases(product.name, product.id),
  ]);
}

function resolveProductCategory(product) {
  const category = normalizeWhitespace(product.category);
  if (category) return category;

  const subcategory = normalizeWhitespace(product.subcategory);
  return categoryFallbackBySubcategory.get(subcategory) || "";
}

function buildManifest(products, options = {}) {
  const generatedAt = options.generatedAt || new Date().toISOString();
  const sourceUrl = options.sourceUrl || defaultSourceUrl;

  return {
    schema_version: "1.0.0",
    source_url: sourceUrl,
    generated_at: generatedAt,
    icons: products.map((product) => {
      const normalizedProduct = {
        ...product,
        category: resolveProductCategory(product),
        subcategory: normalizeWhitespace(product.subcategory),
      };
      const aliases = extractAliases(normalizedProduct.name, normalizedProduct.id);

      return {
        id: normalizedProduct.id,
        name: normalizedProduct.name,
        category: normalizedProduct.category,
        subcategory: normalizedProduct.subcategory,
        description: normalizedProduct.description,
        product_url: normalizedProduct.product_url,
        logo: {
          source_url: normalizedProduct.logo.source_url,
          local_path: toLocalAssetPath(normalizedProduct.id, normalizedProduct.logo.source_url),
        },
        architecture: {
          status: "planned",
          local_path: `icons/assets/architecture/${normalizedProduct.id}.svg`,
        },
        aliases,
        tags: buildTags(normalizedProduct),
      };
    }),
  };
}

function parseArgs(argv) {
  const options = {
    dryRun: false,
    limit: undefined,
    sourceUrl: defaultSourceUrl,
    outputRoot: defaultOutputRoot,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--limit") {
      const value = Number(argv[index + 1]);
      if (!Number.isInteger(value) || value < 1) {
        throw new Error("--limit must be a positive integer");
      }
      options.limit = value;
      index += 1;
      continue;
    }

    if (arg === "--source-url") {
      const value = argv[index + 1];
      if (!value) throw new Error("--source-url requires a value");
      options.sourceUrl = value;
      index += 1;
      continue;
    }

    if (arg === "--output-root") {
      const value = argv[index + 1];
      if (!value) throw new Error("--output-root requires a value");
      options.outputRoot = value;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

async function downloadAsset(fetchImpl, url, targetPath) {
  const response = await fetchImpl(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  ensureDirectory(path.dirname(targetPath));
  fs.writeFileSync(targetPath, buffer);
  return buffer.length;
}

function writeJson(filePath, data) {
  ensureDirectory(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function runCrawler(options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("A fetch implementation is required");
  }

  const sourceUrl = options.sourceUrl || defaultSourceUrl;
  const outputRoot = options.outputRoot || defaultOutputRoot;
  const repoRoot = options.repoRoot || path.resolve(__dirname, "..");
  const htmlResponse = await fetchImpl(sourceUrl);

  if (!htmlResponse.ok) {
    throw new Error(`Failed to fetch ${sourceUrl}: HTTP ${htmlResponse.status}`);
  }

  const html = await htmlResponse.text();
  const allProducts = parseProductCards(html, { sourceUrl });
  const products = Number.isInteger(options.limit) ? allProducts.slice(0, options.limit) : allProducts;
  const manifest = buildManifest(products, {
    sourceUrl,
    generatedAt: options.generatedAt,
  });

  if (options.dryRun) {
    return {
      dryRun: true,
      parsedCount: allProducts.length,
      selectedCount: products.length,
      manifest,
      writtenAssets: [],
    };
  }

  const outputRootPath = path.join(repoRoot, outputRoot);
  const writtenAssets = [];

  for (const icon of manifest.icons) {
    const targetPath = path.join(outputRootPath, icon.logo.local_path);
    const bytes = await downloadAsset(fetchImpl, icon.logo.source_url, targetPath);
    writtenAssets.push({
      id: icon.id,
      path: icon.logo.local_path,
      bytes,
    });
  }

  writeJson(path.join(outputRootPath, manifestPath), manifest);

  return {
    dryRun: false,
    parsedCount: allProducts.length,
    selectedCount: products.length,
    manifest,
    writtenAssets,
  };
}

function parseProductCards(html, options = {}) {
  const sourceUrl = options.sourceUrl || defaultSourceUrl;
  const products = [];

  for (const section of findBlocks(String(html || ""), "first-content")) {
    const category = extractFirstTitle(section);
    const secondBlocks = findBlocks(section, "second-flex");

    if (secondBlocks.length === 0) {
      products.push(...parseCardsFromBlock(section, category, "", sourceUrl));
      continue;
    }

    for (const secondBlock of secondBlocks) {
      const subcategory = extractSecondTitle(secondBlock);
      products.push(...parseCardsFromBlock(secondBlock, category, subcategory, sourceUrl));
    }
  }

  return dedupeProducts(products);
}

module.exports = {
  buildManifest,
  decodeHtmlEntities,
  deriveServiceId,
  downloadAsset,
  ensureDirectory,
  extractAliases,
  getAssetExtension,
  parseArgs,
  normalizeAssetUrl,
  normalizeWhitespace,
  parseProductCards,
  runCrawler,
  stripTags,
  toLocalAssetPath,
  writeJson,
};

if (require.main === module) {
  runCrawler(parseArgs(process.argv.slice(2)))
    .then((result) => {
      if (result.dryRun) {
        console.log(`Parsed ${result.parsedCount} product icons; selected ${result.selectedCount}; no files written.`);
        return;
      }

      console.log(`Parsed ${result.parsedCount} product icons; wrote ${result.writtenAssets.length} logo assets and ${manifestPath}.`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
