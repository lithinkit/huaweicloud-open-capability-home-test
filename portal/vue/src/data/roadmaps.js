const guideLinks = {
  aiAssistant: "https://www.huaweicloud.com/service/aiassistant.html",
  apiExplorer: "https://apiexplorer.developer.huaweicloud.com/",
  cli: "https://support.huaweicloud.com/hcli/index.html",
  docs: "https://support.huaweicloud.com/",
  sdk: "https://sdkcenter.developer.huaweicloud.com/",
  skillCenter: "docs.html#mcp",
  mcp: "docs.html#mcp",
  freePack: "https://activity.huaweicloud.com/free_test/index.html",
  feishu: "https://open.feishu.cn/",
  hermesInstall: "https://res1.hermesagent.org.cn/install.sh",
  terraform: "https://github.com/huaweicloud/terraform-provider-huaweicloud"
};

function resourceSet(service, skillName) {
  return [
    { type: "Skills", name: skillName, href: guideLinks.skillCenter },
    { type: "CLI", name: `${service} CLI`, href: guideLinks.cli },
    { type: "API", name: `${service} API`, href: guideLinks.apiExplorer },
    { type: "SDK", name: `${service} SDK`, href: guideLinks.sdk },
    { type: "MCP", name: "即将上线", href: guideLinks.mcp }
  ];
}

function guideFromCapability(capabilityKey, overrides = {}) {
  const base = capabilityCatalog[capabilityKey];

  return {
    ...base,
    ...overrides,
    summary: overrides.summary || base.summary || base.intro,
    intro: overrides.intro || base.intro,
    learn: overrides.learn || base.learn,
    resources: overrides.resources || base.resources,
    sections: overrides.sections || base.sections,
    sources: overrides.sources || base.sources,
    command: overrides.command || base.command,
    assistant: overrides.assistant ?? base.assistant
  };
}

function customGuide(topic) {
  return {
    assistant: guideLinks.aiAssistant,
    resources: [],
    sections: [],
    sources: [],
    ...topic,
    summary: topic.summary || topic.intro
  };
}

