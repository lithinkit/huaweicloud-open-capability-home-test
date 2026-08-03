export const cases = [
  {
    id: "codearts",
    icon: "git-pull-request-arrow",
    type: "Agentic DevOps",
    title: "CodeArts 代码智能体驱动 DevOps",
    desc: "让 Agent 理解需求、生成变更、触发流水线并沉淀交付反馈。",
    source: "https://gitcode.com/hands-on/case-content/blob/main/cases/CodeArts-agentic-devops/README.md",
    diagram: ["需求", "Agent", "流水线"],
    tags: ["CodeArts", "DevOps", "代码智能体"],
    outcome: "把研发任务拆成可执行步骤，降低从需求到部署的切换成本。",
    steps: ["读取任务与代码上下文", "生成或修改工程代码", "触发检查、构建与部署", "回收结果并形成下一轮建议"],
    abilities: ["CodeArts Repo", "CodeArts Pipeline", "API Explorer", "KooCLI"]
  },
  {
    id: "vpc",
    icon: "network",
    type: "云资源编排",
    title: "VPC 网络环境自动化创建",
    desc: "通过 Notebook 与云资源 API 创建 VPC、子网、安全组并完成验证。",
    source: "https://gitcode.com/hands-on/case-content/blob/main/cases/huawei-vpc-tutorial/.ipynb_checkpoints/README-checkpoint.md",
    diagram: ["Notebook", "API Explorer", "VPC"],
    tags: ["VPC", "API Explorer", "自动化"],
    outcome: "把网络资源配置转成可复现流程，适合 Agent 在测试环境里自动准备基础设施。",
    steps: ["确认区域与认证信息", "创建 VPC 与子网", "配置安全组规则", "校验资源状态并输出命令"],
    abilities: ["VPC", "API Explorer", "SDK", "Terraform"]
  },
  {
    id: "email",
    icon: "mail-check",
    type: "办公协同",
    title: "OpenClaw 邮件助手",
    desc: "通过开放插件处理邮件读取、摘要、分类与后续任务触发。",
    source: "https://gitcode.com/hands-on/case-content/blob/main/cases/openclaw-email-tutorial/README.md",
    diagram: ["邮件", "Skill", "任务"],
    tags: ["OpenClaw", "Skill", "自动化"],
    outcome: "让 Agent 从邮件入口识别任务，并调用开放能力完成摘要、提醒和流程创建。",
    steps: ["连接邮件数据源", "识别意图和关键信息", "匹配 Skill 或云服务工具", "输出后续动作与审计记录"],
    abilities: ["Skill", "MCP", "FunctionGraph", "消息通知"]
  },
  {
    id: "skills",
    icon: "sparkles",
    type: "能力发现",
    title: "OpenClaw 查找 Skills",
    desc: "让 Agent 根据任务语义搜索合适 Skill，并组合成工具调用链。",
    source: "https://gitcode.com/hands-on/case-content/blob/main/cases/openclaw-find-skills-tutorial/README.md",
    diagram: ["意图", "检索", "调用"],
    tags: ["OpenClaw", "Skills", "工具发现"],
    outcome: "把技能发现从人工检索变为 Agent 自动匹配，提升复杂任务编排效率。",
    steps: ["理解用户目标", "检索候选 Skills", "评估输入输出约束", "生成可执行调用方案"],
    abilities: ["Skill", "MCP", "AI 开发者空间"]
  }
];

export function getCaseById(id) {
  return cases.find((item) => item.id === id) || cases[0];
}
