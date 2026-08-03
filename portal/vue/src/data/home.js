export const links = {
  aiShell: "https://devstation.connect.huaweicloud.com/aishell",
  pluginMarket: "https://marketplace.visualstudio.com/search?term=Huawei%20Cloud&target=VSCode",
  freePack: "https://activity.huaweicloud.com/free_test/index.html",
  codeArtsTrial: "https://codearts.huaweicloud.com/portal/settings/subscription?from=buy",
  apiExplorer: "https://apiexplorer.developer.huaweicloud.com/"
};

export const navLinks = [
  ["AI Agent路线图", "ai-agent-roadmap.html", "roadmap"],
  ["Icons库", "icons.html", "icons"],
  ["开发文档", "docs.html", "docs"]
];

export const banners = [
  {
    title: "AI 开发者空间 自然语言对话管理云资源",
    desc: "用一句话查询资源、生成命令、定位接口，让 Agent 与开发者在同一个云资源上下文里协同。",
    code: "AI 开发者空间 > 查询本周 ECS 异常实例，并生成 KooCLI 修复命令",
    visual: [["terminal", "自然语言生成 KooCLI 命令"], ["search-code", "匹配云资源接口"], ["shield-check", "权限边界内执行"]],
    actions: [["立即体验", links.aiShell, "primary"], ["查看文档", "docs.html#huaweicloud-devkit", "secondary"]]
  },
  {
    title: "一行命令接入华为云插件 HuaweiCloud Devkit",
    desc: "安装 HuaweiCloud Devkit 后，直接在 Agent 中用自然语言探查资源、生成命令、创建代码模板并完成安全认证。KooCLI、SDK、Terraform、APIG 智能编排，助你即刻对话上云。",
    code: "npm install -g hc-devkit",
    visual: [["plug", "一行命令接入"], ["search-code", "自然语言探查资源"], ["workflow", "工具智能编排"]],
    actions: [["安装插件", links.pluginMarket, "primary"], ["开发文档", "docs.html#huaweicloud-devkit", "secondary"]]
  },
  {
    title: "开发者领取和配置资源，Agent 调用资源",
    desc: "用免费资源完成实验环境搭建，结合 API、SDK、KooCLI 快速验证 Agent 调用链路。",
    code: "resource pack > ECS / OBS / FunctionGraph > agent task",
    visual: [["gift", "领取免费资源"], ["cloud-cog", "配置实验环境"], ["bot", "Agent 调用资源"]],
    actions: [["立即领取", links.freePack, "primary"], ["参考案例", "cases.html", "secondary"]]
  },
  {
    title: "开通华为云码道代码智能体体验版",
    desc: "用 CodeArts 连接代码理解、测试、流水线与云资源部署，让开发任务从提示词走到交付。",
    code: "CodeArts Agent > plan > code > test > deploy",
    visual: [["square-code", "理解工程上下文"], ["git-pull-request-arrow", "生成变更建议"], ["workflow", "触发交付流水线"]],
    actions: [["免费开通", links.codeArtsTrial, "primary"], ["查看案例", "case-detail.html?case=codearts", "secondary"]]
  }
];

export const cases = [
  {
    id: "codearts",
    title: "CodeArts 代码智能体驱动 DevOps",
    desc: "让 Agent 理解需求、生成变更、触发流水线并沉淀交付反馈。",
    tags: ["CodeArts", "DevOps", "代码智能体"]
  },
  {
    id: "vpc",
    title: "VPC 网络环境自动化创建",
    desc: "通过 Notebook 与云资源 API 创建 VPC、子网、安全组并完成验证。",
    tags: ["VPC", "API Explorer", "自动化"]
  },
  {
    id: "email",
    title: "OpenClaw 邮件助手",
    desc: "通过开放插件处理邮件读取、摘要、分类与后续任务触发。",
    tags: ["OpenClaw", "Skill", "自动化"]
  },
  {
    id: "skills",
    title: "OpenClaw 查找 Skills",
    desc: "让 Agent 根据任务语义搜索合适 Skill，并组合成工具调用链。",
    tags: ["OpenClaw", "Skills", "工具发现"]
  }
];