export const capabilityCatalog = {
  iam: {
    name: "IAM",
    title: "统一身份认证服务 IAM",
    summary: "管理华为云账号、区域、项目、AK/SK 和最小权限，是所有 Agent 调用云资源前必须建立的安全边界。",
    intro: "IAM 负责身份、权限和访问凭证管理。路线图中的账号准备、项目选择、AK/SK 配置和临时凭证都依赖 IAM。",
    learn: ["完成账号实名认证与控制台访问检查", "理解区域、项目与委托权限的关系", "为 Agent 准备最小权限凭证并避免泄露"],
    resources: resourceSet("IAM", "huawei-cloud-iam-query Skill"),
    sections: [
      { title: "最小权限", body: "只给实验所需服务和项目授权。生产环境应优先使用临时凭证、委托或密钥管理，不把 AK/SK 写入前端代码和群聊消息。" },
      { title: "区域与项目", body: "ECS、OBS、RDS 等资源通常按区域与项目隔离。执行 KooCLI 或 SDK 示例前，先确认 region 与 project_id 是否一致。" }
    ],
    command: "hcloud configure list\nhcloud IAM KeystoneListProjects",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "IAM 文档", href: "https://support.huaweicloud.com/iam/" }]
  },
  cts: {
    name: "CTS",
    title: "云审计服务 CTS",
    summary: "记录账号内云资源操作事件，是安全组风险告警路线的审计事件来源。",
    intro: "CTS 能追踪控制台、API、SDK、KooCLI 等入口产生的资源操作，适合把安全组变更写入可查询、可告警的审计日志。",
    learn: ["启用 system 追踪器", "把管理类事件转储到 LTS", "从审计字段中识别安全组规则变更"],
    resources: resourceSet("CTS", "huawei-cloud-monitoring-query Skill"),
    sections: [
      { title: "审计入口", body: "安全组规则新增、删除和修改都会形成 CTS 事件。把 CTS 接到 LTS 后，后续告警规则可以围绕关键词和端口进行匹配。" },
      { title: "排障要点", body: "如果 LTS 中没有事件，先检查 CTS 追踪器状态、转储目标和当前测试操作发生的区域。" }
    ],
    command: "hcloud CTS ListTrackers --cli-region=cn-north-4\nhcloud CTS CreateTracker --tracker_type=system --tracker_name=system --is_lts_enabled=true",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "CTS 文档", href: "https://support.huaweicloud.com/cts/" }]
  },
  lts: {
    name: "LTS",
    title: "云日志服务 LTS",
    summary: "承接 CTS 审计日志并配置关键词告警，是安全组告警链路的检测层。",
    intro: "LTS 用日志组、日志流和关键词规则管理审计日志。路线图中用它检测高危端口、全网段开放和安全组规则变更。",
    learn: ["找到 CTS 转储后的日志组和日志流", "配置关键词告警规则与检测频率", "查看告警历史并定位未触发原因"],
    resources: resourceSet("LTS", "huawei-cloud-monitoring-query Skill"),
    sections: [
      { title: "关键词规则", body: "高危端口、0.0.0.0/0、::/0 和 security_group_rule 是本路线图的核心匹配维度。" },
      { title: "检测窗口", body: "告警检测通常按分钟级周期运行。验证时保留测试规则 5 分钟左右，再及时撤销。" }
    ],
    command: "hcloud LTS ListLogGroups --cli-region=cn-north-4\nhcloud LTS CreateKeywordsAlarmRule --cli-region=cn-north-4",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "LTS 文档", href: "https://support.huaweicloud.com/lts/" }]
  },
  smn: {
    name: "SMN",
    title: "消息通知服务 SMN",
    summary: "把 LTS 告警事件推送到函数或其他订阅端，是安全告警链路的消息路由层。",
    intro: "SMN 通过主题和订阅把告警消息交给 FunctionGraph。它让检测规则和告警处理逻辑解耦，便于复用和扩展。",
    learn: ["创建告警主题", "订阅 FunctionGraph 函数", "检查订阅确认与失败重试"],
    resources: resourceSet("SMN", "huawei-cloud-monitoring-query Skill"),
    sections: [
      { title: "主题与订阅", body: "一条主题可订阅多个目标。安全告警场景建议单独建主题，避免和普通通知混用。" },
      { title: "消息格式", body: "LTS 推给 SMN 的消息是告警 JSON，函数需要解析原始日志字段并组装飞书卡片。" }
    ],
    command: "hcloud SMN CreateTopic --name=cts-security-alert\nhcloud SMN AddSubscription --protocol=functionstage --endpoint=<function_urn>",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "SMN 文档", href: "https://support.huaweicloud.com/smn/" }]
  },
  functiongraph: {
    name: "FunctionGraph",
    title: "函数工作流 FunctionGraph",
    summary: "接收 SMN 告警消息，解析 CTS 日志并转成飞书告警卡片。",
    intro: "FunctionGraph 适合放置轻量事件处理逻辑。安全告警路线中，函数负责清洗 LTS 告警、识别风险端口并调用飞书机器人 Webhook。",
    learn: ["创建函数并暴露 SMN 触发器", "解析告警 JSON 和 CTS 原始事件", "把告警格式化为飞书卡片并保护 Webhook"],
    resources: resourceSet("FunctionGraph", "huawei-cloud-functiongraph-function-create Skill"),
    sections: [
      { title: "敏感配置", body: "飞书 Webhook、签名密钥和认证信息应放在函数环境变量或密钥服务中，不写入前端源码。" },
      { title: "可观测性", body: "保留函数日志，便于确认 SMN 是否触发、JSON 是否解析成功、飞书接口是否返回错误。" }
    ],
    command: "hcloud FunctionGraph ListFunctions --cli-region=cn-north-4\nhcloud FunctionGraph CreateFunction --func_name=security-alert-forwarder",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "FunctionGraph 文档", href: "https://support.huaweicloud.com/functiongraph/" }]
  },
  dns: {
    name: "DNS",
    title: "云解析服务 DNS",
    summary: "用 CNAME 把自定义域名指向 CDN 分配域名，形成用户访问入口。",
    intro: "DNS 负责把 open.topxtopx.com 这样的域名解析到 CDN。静态站路线中应避免同名 A 记录和 CNAME 冲突。",
    learn: ["添加 CNAME 记录", "理解 TTL 与解析生效时间", "用查询命令验证解析结果"],
    resources: resourceSet("DNS", "huawei-cloud-network-query Skill"),
    sections: [
      { title: "CNAME 生效", body: "配置后等待 TTL 生效。若存在同名 A 记录或其他记录，需要先清理冲突项。" },
      { title: "验证方式", body: "使用 dig、nslookup 或在线解析工具确认域名已经指向 CDN 分配的 CNAME。" }
    ],
    command: "nslookup open.topxtopx.com\n# 或 dig open.topxtopx.com",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "DNS 文档", href: "https://support.huaweicloud.com/dns/" }]
  },
  cdn: {
    name: "CDN",
    title: "内容分发网络 CDN",
    summary: "把 OBS 静态站内容缓存到边缘节点，加速访问并控制发布刷新。",
    intro: "CDN 作为 OBS 网站托管源站前的加速层。上线时需要关注源站类型、缓存规则、刷新预热和 HTTPS 配置。",
    learn: ["创建 CDN 加速域名", "把源站配置为 OBS 网站托管端点", "发布后刷新 HTML 与关键资源缓存"],
    resources: resourceSet("CDN", "huawei-cloud-network-query Skill"),
    sections: [
      { title: "缓存策略", body: "HTML 建议短缓存或 no-cache，带 hash 的静态资源可以长缓存，减少发布后旧页面残留。" },
      { title: "回源检查", body: "如果 CDN 返回 403 或旧内容，分别检查 OBS 网站托管、对象权限、Content-Type 和 CDN 缓存。" }
    ],
    command: "hcloud CDN ShowDomainDetailByName --cli-region=cn-north-1 --domain_name=open.topxtopx.com\nhcloud CDN CreateRefreshTasks --cli-region=cn-north-1",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "CDN 文档", href: "https://support.huaweicloud.com/cdn/" }]
  },
  obs: {
    name: "OBS",
    title: "对象存储服务 OBS",
    summary: "存放静态网站文件，并通过静态网站托管作为 CDN 源站。",
    intro: "OBS 承载 index.html、资源目录和路线图截图。静态站路线中要开启网站托管、配置默认首页并保证对象路径正确。",
    learn: ["创建桶并开启静态网站托管", "上传 HTML、图片和构建资源", "检查对象权限、Content-Type 和默认首页"],
    resources: resourceSet("OBS", "huawei-cloud-storage-query Skill"),
    sections: [
      { title: "路径一致", body: "构建输出和线上访问路径都以 /openplatform/ 为入口，上传时要保持 HTML 与资源目录的相对关系。" },
      { title: "对象类型", body: "Markdown、HTML、JS、CSS、PNG 等对象需要正确的 Content-Type，否则浏览器可能下载或拒绝渲染。" }
    ],
    command: "hcloud OBS CreateBucket --cli-region=cn-north-4 --bucket=obs-hd-dev-static\nhcloud OBS GetBucketWebsite --bucket=obs-hd-dev-static",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "OBS 文档", href: "https://support.huaweicloud.com/obs/" }]
  },
  rds: {
    name: "RDS",
    title: "云数据库 RDS for MySQL",
    summary: "为 OAuth2 Server 提供用户、客户端和刷新令牌等持久化数据。",
    intro: "RDS 是 OAuth2 登录服务的数据层。路线图中用 MySQL 保存 oauth_clients、users 等表，ECS 通过内网访问数据库。",
    learn: ["创建 MySQL RDS 实例", "配置与 ECS 同 VPC 的内网访问", "初始化 OAuth2 客户端表和用户表"],
    resources: resourceSet("RDS", "huawei-cloud-storage-query Skill"),
    sections: [
      { title: "网络边界", body: "RDS 3306 只应对 ECS 内网 IP 或应用安全组放行，不直接暴露到公网。" },
      { title: "凭证管理", body: "数据库密码和 client_secret 放在服务端环境变量或密钥管理中，前端页面只展示示例占位。" }
    ],
    command: "CREATE DATABASE oauth2_db DEFAULT CHARSET utf8mb4;\nCREATE TABLE oauth_clients (client_id VARCHAR(64) PRIMARY KEY, client_secret VARCHAR(255) NOT NULL, client_name VARCHAR(128) NOT NULL);",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "RDS 文档", href: "https://support.huaweicloud.com/rds/" }]
  },
  apig: {
    name: "APIG",
    title: "API 网关 APIG",
    summary: "为服务接口提供统一发布、鉴权、限流和观测入口，可作为 OAuth2 服务的后续扩展。",
    intro: "APIG 可以把 ECS 或函数中的接口包装为标准 API，增加鉴权、限流、日志和灰度发布能力。",
    learn: ["理解 API 分组、后端服务和发布环境", "为登录服务规划统一入口", "结合 IAM、签名或自定义认证保护接口"],
    resources: resourceSet("APIG", "huawei-cloud-network-query Skill"),
    sections: [
      { title: "适用时机", body: "PoC 阶段可以直接用 ECS 端口验证；进入多人或生产访问后，应考虑 APIG、HTTPS 和统一鉴权。" },
      { title: "审计与限流", body: "登录和 token 接口应有访问日志、限流和异常监控，避免被撞库或暴力调用。" }
    ],
    command: "hcloud APIG ListApis --cli-region=cn-north-4",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "APIG 文档", href: "https://support.huaweicloud.com/apig/" }]
  },
  ecs: {
    name: "ECS",
    title: "弹性云服务器 ECS",
    summary: "承载 Hermes Agent、OAuth2 Server 等长期运行进程，是路线图里的云端计算环境。",
    intro: "ECS 提供可登录的 Linux 运行环境。购买后需要确认镜像、规格、公网访问、安全组和登录凭据。",
    learn: ["选择 2 核 4G 或更高的 Ubuntu 实例", "配置 EIP 与安全组 SSH 访问", "登录服务器并安装 Agent 或 Node.js 服务"],
    resources: resourceSet("ECS", "huawei-cloud-computing-query Skill"),
    sections: [
      { title: "推荐配置", body: "实验环境推荐 2 核 4G 或更高、Ubuntu 22.04 LTS 或更高版本，并绑定公网 IP 便于远程访问。" },
      { title: "运行维护", body: "长期服务需要 systemd、日志轮转、监控告警和补丁管理，避免只依赖临时 nohup 进程。" }
    ],
    command: "ssh root@<your-server-ip>",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "ECS 购买指导", href: "https://support.huaweicloud.com/usermanual-ecs/ecs_03_7012.html" }]
  },
  eip: {
    name: "EIP",
    title: "弹性公网 IP EIP",
    summary: "为 ECS 或公网入口提供固定访问地址，便于 SSH 登录和外部访问。",
    intro: "EIP 把云服务器暴露到公网。实验中用于远程登录 ECS，生产中要配合安全组、堡垒机和访问控制使用。",
    learn: ["购买或绑定 EIP", "确认公网带宽与计费方式", "用安全组限制公网入口"],
    resources: resourceSet("EIP", "huawei-cloud-eip-cost-optimizer Skill"),
    sections: [
      { title: "成本控制", body: "EIP 可能按带宽或流量计费。实验结束后如果不再使用，应解绑或释放资源。" },
      { title: "安全边界", body: "公网 IP 只提供访问入口，不等于安全控制。SSH 和 API 端口需要通过安全组限制来源。" }
    ],
    command: "hcloud EIP ListPublicips --cli-region=cn-north-4",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "EIP 文档", href: "https://support.huaweicloud.com/eip/" }]
  },
  vpc: {
    name: "VPC",
    title: "虚拟私有云 VPC / 安全组",
    summary: "为 ECS、RDS 等资源提供网络隔离，并用安全组控制端口访问。",
    intro: "VPC 决定云资源所在网络，安全组是入方向和出方向访问控制。路线图里它控制 SSH、3001 API、RDS 3306 等端口边界。",
    learn: ["规划 VPC、子网和安全组", "只放通必要端口与来源 IP", "验证高危端口和全网段开放风险"],
    resources: resourceSet("VPC", "huawei-cloud-network-query Skill"),
    sections: [
      { title: "SSH 访问", body: "22 端口应限制为你的公网出口 IP。网络变化时及时更新，不建议长期开放 0.0.0.0/0。" },
      { title: "服务端口", body: "OAuth2 测试端口 3001 可短期开公网验证，生产环境应收敛到 HTTPS 或网关入口。" }
    ],
    command: "hcloud VPC ListVpcs --cli-region=cn-north-4\nhcloud VPC ListSecurityGroups --cli-region=cn-north-4",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "安全组配置指导", href: "https://support.huaweicloud.com/usermanual-ecs/zh-cn_topic_0140323157.html" }]
  },
  nodejs: {
    name: "Node.js",
    title: "Node.js 运行时",
    summary: "用于部署 OAuth2 Server 和其他轻量 API 服务。",
    intro: "Node.js + Express 能快速搭建健康检查、注册、登录、Token 刷新和 userinfo 接口，适合路线图中的登录服务实验。",
    learn: ["安装 Node.js 与 npm 依赖", "用 Express 暴露 OAuth2 相关接口", "通过 systemd 管理长期运行服务"],
    resources: [
      { type: "Skills", name: "Node.js 官网", href: "https://nodejs.org/" },
      { type: "CLI", name: "npm / nvm", href: "https://nodejs.org/en/download/package-manager" },
      { type: "API", name: "Express REST API", href: guideLinks.docs },
      { type: "SDK", name: "npm 包生态", href: "https://www.npmjs.com/" },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "服务启动", body: "PoC 可用 nohup 快速验证，稳定运行应改为 systemd 并接入日志。" },
      { title: "密钥管理", body: "JWT 私钥、数据库密码、client_secret 都只能放在服务端环境变量或密钥服务。" }
    ],
    command: "node -v\nnpm install express mysql2 bcryptjs jsonwebtoken",
    assistant: guideLinks.aiAssistant,
    sources: [{ label: "Node.js", href: "https://nodejs.org/" }]
  }
};

