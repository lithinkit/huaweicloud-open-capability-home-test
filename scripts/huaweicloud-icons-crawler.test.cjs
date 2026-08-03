const assert = require("assert/strict");
const test = require("node:test");

const {
  buildManifest,
  deriveServiceId,
  normalizeAssetUrl,
  parseArgs,
  parseProductCards,
} = require("./huaweicloud-icons-crawler.cjs");

const productPageSnippet = `
  <div class="product-content">
    <div class="first-content">
      <div class="first-title color_text_primary_dark">
        <span id="section_22290-first-title-0">精选推荐</span>
      </div>
      <div class="second-content second-pc">
        <div class="second-flex">
          <div class="card-list">
            <a class="card white fixed-width card-icon" href="https://www.huaweicloud.com/product/ecs.html" target="_blank">
              <img src="//res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png">
              <div class="card-title">弹性云服务器 ECS</div>
              <div class="card-description">可随时自动获取、弹性伸缩的云服务器</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="first-content">
      <div class="first-title color_text_primary_dark">
        <span id="section_22290-first-title-2">计算</span>
      </div>
      <div class="second-content second-pc">
        <div class="second-flex">
          <div class="second-title color_text_primary_dark"><span>云服务器</span></div>
          <div class="card-list">
            <a class="card white fixed-width card-icon" href="https://www.huaweicloud.com/product/ecs.html" target="_blank">
              <img src="https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png">
              <div class="card-title">弹性云服务器 ECS</div>
              <div class="card-description">可随时自动获取、弹性伸缩的云服务器</div>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="first-content">
      <div class="first-title color_text_primary_dark">
        <span id="section_22290-first-title-3">存储</span>
      </div>
      <div class="second-content second-pc">
        <div class="second-flex">
          <div class="second-title color_text_primary_dark"><span>对象存储</span></div>
          <div class="card-list">
            <a class="card white fixed-width card-icon" href="/product/obs.html" target="_blank">
              <img src="https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Storage/OBS.png">
              <div class="card-title">对象存储服务 OBS </div>
              <div class="card-description">稳定、安全、高效、易用的云存储服务</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

test("normalizes protocol-relative and root-relative asset URLs", () => {
  assert.equal(
    normalizeAssetUrl("//res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png", "https://www.huaweicloud.com/product/"),
    "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png"
  );
  assert.equal(
    normalizeAssetUrl("/product/obs.html", "https://www.huaweicloud.com/product/"),
    "https://www.huaweicloud.com/product/obs.html"
  );
});

test("derives stable service IDs from Huawei Cloud product slugs", () => {
  assert.equal(
    deriveServiceId(
      "https://www.huaweicloud.com/product/ecs.html",
      "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png",
      "弹性云服务器 ECS"
    ),
    "ecs"
  );
  assert.equal(
    deriveServiceId(
      "https://www.huaweicloud.com/product/modelarts/studio.html",
      "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/AI/MaaS.png",
      "MaaS模型即服务"
    ),
    "modelarts-studio"
  );
});

test("parses product cards with category, subcategory, and deduped products", () => {
  const products = parseProductCards(productPageSnippet, {
    sourceUrl: "https://www.huaweicloud.com/product/",
  });

  assert.equal(products.length, 2);

  assert.deepEqual(
    products.map((product) => product.id),
    ["ecs", "obs"]
  );

  const ecs = products[0];
  assert.equal(ecs.name, "弹性云服务器 ECS");
  assert.equal(ecs.category, "计算");
  assert.equal(ecs.subcategory, "云服务器");
  assert.equal(ecs.description, "可随时自动获取、弹性伸缩的云服务器");
  assert.equal(ecs.product_url, "https://www.huaweicloud.com/product/ecs.html");
  assert.equal(ecs.logo.source_url, "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png");

  const obs = products[1];
  assert.equal(obs.name, "对象存储服务 OBS");
  assert.equal(obs.category, "存储");
  assert.equal(obs.subcategory, "对象存储");
  assert.equal(obs.product_url, "https://www.huaweicloud.com/product/obs.html");
});

test("builds a versioned manifest for tool and Agent reuse", () => {
  const products = parseProductCards(productPageSnippet, {
    sourceUrl: "https://www.huaweicloud.com/product/",
  });
  const manifest = buildManifest(products, {
    sourceUrl: "https://www.huaweicloud.com/product/",
    generatedAt: "2026-08-01T00:00:00.000Z",
  });

  assert.equal(manifest.schema_version, "1.0.0");
  assert.equal(manifest.source_url, "https://www.huaweicloud.com/product/");
  assert.equal(manifest.generated_at, "2026-08-01T00:00:00.000Z");
  assert.equal(manifest.icons.length, 2);

  assert.deepEqual(manifest.icons[0], {
    id: "ecs",
    name: "弹性云服务器 ECS",
    category: "计算",
    subcategory: "云服务器",
    description: "可随时自动获取、弹性伸缩的云服务器",
    product_url: "https://www.huaweicloud.com/product/ecs.html",
    logo: {
      source_url: "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Compute/ECS.png",
      local_path: "icons/assets/logo/ecs.png",
    },
    architecture: {
      status: "planned",
      local_path: "icons/assets/architecture/ecs.svg",
    },
    aliases: ["ecs"],
    tags: ["计算", "云服务器", "ecs"],
  });
});

test("fills known Huawei Cloud product categories when page blocks omit them", () => {
  const manifest = buildManifest(
    [
      {
        id: "aad",
        name: "DDoS防护 AAD",
        category: "",
        subcategory: "保护您的应用服务",
        description: "抵御DDoS攻击",
        product_url: "https://www.huaweicloud.com/product/aad.html",
        logo: {
          source_url: "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Security/AAD.png",
        },
      },
      {
        id: "mysql",
        name: "云数据库 RDS for MySQL",
        category: "",
        subcategory: "关系型数据库",
        description: "云数据库服务",
        product_url: "https://www.huaweicloud.com/product/mysql.html",
        logo: {
          source_url: "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/Database/RDS.png",
        },
      },
      {
        id: "mrs",
        name: "MapReduce服务 MRS",
        category: "",
        subcategory: "大数据计算",
        description: "大数据处理分析服务",
        product_url: "https://www.huaweicloud.com/product/mrs.html",
        logo: {
          source_url: "https://res-static.hc-cdn.cn/cloudbu-site/public/new-product-icon/BigData/MRS.png",
        },
      },
    ],
    {
      sourceUrl: "https://www.huaweicloud.com/product/",
      generatedAt: "2026-08-01T00:00:00.000Z",
    }
  );

  assert.deepEqual(
    manifest.icons.map((icon) => [icon.id, icon.category, icon.tags[0]]),
    [
      ["aad", "安全", "安全"],
      ["mysql", "数据库", "数据库"],
      ["mrs", "大数据", "大数据"],
    ]
  );
});

test("parses CLI flags for dry runs and limited crawls", () => {
  assert.deepEqual(parseArgs(["--dry-run", "--limit", "2"]), {
    dryRun: true,
    limit: 2,
    sourceUrl: "https://www.huaweicloud.com/product/",
    outputRoot: "portal/vue/public",
  });
});