export const capabilities = [
  {
    tab: "插件集成",
    title: "HuaweiCloud Devkit，Agent 操作华为云资源的 MCP 插件",
    desc: "支持远端零安装和 npm 本地代理，为 Agent 提供认证、代金券与 ECS、VPC、OBS、RDS、CCE 等云资源的自然语言查询和管理能力。",
    workflow: [
      ["安装插件", "在终端执行 npm install -g hc-devkit，完成 Agent 配置后即可开始使用。"],
      ["匿名探索", "无需登录，直接提问即可获取实时解答。例如：“ECS 有哪些规格？”“如何用 Terraform 创建 VPC？”"],
      ["登录认证", "提供华为云 AK/SK 后，插件将自动识别账号信息，并支持长期凭证与临时凭证两种认证方式。"],
      ["操作云资源", "用自然语言说出你的操作目标，插件会在隔离沙箱中自动调度 KooCLI、SDK、Terraform 或 APIG，完成云资源管理。"]
    ]
  },
  {
    tab: "接口开放",
    title: "从接口发现到工程集成",
    desc: "通过 MCP、API Explorer、SDK、KooCLI、Terraform，把云服务集成到应用、脚本和 Agent 工具调用中。",
    items: [
      ["API Explorer", "在线调试接口并生成调用样例", links.apiExplorer, "1.7万+", "API 接口覆盖"],
      ["SDK", "多语言应用集成与服务封装", "https://sdkcenter.developer.huaweicloud.com/", "900+", "SDK安装包"],
      ["KooCLI", "命令行调用云服务和自动化脚本", "https://support.huaweicloud.com/hcli/index.html", "140+", "KooCLI 可调用云服务"],
      ["Terraform", "基础设施即代码编排资源", "https://github.com/huaweicloud/terraform-provider-huaweicloud", "370万+", "Terraform 模板累计使用"],
      ["MCP", "将云服务能力封装为 Agent 可调用工具", "#capabilities", "即将上线", "MCP 工具调用数据"]
    ]
  },
  {
    tab: "生态开放",
    title: "学习、试用、成长、变现一站连接",
    desc: "把云实验、Hands-On、社区和认证串成持续成长路径。",
    items: [
      ["云实验", "在线实验环境和动手实践", "https://lab.huaweicloud.com/"],
      ["Hands-On", "场景化案例教程与代码资产", "https://gitcode.com/hands-on/case-content"],
      ["社区", "开发者问答、活动和经验沉淀", "https://bbs.huaweicloud.com/"],
      ["认证", "职业认证与能力证明", "https://edu.huaweicloud.com/certifications"]
    ]
  }
];

export const footerColumns = [
  {
    title: "产品能力",
    links: [
      ["AI Agent路线图", "ai-agent-roadmap.html"],
      ["Icons库", "icons.html"],
      ["HuaweiCloud Devkit", links.pluginMarket],
      ["AI 开发者空间", links.aiShell]
    ]
  },
  {
    title: "开发者资源",
    links: [
      ["开发文档", "docs.html"],
      ["API Explorer", links.apiExplorer],
      ["SDK 中心", "https://sdkcenter.developer.huaweicloud.com/"],
      ["KooCLI", "https://support.huaweicloud.com/hcli/index.html"],
      ["Terraform", "https://github.com/huaweicloud/terraform-provider-huaweicloud"]
    ]
  },
  {
    title: "学习与成长",
    links: [
      ["云实验", "https://lab.huaweicloud.com/"],
      ["Hands-On", "https://gitcode.com/hands-on/case-content"],
      ["职业认证", "https://edu.huaweicloud.com/certifications"],
      ["参考案例", "cases.html"]
    ]
  },
  {
    title: "社区与支持",
    links: [
      ["GitHub 开源", "https://github.com/huaweicloud"],
      ["GitCode 开源", "https://gitcode.com/huaweicloud"],
      ["开发者社区", "https://bbs.huaweicloud.com/"],
      ["最新活动", "activity.html"]
    ]
  }
];

export const footerLegal = [
  ["法律声明", "https://www.huaweicloud.com/declaration/statement.html"],
  ["隐私政策", "https://www.huaweicloud.com/declaration/privacy.html"],
  ["服务协议", "https://www.huaweicloud.com/declaration/tos.html"]
];

export const agentSteps = [
  ["第一步", "让您的Agent安装华为云插件", "请在终端执行以下命令安装华为云 Agent 插件", "npm install -g hc-devkit", "复制安装提示词"],
  ["第二步", "让您的Agent使用插件", "插件安装完成后，把想查询或操作的云任务直接告诉您的Agent", "查询我的华为云账单", "复制使用提示词"]
];

export const communityRepos = [
  {
    icon: "github",
    title: "GitHub · huaweicloud",
    desc: "面向全球开发者的华为云开源组织，集中发布 SDK、Terraform Provider、工具链、示例项目与社区协作仓库，便于开发者参与 Issue、PR 和国际开源生态共建。",
    href: "https://github.com/huaweicloud",
    label: "进入 GitHub 仓库"
  },
  {
    icon: "code-2",
    title: "GitCode · huaweicloud",
    desc: "面向国内开发者的华为云代码空间，承载开源项目、示例资产和实践教程，便于在国内网络环境下浏览、克隆、协作，并快速复用华为云开发能力。",
    href: "https://gitcode.com/huaweicloud",
    label: "进入 GitCode 仓库"
  }
];