export const roadmapGuideTopics = {
  "guide-huawei-account": guideFromCapability("iam", {
    title: "IAM（华为云账号）",
    summary: "完成账号实名认证、区域项目确认和最小权限凭证准备。"
  }),
  "guide-ecs": guideFromCapability("ecs"),
  "guide-security": guideFromCapability("vpc", {
    title: "安全组（SSH 访问控制）",
    summary: "通过安全组控制 SSH、测试端口和内网数据库访问。"
  }),
  "guide-eip": guideFromCapability("eip"),
  "guide-cts": guideFromCapability("cts"),
  "guide-lts": guideFromCapability("lts"),
  "guide-smn": guideFromCapability("smn"),
  "guide-functiongraph": guideFromCapability("functiongraph"),
  "guide-obs": guideFromCapability("obs"),
  "guide-cdn": guideFromCapability("cdn"),
  "guide-dns": guideFromCapability("dns"),
  "guide-rds": guideFromCapability("rds"),
  "guide-apig": guideFromCapability("apig"),
  "guide-node": guideFromCapability("nodejs"),
  "guide-feishu": customGuide({
    name: "Feishu",
    title: "飞书账号 / 飞书机器人",
    intro: "准备可访问飞书开放平台的账号，创建机器人或应用，并在路线图中把 Hermes 或告警函数接入飞书。",
    learn: ["登录飞书开放平台", "准备机器人 AppID、App Secret 或群机器人 Webhook", "在群聊或私聊中验证消息收发"],
    resources: [
      { type: "入口", name: "飞书开放平台", href: guideLinks.feishu },
      { type: "Skills", name: "飞书机器人配置指引", href: guideLinks.feishu },
      { type: "CLI", name: "curl Webhook 测试", href: guideLinks.docs },
      { type: "API", name: "飞书开放 API", href: guideLinks.feishu },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "Agent 接入", body: "Hermes 路线使用飞书机器人承载对话入口；安全告警路线使用群机器人承载告警卡片。" },
      { title: "凭证保护", body: "App Secret 和 Webhook 地址属于敏感信息，不应写入前端仓库或公开评论。" }
    ],
    command: "hermes\n# 发送提示词：通过你内置的飞书对接能力帮我对接下飞书，并配置为系统服务",
    sources: [{ label: "飞书开放平台", href: guideLinks.feishu }]
  }),
  "guide-public-credential": customGuide({
    name: "ECS Login",
    title: "公网 IP / root 密码",
    intro: "保存 ECS 创建时生成的公网 IP、登录用户名和密码，用于第一次远程登录与初始化。",
    learn: ["找到 ECS 公网 IP 和登录方式", "使用 SSH 连接服务器", "首次登录后创建普通用户并降低 root 使用频率"],
    resources: [
      { type: "Skills", name: "huawei-cloud-computing-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "ECS CLI", href: guideLinks.cli },
      { type: "API", name: "ECS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "ECS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "登录信息", body: "ECS 公网 IP、用户名和密码只用于本地安全连接，不能放入页面文案、前端环境变量或公开 Issue。" },
      { title: "安全建议", body: "完成初始化后使用普通用户、SSH key、堡垒机或最小权限策略管理服务器。" }
    ],
    command: "ssh root@<your-server-ip>\nuseradd -m -s /bin/bash testhermes"
  }),
  "guide-hermes": customGuide({
    name: "Hermes",
    title: "智能体安装（Hermes 安装与初始化）",
    intro: "在 ECS 中安装 Hermes Agent，执行初始化配置，并接入模型与飞书。",
    learn: ["运行安装脚本", "执行 hermes setup 完成基础配置", "启动 Hermes 并让其引导飞书接入"],
    resources: [
      { type: "Skills", name: "Agent 部署实践", href: guideLinks.skillCenter },
      { type: "CLI", name: "Linux Shell", href: guideLinks.docs },
      { type: "API", name: "Hermes 安装脚本", href: guideLinks.hermesInstall },
      { type: "SDK", name: "模型 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "初始化", body: "不确定的配置可先 skip，确认模型与飞书信息后再回到 setup 补齐。" },
      { title: "长期运行", body: "验证完成后建议配置为 systemd 服务，补齐日志和重启策略。" }
    ],
    command: "curl -fsSL https://res1.hermesagent.org.cn/install.sh | bash\nhermes setup\nhermes",
    sources: [{ label: "Hermes 安装脚本", href: guideLinks.hermesInstall }]
  }),
  "agent-worker-architecture": customGuide({
    name: "Architecture",
    title: "整体架构",
    intro: "飞书客户端通过 WebSocket 长连接进入 Hermes Gateway，Gateway 调用 AI 模型并把回复发送回飞书。",
    learn: ["理解飞书入口、Gateway 和模型之间的数据流", "知道 WebSocket 长连接无需给飞书暴露公网回调", "定位消息收发、模型调用和回复发送的排障边界"],
    resources: [
      { type: "入口", name: "飞书开放平台", href: guideLinks.feishu },
      { type: "Skills", name: "Agent 架构实践", href: guideLinks.skillCenter },
      { type: "API", name: "飞书消息 API", href: guideLinks.feishu },
      { type: "SDK", name: "ModelArts / 模型 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "数据流", body: "用户在飞书发消息，Hermes Gateway 通过 WebSocket 接收。Gateway 调用 AI 模型生成回复，并通过飞书 API 发送回复。" }
    ]
  }),
  "architecture-client": customGuide({
    name: "Feishu Client",
    title: "飞书客户端（群聊 / 私聊）",
    intro: "用户在群聊或私聊中 @ 机器人，触发云端 Agent 对话。",
    learn: ["区分群聊和私聊触发方式", "验证机器人是否被添加到会话", "确认消息能进入 Gateway"],
    resources: [{ type: "入口", name: "飞书开放平台", href: guideLinks.feishu }],
    sections: [{ title: "验证方式", body: "在测试群 @ 机器人发送问题，观察是否收到 Agent 回复。" }]
  }),
  "architecture-websocket": customGuide({
    name: "WebSocket",
    title: "WebSocket 长连接（无需公网）",
    intro: "Hermes Gateway 与飞书保持长连接，降低回调地址和公网暴露要求。",
    learn: ["理解长连接的消息通道", "检查连接断开和重连日志", "区分网络问题和模型调用问题"],
    sections: [{ title: "排障边界", body: "飞书消息不到达时先看 WebSocket 连接；消息到达但无回复时再看模型和发送 API。" }]
  }),
  "architecture-hermes-gateway": customGuide({
    name: "Hermes Gateway",
    title: "Hermes Gateway（消息收发调度）",
    intro: "云端服务负责接收飞书消息、调用模型并发送回复。",
    learn: ["启动 Hermes Gateway", "查看消息收发日志", "配置模型与飞书凭证"],
    command: "hermes\njournalctl -u hermes -f",
    sections: [{ title: "职责", body: "Gateway 是 Agent 的运行核心，承担消息通道、模型调用和回复调度。" }]
  }),
  "architecture-ai-model": customGuide({
    name: "AI Model",
    title: "AI 模型（ModelArts / glm-5.1）",
    intro: "模型服务完成语义理解与回复生成，是 Agent 输出能力的来源。",
    learn: ["准备模型访问凭证", "验证模型接口可用", "限制模型可访问的账号和云资源边界"],
    resources: [
      { type: "Skills", name: "模型接入实践", href: guideLinks.skillCenter },
      { type: "SDK", name: "ModelArts / 模型 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "权限边界", body: "模型不应直接接触长期 AK/SK；工具调用和云资源访问应由受控 Gateway 执行。" }]
  }),
  "security-alert-architecture": customGuide({
    name: "Architecture",
    title: "架构图",
    intro: "安全组操作进入 CTS，日志转储到 LTS，关键词告警经 SMN 触发 FunctionGraph，最终推送飞书。",
    learn: ["理解 CTS -> LTS -> SMN -> FunctionGraph -> 飞书链路", "定位 5 分钟内未收到告警时应该检查的环节", "区分检测规则、消息路由和飞书推送问题"],
    resources: [
      { type: "Skills", name: "huawei-cloud-monitoring-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "CTS/LTS/SMN CLI", href: guideLinks.cli },
      { type: "API", name: "云监控与日志 API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "FunctionGraph SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "核心价值", body: "把审计日志转成可行动告警，让高危安全组变更在分钟级进入协同工具。" }]
  }),
  "guide-security-alert-rules": customGuide({
    name: "Security Rules",
    title: "安全组红线",
    intro: "围绕远程管理端口、全网段开放、木马端口、中间件端口和数据库端口建立 CRITICAL 告警规则。",
    learn: ["识别 22、3389、445、3306、6379 等高危端口", "配置 0.0.0.0/0 与 ::/0 全网段检测", "验证后及时撤销测试安全组规则"],
    resources: [
      { type: "Skills", name: "huawei-cloud-network-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "VPC 安全组 CLI", href: guideLinks.cli },
      { type: "API", name: "VPC 安全组 API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "VPC SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [
      { title: "7 条规则", body: "覆盖远程管理端口、全网段开放、木马端口、极高危端口、中间件/运维端口、数据库/缓存端口以及全端口开放。" }
    ],
    command: "security_group_rule AND (21 OR 22 OR 3389 OR 5900)\nsecurity_group_rule AND (0.0.0.0/0 OR ::/0)\nsecurity_group_rule AND (1433 OR 3306 OR 5432 OR 6379 OR 27017 OR 9200 OR 11211)"
  }),
  "guide-subscription": customGuide({
    name: "Subscription",
    title: "订阅函数",
    intro: "用 SMN 订阅 FunctionGraph 函数，把 LTS 告警消息交给转发逻辑。",
    learn: ["创建 SMN 主题", "把函数 URN 添加为订阅端点", "确认订阅状态和失败重试"],
    resources: [
      { type: "Skills", name: "huawei-cloud-monitoring-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "SMN CLI", href: guideLinks.cli },
      { type: "API", name: "SMN API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "SMN SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "hcloud SMN CreateTopic --name=cts-security-alert\nhcloud SMN AddSubscription --protocol=functionstage --endpoint=<function_urn>"
  }),
  "guide-alert-template": customGuide({
    name: "Alert Template",
    title: "通知模板",
    intro: "把原始告警 JSON 格式化为飞书卡片，让风险端口、操作者、资源 ID 和建议动作可读。",
    learn: ["解析 LTS 告警消息", "抽取 CTS 中的安全组规则字段", "输出飞书卡片标题、风险等级和处理建议"],
    resources: [
      { type: "Skills", name: "huawei-cloud-functiongraph-function-create Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "FunctionGraph CLI", href: guideLinks.cli },
      { type: "API", name: "FunctionGraph API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "FunctionGraph SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "卡片字段", body: "建议包含风险等级、命中规则、端口、源地址、操作者、资源 ID、发生时间和回滚建议。" }]
  }),
  "guide-cost": customGuide({
    name: "Cost",
    title: "成本估算",
    intro: "安全告警路线主要消耗日志存储、告警通知和函数调用资源，需要按实验规模控制保留周期。",
    learn: ["估算 LTS 日志存储与索引成本", "理解 FunctionGraph 调用计费", "实验结束后清理主题、规则和函数"],
    resources: [
      { type: "入口", name: "免费资源", href: guideLinks.freePack },
      { type: "CLI", name: "资源查询 CLI", href: guideLinks.cli },
      { type: "API", name: "费用中心", href: guideLinks.docs },
      { type: "SDK", name: "费用查询 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "控制建议", body: "PoC 保持较短日志保留期，完成验证后删除测试安全组规则、告警规则、SMN 主题和函数。" }]
  }),
  "guide-troubleshoot": customGuide({
    name: "Troubleshoot",
    title: "故障排查",
    intro: "按照 CTS 事件、LTS 告警、SMN 投递、FunctionGraph 日志、飞书接口返回逐层定位。",
    learn: ["判断 CTS 是否产生事件", "确认 LTS 规则是否命中", "检查函数日志与飞书 Webhook 返回"],
    resources: [
      { type: "Skills", name: "huawei-cloud-monitoring-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "日志与函数 CLI", href: guideLinks.cli },
      { type: "API", name: "云服务 API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "日志与函数 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "排查顺序", body: "没有日志看 CTS；有日志无告警看 LTS 规则；有告警无卡片看 SMN、函数日志和飞书 Webhook。" }]
  }),
  "static-site-architecture": customGuide({
    name: "Architecture",
    title: "架构图",
    intro: "用户访问自定义域名，DNS CNAME 指向 CDN，CDN 回源 OBS 静态网站托管。",
    learn: ["理解 DNS、CDN、OBS 三层职责", "定位 403、404、旧缓存和 Content-Type 问题", "发布后进行 cache-busting 验证"],
    resources: [
      { type: "Skills", name: "huawei-cloud-storage-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "OBS/CDN/DNS CLI", href: guideLinks.cli },
      { type: "API", name: "OBS/CDN/DNS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "OBS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "发布链路", body: "OBS 保存构建产物，CDN 缓存并加速，DNS 只负责把用户域名指向 CDN 分配域名。" }]
  }),
  "guide-domain": customGuide({
    name: "Domain",
    title: "自定义域名",
    intro: "确认域名可配置 DNS 解析，并准备绑定到 CDN 加速域名。",
    learn: ["确认域名管理权限", "规划 open.topxtopx.com 等访问路径", "避免同名记录冲突"],
    resources: [
      { type: "Skills", name: "huawei-cloud-network-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "DNS CLI", href: guideLinks.cli },
      { type: "API", name: "DNS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "DNS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "配置要求", body: "CDN 域名创建完成后，DNS 侧添加 CNAME 指向 CDN 分配域名。" }]
  }),
  "guide-index": customGuide({
    name: "Website Entry",
    title: "默认首页",
    intro: "OBS 静态网站托管需要明确默认首页，当前站点入口为 index.html。",
    learn: ["配置 index.html 为默认首页", "确认 openplatform 目录下页面可直接访问", "避免构建产物上传到错误层级"],
    resources: [
      { type: "Skills", name: "huawei-cloud-storage-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "OBS CLI", href: guideLinks.cli },
      { type: "API", name: "OBS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "OBS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "路径", body: "默认首页和路由页面应保持与 /openplatform/index.html、/openplatform/docs.html 等线上路径一致。" }]
  }),
  "guide-obsutil": customGuide({
    name: "Upload",
    title: "文件上传",
    intro: "把本地静态网站构建结果上传到 OBS 桶，并保持 HTML、资源和图片路径一致。",
    learn: ["上传 HTML、JS、CSS 和图片", "避免漏传路线图截图目录", "验证对象大小和更新时间"],
    resources: [
      { type: "Skills", name: "huawei-cloud-storage-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "OBS CLI / obsutil", href: guideLinks.cli },
      { type: "API", name: "OBS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "OBS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "hcloud OBS ListBuckets --cli-region=cn-north-4\n# 上传构建产物到 obs-hd-dev-static/openplatform/"
  }),
  "guide-path": customGuide({
    name: "Content-Type",
    title: "内容类型",
    intro: "HTML、Markdown、CSS、JS、PNG 等对象需要正确 Content-Type，避免页面下载或脚本执行失败。",
    learn: ["检查 HTML 是否 text/html", "检查 JS/CSS 是否使用正确 MIME", "确认 Markdown 指南不会被当作二进制下载"],
    resources: [
      { type: "Skills", name: "huawei-cloud-storage-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "OBS 对象元数据 CLI", href: guideLinks.cli },
      { type: "API", name: "OBS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "OBS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "curl -sI https://open.topxtopx.com/openplatform/index.html"
  }),
  "guide-refresh": customGuide({
    name: "CDN Refresh",
    title: "CDN 刷新",
    intro: "发布后刷新 CDN 缓存，确保用户访问到新的 HTML 与资源。",
    learn: ["创建 CDN 刷新任务", "区分目录刷新和 URL 刷新", "用 cache-busting 参数验证最新内容"],
    resources: [
      { type: "Skills", name: "huawei-cloud-network-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "CDN CLI", href: guideLinks.cli },
      { type: "API", name: "CDN API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "CDN SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "hcloud CDN CreateRefreshTasks --cli-region=cn-north-1\ncurl -sI \"http://open.topxtopx.com/openplatform/index.html?_=$(date +%s%N)\""
  }),
  "guide-cache": customGuide({
    name: "Cache-Control",
    title: "Cache-Control",
    intro: "用缓存头控制 HTML 与静态资源更新节奏，减少旧页面残留。",
    learn: ["HTML 使用短缓存或 no-cache", "带 hash 的资源使用长缓存", "发布后优先刷新入口 HTML"],
    resources: [
      { type: "Skills", name: "huawei-cloud-network-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "CDN/OBS CLI", href: guideLinks.cli },
      { type: "API", name: "CDN/OBS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "OBS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "推荐策略", body: "HTML no-cache，静态资源通过文件名 hash 实现长期缓存，避免用户加载新 HTML 时引用旧资源。" }]
  }),
  "oauth2-login-architecture": customGuide({
    name: "Architecture",
    title: "架构图",
    intro: "浏览器或应用访问 ECS 上的 Node.js Express 服务，服务通过内网连接 RDS MySQL。",
    learn: ["理解 App -> ECS -> RDS 的访问链路", "区分公网 API 端口和内网数据库端口", "规划 HTTPS、APIG 和日志审计扩展"],
    resources: [
      { type: "Skills", name: "huawei-cloud-computing-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "ECS/RDS CLI", href: guideLinks.cli },
      { type: "API", name: "ECS/RDS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "Node.js SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "安全边界", body: "3001 端口只用于测试；生产建议通过 HTTPS 或 APIG 暴露，RDS 只允许 ECS 内网访问。" }]
  }),
  "guide-api-tool": customGuide({
    name: "API Tool",
    title: "API 调试工具",
    intro: "使用浏览器或 curl 验证健康检查、注册、登录、用户信息和 Token 刷新接口。",
    learn: ["用 curl 发送 JSON 请求", "保存 access_token 并调用 userinfo", "通过状态码和响应体定位问题"],
    resources: [
      { type: "CLI", name: "curl", href: guideLinks.docs },
      { type: "API", name: "OAuth2 接口示例", href: guideLinks.docs },
      { type: "SDK", name: "HTTP 客户端 SDK", href: guideLinks.sdk },
      { type: "Skills", name: "接口调试实践", href: guideLinks.skillCenter },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "curl http://<ECS_IP>:3001/health"
  }),
  "guide-mysql": customGuide({
    name: "MySQL",
    title: "MySQL 建表",
    intro: "初始化 oauth_clients 和 users 表，支撑密码登录、Token 签发和用户信息查询。",
    learn: ["创建 oauth2_db 数据库", "创建客户端与用户表", "插入测试 client_id 和 client_secret 示例"],
    resources: [
      { type: "Skills", name: "huawei-cloud-storage-query Skill", href: guideLinks.skillCenter },
      { type: "CLI", name: "RDS/MySQL CLI", href: guideLinks.cli },
      { type: "API", name: "RDS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "mysql2 / RDS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "CREATE DATABASE oauth2_db DEFAULT CHARSET utf8mb4;\nINSERT INTO oauth_clients (client_id, client_secret, client_name) VALUES ('my-app', 'my-secret-key-2024', '我的应用');"
  }),
  "guide-token": customGuide({
    name: "JWT",
    title: "JWT Token",
    intro: "OAuth2 服务通过 access_token 和 refresh_token 管理登录态，并用 Bearer token 访问 userinfo。",
    learn: ["理解密码模式测试请求", "解析 access_token 与 refresh_token 的用途", "规划 Token 撤销、过期和密钥轮换"],
    resources: [
      { type: "Skills", name: "登录服务实践", href: guideLinks.skillCenter },
      { type: "CLI", name: "curl Token 测试", href: guideLinks.docs },
      { type: "API", name: "OAuth2 API", href: guideLinks.docs },
      { type: "SDK", name: "jsonwebtoken", href: "https://www.npmjs.com/package/jsonwebtoken" },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "curl -X POST http://<ECS_IP>:3001/token -H \"Content-Type: application/json\" -d '{\"grant_type\":\"password\",\"client_id\":\"my-app\",\"client_secret\":\"my-secret-key-2024\",\"username\":\"alice\",\"password\":\"MyPass@2024\"}'\ncurl http://<ECS_IP>:3001/userinfo -H \"Authorization: Bearer <access_token>\""
  }),
  "guide-curl": customGuide({
    name: "curl",
    title: "浏览器 / curl",
    intro: "在部署后用最小请求验证每个接口，快速区分服务启动、数据库连接和认证逻辑问题。",
    learn: ["验证 /health", "注册测试用户", "用 Bearer token 访问 /userinfo"],
    resources: [
      { type: "CLI", name: "curl", href: guideLinks.docs },
      { type: "API", name: "HTTP API", href: guideLinks.docs },
      { type: "SDK", name: "HTTP Client SDK", href: guideLinks.sdk },
      { type: "Skills", name: "接口测试实践", href: guideLinks.skillCenter },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "curl http://<ECS_IP>:3001/health\ncurl -X POST http://<ECS_IP>:3001/register -H \"Content-Type: application/json\" -d '{\"username\":\"alice\",\"password\":\"MyPass@2024\"}'"
  }),
  "guide-app": customGuide({
    name: "systemd",
    title: "systemd",
    intro: "把 OAuth2 Server 注册为系统服务，保证重启后自动恢复。",
    learn: ["编写 service 单元", "启用开机自启", "查看服务日志和状态"],
    resources: [
      { type: "CLI", name: "systemctl", href: guideLinks.docs },
      { type: "Skills", name: "Linux 服务运维", href: guideLinks.skillCenter },
      { type: "API", name: "ECS 运维 API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "ECS SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    command: "systemctl daemon-reload\nsystemctl enable oauth2-server\nsystemctl start oauth2-server\nsystemctl status oauth2-server"
  }),
  "guide-extend": customGuide({
    name: "Extensions",
    title: "进阶扩展",
    intro: "在服务跑通后补齐 HTTPS、短信验证码、Token 撤销、自定义域名和日志审计。",
    learn: ["规划 HTTPS 和域名入口", "增加短信验证码或多因子认证", "接入日志审计和异常告警"],
    resources: [
      { type: "Skills", name: "登录服务扩展实践", href: guideLinks.skillCenter },
      { type: "CLI", name: "APIG/DNS/LTS CLI", href: guideLinks.cli },
      { type: "API", name: "APIG/DNS/LTS API", href: guideLinks.apiExplorer },
      { type: "SDK", name: "云服务 SDK", href: guideLinks.sdk },
      { type: "MCP", name: "即将上线", href: guideLinks.mcp }
    ],
    sections: [{ title: "生产化", body: "上线前至少补齐 HTTPS、密钥管理、日志审计、访问限流和 Token 撤销能力。" }]
  }),
  "guide-logs": customGuide({
    name: "LTS",
    title: "LTS 日志审计",
    intro: "把 OAuth2 Server 的访问日志、登录失败和异常堆栈接入日志服务，便于审计和排障。",
    learn: ["收集应用日志", "记录登录失败和 Token 错误", "为异常峰值配置告警"],
    resources: resourceSet("LTS", "huawei-cloud-monitoring-query Skill"),
    sections: [{ title: "审计重点", body: "关注注册、登录失败、Token 刷新失败、userinfo 未授权和数据库连接异常。" }]
  })
};

export const roadmapList = [
  {
    id: "agent-worker",
    href: "ai-agent-worker.html",
    title: "基于华为云部署专属Agent",
    summary: "把 Agent 部署到云端，通过飞书随时访问自己的专属智能助手。",
    services: ["ECS", "Hermes", "AI 模型", "飞书"],
    outcome: "云端 Agent 可启动、可接收飞书消息、可调用模型并返回回复。"
  },
  {
    id: "security-alert",
    href: "cts-security-alert-agent.html",
    title: "基于CTS构建安全组告警Agent",
    summary: "监听云审计事件，识别安全组高风险变更并触发自动告警。",
    services: ["CTS", "LTS", "SMN", "FunctionGraph", "飞书"],
    outcome: "安全组开放高危端口后，告警链路在 5 分钟内推送到飞书群。"
  },
  {
    id: "static-site",
    href: "dns-cdn-obs-static-site.html",
    title: "基于OBS部署Web网站",
    summary: "通过 OBS 托管静态网站，接入 CDN 加速并绑定 DNS 自定义域名。",
    services: ["OBS", "CDN", "DNS"],
    outcome: "网站文件发布到 OBS，经 CDN 加速后可通过自定义域名访问。"
  },
  {
    id: "oauth2-login",
    href: "oauth2-login-service.html",
    title: "基于华为云部署OAuth2登录服务",
    summary: "用 ECS + RDS 搭建标准 OAuth2 Server，完成注册、登录和 Token 刷新。",
    services: ["ECS", "RDS", "Node.js", "JWT"],
    outcome: "登录服务具备 health、register、token、refresh、userinfo 接口。"
  }
];

export const roadmapDetails = {
  "ai-agent-worker.html": {
    ...roadmapList[0],
    subtitle: "把 Agent 部署到云端，通过飞书随时访问自己的专属 Agent。",
    steps: [
      {
        title: "前置准备",
        summary: "先准备可购买云资源的华为云账号，以及用于接入机器人的飞书账号。准备完成后，再进入 ECS 购买与 Agent 部署。",
        checklist: [
          "华为云账号已完成实名认证，可正常进入控制台并购买云资源。",
          "飞书账号已注册，可访问飞书开放平台。",
          "确认后续可创建 ECS，并保存公网 IP、登录用户名和密码。"
        ],
        resources: ["IAM", "飞书账号"]
      },
      {
        title: "ECS购买与配置",
        summary: "购买一台可公网访问的 ECS 作为 Hermes Agent 运行环境，并配置安全组。",
        checklist: [
          "购买 ECS，规格推荐 2核4G 或更高。",
          "选择 Ubuntu 镜像（22.04 LTS 或更高）。",
          "确认镜像、网络和公网访问配置。",
          "购买完成后找到公网 IP、用户名和密码入口。",
          "创建或选择安全组规则。",
          "放通出口 IP 访问安全组（SSH 22 端口）。",
          "保存创建 ECS 时填写的登录用户名和密码。",
          "在控制台查看 ECS 连接信息。",
          "使用公网 IP、用户名和密码远程登录 ECS。"
        ],
        config: [
          { label: "规格", value: "2核4G 或更高", note: "推荐 c6.large.2" },
          { label: "操作系统", value: "Ubuntu 22.04 LTS 或更高", note: "用于安装 Hermes" },
          { label: "公网 IP", value: "必须", note: "用于远程访问 ECS" },
          { label: "安全组", value: "放通 SSH 访问", note: "只允许你的出口 IP 访问" }
        ],
        command: "ssh root@<your-server-ip>",
        resources: ["ECS", "安全组", "EIP"],
        sources: [
          { label: "ECS 购买指导", href: "https://support.huaweicloud.com/usermanual-ecs/ecs_03_7012.html" },
          { label: "安全组配置指导", href: "https://support.huaweicloud.com/usermanual-ecs/zh-cn_topic_0140323157.html" }
        ]
      },
      {
        title: "AI Agent 安装",
        summary: "登录 ECS 后创建独立用户，安装 Hermes，并执行初始化配置。",
        command: "ssh root@<your-server-ip>\nuseradd -m -s /bin/bash testhermes\ncurl -fsSL https://res1.hermesagent.org.cn/install.sh | bash\nhermes setup",
        checklist: [
          "通过 SSH 登录 ECS。",
          "创建普通用户 testhermes，避免长期使用 root 操作。",
          "执行 Hermes 安装命令。",
          "安装完成后执行 hermes setup；不确定的配置可先 skip。",
          "完成模型接入配置后，确认 Hermes 可正常启动。"
        ],
        resources: ["Hermes Gateway", "ModelArts / 大模型"],
        sources: [{ label: "Hermes 安装脚本", href: guideLinks.hermesInstall }],
        screenshots: [
          { src: "images/agent-screenshots/1784872881539_image.png", caption: "Agent 服务部署与连接验证" },
          { src: "images/agent-screenshots/1784872916573_image.png", caption: "模型调用链路检查" }
        ]
      },
      {
        title: "AI Agent连接飞书",
        summary: "启动 Hermes 后，使用内置飞书对接能力完成机器人接入。",
        command: "hermes\n# 提示词：通过你内置的飞书对接能力帮我对接下飞书，并配置为系统服务",
        checklist: [
          "在 ECS 中执行 hermes，启动交互流程。",
          "按 Hermes 引导提供飞书机器人所需信息（AppID、App Secret）。",
          "在飞书中确认机器人可被 @ 和接收消息。"
        ],
        resources: ["飞书机器人", "WebSocket"],
        sources: [{ label: "飞书开放平台", href: guideLinks.feishu }],
        screenshots: [
          { src: "images/agent-screenshots/1784872944551_image.png", caption: "飞书机器人入口配置" },
          { src: "images/agent-screenshots/1784872981692_image.png", caption: "消息事件接入 Agent Gateway" }
        ]
      },
      {
        title: "使用Agent",
        summary: "在飞书群聊或私聊中 @ 机器人，用自然语言访问已经部署在云端的专属 Agent。",
        command: "@你的机器人 查看我的华为云账户信息",
        checklist: [
          "在飞书中拉一个测试群。",
          "@ 你的机器人并发送测试问题。",
          "确认机器人能在飞书会话中返回结果，完成端到端验证。"
        ],
        screenshots: [
          { src: "images/agent-screenshots/1784873006817_image.png", caption: "飞书中完成 Agent 对话验证" }
        ]
      }
    ],
    agentDoc: [
      "目标：把 Hermes Agent 部署到华为云 ECS，并通过飞书机器人随时访问云端 Agent。",
      "路线图总览：前置准备、ECS购买与配置、AI Agent 安装、AI Agent连接飞书、使用Agent。",
      "验证：ECS 可登录、Hermes 可启动、飞书可接收、Agent 有回复。"
    ]
  },
  "cts-security-alert-agent.html": {
    ...roadmapList[1],
    subtitle: "安全组高危端口或全网段开放后，5 分钟内自动检测并推送飞书群告警卡片。",
    steps: [
      {
        title: "前置准备",
        summary: "准备华为云账号、飞书群机器人。",
        checklist: ["账号可进入 CTS、LTS、SMN、FunctionGraph、VPC 控制台。", "飞书群机器人 Webhook 已准备。"],
        resources: ["IAM", "飞书机器人"]
      },
      {
        title: "审计日志接入",
        summary: "让云审计服务 CTS 将所有 API 操作日志实时转储到日志服务 LTS。",
        command: "hcloud CTS ListTrackers --cli-region=cn-north-4\nhcloud CTS CreateTracker --tracker_type=system --tracker_name=system --is_lts_enabled=true",
        checklist: ["CTS 追踪器启用。", "LTS 中存在 CTS 日志组和 system-trace 日志流。"],
        resources: ["CTS", "LTS"]
      },
      {
        title: "告警规则配置",
        summary: "围绕安全组操作、高危端口和全网段开放创建 CRITICAL 级别关键词规则。",
        command: "sg-risk-port-remote: security_group_rule AND (21 OR 22 OR 3389 OR 5900)\nsg-risk-ipv4: security_group_rule AND (0.0.0.0/0 OR ::/0)\nsg-risk-port-trojan: security_group_rule AND (4444 OR 6666 OR 9999 OR 31337 OR 1080 OR 27445 OR 13579)\nsg-risk-port-extreme: security_group_rule AND (445 OR 135 OR 139 OR 23)\nsg-risk-port-middleware: security_group_rule AND (8005 OR 8009 OR 7001 OR 7002 OR 8080 OR 8081 OR 9090 OR 161 OR 514 OR 162)\nsg-risk-port-db: security_group_rule AND (1433 OR 3306 OR 5432 OR 6379 OR 27017 OR 9200 OR 11211)\nsg-risk-port: 1-65535",
        checklist: ["检测频率 5 分钟。", "匹配条数 >= 1。", "通知规则指向飞书告警链路。"],
        resources: ["安全组红线", "关键词规则"],
        sections: [
          { title: "7 条告警规则", body: "远程管理端口、全网段开放、木马常用端口、极度危险端口、中间件/运维端口、数据库/缓存端口和全端口开放。" }
        ]
      },
      {
        title: "飞书告警转发",
        summary: "函数接收 SMN 推送的告警 JSON，解析 CTS 日志并格式化为飞书卡片。",
        command: "hcloud SMN CreateTopic --name=cts-security-alert\nhcloud SMN AddSubscription --protocol=functionstage --endpoint=<function_urn>",
        checklist: ["SMN 主题已创建。", "FunctionGraph 函数可处理告警 JSON。", "飞书 Webhook 不写入前端源码。"],
        resources: ["SMN", "FunctionGraph"],
        screenshots: [
          { src: "images/cts-security-alert/1785160615437_image.png", caption: "SMN 与 FunctionGraph 告警转发配置" },
          { src: "images/cts-security-alert/1785160671512_image.png", caption: "告警事件格式化处理" }
        ]
      },
      {
        title: "端到端验证",
        summary: "开放高危安全组规则，检查 LTS 告警历史和飞书群卡片。",
        checklist: ["开放 TCP 22 或 0.0.0.0/0 测试规则。", "5 分钟内收到飞书告警。", "验证后撤销测试规则。"],
        resources: ["LTS 告警历史", "飞书告警卡片"],
        screenshots: [
          { src: "images/cts-security-alert/1785162901076_image.png", caption: "飞书群收到安全组风险告警卡片" }
        ]
      }
    ],
    agentDoc: [
      "目标：把安全组高风险变更从审计日志转换成实时飞书告警。",
      "链路：安全组操作 -> CTS -> LTS -> SMN -> FunctionGraph -> 飞书。",
      "规则：7 条 CRITICAL 关键词规则覆盖远程管理端口、全网段开放、木马端口、中间件和数据库端口。"
    ]
  },
  "dns-cdn-obs-static-site.html": {
    ...roadmapList[2],
    subtitle: "将本地静态网站文件上传到 OBS 桶，通过 CDN 加速分发，并用 DNS CNAME 绑定自定义域名访问。",
    steps: [
      {
        title: "前置准备",
        summary: "准备可创建 OBS、CDN、DNS 资源的华为云账号，并确认自定义域名、桶名和本地静态网站文件。",
        checklist: ["账号已实名。", "域名已托管或可配置 CNAME。", "准备 index.html 和静态资源目录。"],
        config: [
          { label: "域名", value: "open.topxtopx.com" },
          { label: "桶名", value: "obs-hd-dev-static" },
          { label: "区域", value: "cn-north-4" },
          { label: "默认首页", value: "index.html" }
        ],
        resources: ["IAM", "自定义域名"]
      },
      {
        title: "OBS 桶静态托管",
        summary: "创建 OBS 桶存放静态网站文件，开启静态网站托管后作为 CDN 的源站。",
        command: "hcloud OBS CreateBucket --cli-region=cn-north-4 --bucket=obs-hd-dev-static\nhcloud OBS GetBucketWebsite --bucket=obs-hd-dev-static",
        checklist: ["桶已创建。", "静态网站托管开启。", "index.html 位于默认首页路径。"],
        resources: ["OBS"],
        screenshots: [
          { src: "images/obs-web-site/1785483095224_image.png", caption: "OBS 桶创建与基础配置" },
          { src: "images/obs-web-site/1785483367065_image.png", caption: "OBS 静态网站托管设置" }
        ]
      },
      {
        title: "CDN 加速配置",
        summary: "创建 CDN 加速域名，源站类型选择 OBS 桶网站托管，使边缘节点缓存并加速分发静态内容。",
        command: "hcloud CDN ShowDomainDetailByName --cli-region=cn-north-1 --domain_name=open.topxtopx.com",
        checklist: ["源站指向 OBS 网站托管端点。", "HTML 短缓存，带 hash 静态资源长缓存。"],
        resources: ["CDN", "Cache-Control"],
        screenshots: [
          { src: "images/obs-web-site/1785483464364_image.png", caption: "CDN 加速域名配置" }
        ]
      },
      {
        title: "DNS CNAME 解析",
        summary: "在华为云 DNS 中添加 CNAME 记录，将 open.topxtopx.com 指向 CDN 分配的 CNAME 域名。",
        command: "dig open.topxtopx.com\n# 期望看到 CNAME 指向 CDN 域名",
        checklist: ["同名 A 记录已清理。", "CNAME 生效后再做访问验证。"],
        resources: ["DNS"],
        screenshots: [
          { src: "images/obs-web-site/1785483985376_image.png", caption: "DNS CNAME 解析配置" }
        ]
      },
      {
        title: "上传网站文件",
        summary: "将本地静态网站内容上传到 OBS 桶，确保默认首页和静态资源位于正确位置。",
        command: "hcloud OBS ListBuckets --cli-region=cn-north-4\n# 上传 portal/public 到 OBS 桶的 openplatform 目录",
        checklist: ["HTML、JS、CSS 和图片资源已上传。", "路线图截图目录完整。", "Content-Type 与文件类型一致。"],
        resources: ["文件上传", "内容类型"],
        screenshots: [
          { src: "images/obs-web-site/1785484330244_image.png", caption: "网站文件上传后访问验证" }
        ]
      },
      {
        title: "刷新与验证",
        summary: "上传完成后刷新 CDN 缓存，并用带 cache-busting 参数的请求验证完整访问链路。",
        command: "hcloud CDN CreateRefreshTasks --cli-region=cn-north-1\ncurl -sI \"http://open.topxtopx.com/openplatform/index.html?_=$(date +%s%N)\"",
        checklist: ["关键页面返回 200。", "HTML 响应头符合缓存策略。", "刷新后页面内容是最新版本。"],
        resources: ["CDN 刷新", "Cache-Control"],
        screenshots: [
          { src: "images/obs-web-site/1785484495425_image.png", caption: "CDN 缓存刷新验证" }
        ]
      }
    ],
    agentDoc: [
      "目标：将本地静态网站文件部署到华为云 OBS 桶，通过 CDN 加速分发，绑定自定义域名。",
      "路线图总览：OBS 桶与静态托管、CDN 加速配置、DNS CNAME 解析、上传静态网站文件、刷新 CDN 缓存并验证。",
      "验证：DNS CNAME 生效、CDN 域名 online、OBS 源站可回源、HTML 可访问。"
    ]
  },
  "oauth2-login-service.html": {
    ...roadmapList[3],
    subtitle: "用 ECS + RDS 搭建标准 OAuth2 Server，提供注册、登录、Token 刷新和用户信息接口。",
    steps: [
      {
        title: "前置准备",
        summary: "准备已实名华为云账号、SSH 工具和浏览器或 curl，确认后续可以创建 RDS 与 ECS 资源。",
        checklist: ["账号可创建 ECS 和 RDS。", "SSH 工具可用。", "准备记录 RDS 密码和 ECS 公网 IP。"],
        resources: ["IAM", "API 调试工具"]
      },
      {
        title: "RDS 创建建表",
        summary: "创建 MySQL RDS 实例，建库并创建 OAuth2 客户端表和用户表。",
        command: "CREATE DATABASE oauth2_db DEFAULT CHARSET utf8mb4;\nCREATE TABLE oauth_clients (client_id VARCHAR(64) PRIMARY KEY, client_secret VARCHAR(255) NOT NULL, client_name VARCHAR(128) NOT NULL);\nCREATE TABLE users (id BIGINT PRIMARY KEY AUTO_INCREMENT, username VARCHAR(64) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL);\nINSERT INTO oauth_clients (client_id, client_secret, client_name) VALUES ('my-app', 'my-secret-key-2024', '我的应用');",
        checklist: ["RDS 与 ECS 同 VPC。", "3306 仅对 ECS 内网 IP 放行。", "客户端密钥不写入前端。"],
        resources: ["RDS", "MySQL 建表"]
      },
      {
        title: "ECS 购买与配置",
        summary: "购买 Ubuntu ECS 作为 OAuth2 Server 运行环境，开放 SSH 与 API 访问端口。",
        command: "ssh root@<ECS公网IP>",
        checklist: ["安全组放通 22。", "测试阶段可放通 3001。", "记录公网 IP 和内网 IP。"],
        resources: ["ECS", "安全组"]
      },
      {
        title: "安装 OAuth2 服务",
        summary: "登录 ECS 后执行部署脚本，安装 Node.js、创建项目、写入 Express 服务代码并启动 3001 端口。",
        command: "npm install express mysql2 bcryptjs jsonwebtoken\nDB_HOST=<RDS内网地址> PORT=3001 nohup node app.js > app.log 2>&1 &",
        checklist: ["GET /health 正常。", "app.log 无启动错误。", "数据库连接使用内网地址。"],
        resources: ["Node.js", "JWT Token"]
      },
      {
        title: "登录功能测试",
        summary: "用 curl 或浏览器依次验证健康检查、用户注册、密码登录、userinfo 和 Token 刷新。",
        command: "curl http://<ECS_IP>:3001/health\ncurl -X POST http://<ECS_IP>:3001/register -H \"Content-Type: application/json\" -d '{\"username\":\"alice\",\"password\":\"MyPass@2024\"}'\ncurl -X POST http://<ECS_IP>:3001/token -H \"Content-Type: application/json\" -d '{\"grant_type\":\"password\",\"client_id\":\"my-app\",\"client_secret\":\"my-secret-key-2024\",\"username\":\"alice\",\"password\":\"MyPass@2024\"}'\ncurl http://<ECS_IP>:3001/userinfo -H \"Authorization: Bearer <access_token>\"",
        checklist: ["注册用户成功。", "密码登录返回 access_token。", "Bearer token 可访问 userinfo。"],
        resources: ["浏览器 / curl", "JWT Token"]
      },
      {
        title: "开机自启与扩展",
        summary: "服务跑通后配置 systemd 开机自启，并按需补齐 HTTPS、短信验证码、Token 撤销和日志审计。",
        command: "systemctl daemon-reload\nsystemctl enable oauth2-server\nsystemctl start oauth2-server",
        checklist: ["systemctl status 正常。", "生产环境补 HTTPS。", "接入 LTS 记录审计日志。"],
        resources: ["systemd", "进阶扩展", "LTS 日志审计"]
      }
    ],
    agentDoc: [
      "目标：用华为云 ECS + RDS 搭建一套标准 OAuth2 Server。",
      "接口：/health、/register、/token、/refresh、/userinfo。",
      "安全建议：client_secret、JWT 私钥、数据库密码都只能放在服务端环境变量或密钥管理中。"
    ]
  }
};

export function getRoadmapByPage(pageName) {
  return roadmapDetails[pageName] || null;
}
