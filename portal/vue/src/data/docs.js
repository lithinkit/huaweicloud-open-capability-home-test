import { links } from "./home";

export const docsSections = [
  {
    id: "huaweicloud-devkit",
    title: "HuaweiCloud Devkit",
    summary: "面向 AI Agent 的华为云 MCP 插件入口，把账号认证、资源查询、命令生成和云服务调用组织到同一套开放能力中。",
    command: "npm install -g hc-devkit",
    bullets: [
      "支持在 Agent 环境中接入华为云账号、项目、区域和临时凭证。",
      "将 KooCLI、Terraform、SDK、APIG 等能力编排成 Agent 可调用工具。",
      "适合在代码智能体、运维助手和云资源助手中完成资源查询、配置生成与操作建议。"
    ],
    actions: [
      ["安装插件", links.pluginMarket],
      ["进入 AI 开发者空间", links.aiShell]
    ]
  },
  {
    id: "explorer",
    title: "API Explorer",
    summary: "在线检索、调试华为云开放 API，并生成 SDK、CLI 和请求示例，是 Agent 构建工具调用的主要入口。",
    bullets: [
      "按云服务、接口名、参数和响应结构检索 API。",
      "快速生成可放进自动化脚本、Agent 工具或调试文档的调用样例。"
    ],
    actions: [["打开 API Explorer", links.apiExplorer]]
  },
  {
    id: "koocli",
    title: "KooCLI",
    summary: "华为云命令行工具，适合把云资源查询、创建和排障步骤沉淀为 Agent 可执行命令。",
    command: "hcloud --help\nhcloud ECS NovaListServers --cli-region=<region>",
    bullets: [
      "覆盖 ECS、VPC、OBS、RDS、CTS、LTS、SMN、FunctionGraph 等云服务。",
      "适合与 Devkit、API Explorer 一起形成从自然语言到命令执行的链路。"
    ],
    actions: [["KooCLI 文档", "https://support.huaweicloud.com/hcli/index.html"]]
  },
  {
    id: "sdk",
    title: "SDK",
    summary: "面向 Java、Python、Go、Node.js 等语言的华为云服务 SDK，用于把云服务能力集成进业务应用和 Agent 工具服务。",
    bullets: [
      "适合长期运行的应用服务、后台任务和自定义工具封装。",
      "可从 API Explorer 直接跳转 SDK Center 获取语言版本示例。"
    ],
    actions: [["SDK Center", "https://sdkcenter.developer.huaweicloud.com/"]]
  },
  {
    id: "terraform",
    title: "Terraform",
    summary: "用基础设施即代码描述 VPC、ECS、OBS、RDS 等资源，适合让 Agent 生成、解释和审查云资源编排计划。",
    command: "terraform init\nterraform plan\nterraform apply",
    bullets: [
      "资源创建过程可审查、可复用、可回滚。",
      "适合与 KooCLI 和 MCP 能力组合，形成从规划到交付的闭环。"
    ],
    actions: [["HuaweiCloud Terraform Provider", "https://github.com/huaweicloud/terraform-provider-huaweicloud"]]
  },
  {
    id: "mcp",
    title: "MCP",
    summary: "把华为云服务封装为 Agent 可理解、可调用、可授权的工具接口，统一工具发现、凭证边界和执行反馈。",
    bullets: [
      "适合建设企业内部 Agent 工具箱和开放能力目录。",
      "需要明确工具权限、参数校验、审计记录和失败回滚策略。"
    ],
    actions: [["查看路线图", "ai-agent-roadmap.html"]]
  }
];

export const docsHighlights = [
  ["统一入口", "Devkit、API Explorer、KooCLI、SDK、Terraform 与 MCP 放在同一文档导航中。"],
  ["Agent 友好", "每个能力都提供可复制命令、接入说明和工具链定位。"],
  ["工程落地", "文档内容按开发、调试、自动化、上线和排障路径组织。"]
];
