import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  Bot,
  Gauge,
  Map,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "../components/ui/Badge";
import { agentScenarios, events, insightByRole, plantZones, roleProfiles, roleQuickMetrics, trendRecords } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";

type WorkspaceTab = "overview" | "agents" | "observability";

const heroMetrics = [
  { id: "margin", label: "实时获利能力", value: "119.4", delta: "元/MWh", tone: "positive" as const },
  { id: "load", label: "机组负荷", value: "96.5", delta: "%", tone: "neutral" as const },
  { id: "safety", label: "安全评分", value: "95.8", delta: "分", tone: "positive" as const },
  { id: "carbon", label: "碳强度", value: "0.863", delta: "t/MWh", tone: "warning" as const },
  { id: "asset", label: "设备健康", value: "92.0", delta: "分", tone: "positive" as const },
];

const metricToneMap = {
  neutral: "text-slate-300",
  positive: "text-amber-300",
  warning: "text-amber-300",
  critical: "text-red-300",
};

const workspaceTabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "overview", label: "总览" },
  { id: "agents", label: "协同" },
  { id: "observability", label: "观测" },
];

const quickLinks = [
  {
    to: "/events",
    title: "智能事件中心",
    detail: "从事件进入设备、区域、人员和建议动作。",
    icon: RadioTower,
  },
  {
    to: "/agents",
    title: "智能体协同中心",
    detail: "演示设备、安全、运行与协调智能体联动。",
    icon: Bot,
  },
  {
    to: "/safety",
    title: "安全作业协同中心",
    detail: "查看工作票、隔离状态与交叉作业风险。",
    icon: ShieldCheck,
  },
  {
    to: "/site",
    title: "数字现场",
    detail: "用厂区态势图理解空间上下文和风险热区。",
    icon: Map,
  },
];

function classifyScenario(message: string) {
  if (!message.trim()) return null;
  if (/(振动|引风机|设备|点检|轴承)/.test(message)) return "scenario-device";
  if (/(交叉|作业|机器人|冲突|锅炉)/.test(message)) return "scenario-conflict";
  if (/(主变|热像|升温|闭环|高风险)/.test(message)) return "scenario-hotspot";
  return null;
}

export default function DashboardPage() {
  const roleId = usePowerStore((state) => state.roleId);
  const agents = usePowerStore((state) => state.agents);
  const activeScenarioId = usePowerStore((state) => state.activeScenarioId);
  const scenarioTimeline = usePowerStore((state) => state.scenarioTimeline);
  const scenarioLogs = usePowerStore((state) => state.scenarioLogs);
  const selectedEventId = usePowerStore((state) => state.selectedEventId);
  const startScenario = usePowerStore((state) => state.startScenario);
  const selectEvent = usePowerStore((state) => state.selectEvent);

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [command, setCommand] = useState("");
  const [systemResponse, setSystemResponse] = useState(
    "系统就绪。你可以直接触发设备异常、交叉作业或高风险闭环等演示事件。",
  );

  const currentRole = roleProfiles.find((role) => role.id === roleId) ?? roleProfiles[0];
  const focusInsights = insightByRole(roleId).slice(0, 3);
  const roleMetrics = roleQuickMetrics(roleId);
  const topEvents = events.slice(0, 4);
  const activeScenario = agentScenarios.find((item) => item.id === activeScenarioId) ?? null;
  const focusEvent = events.find((item) => item.id === selectedEventId) ?? topEvents[0];
  const latestLogs = useMemo(() => [...scenarioLogs].slice(-4).reverse(), [scenarioLogs]);
  const hotZones = plantZones.slice(0, 3);
  const scenarioChipLabel = activeScenario ? activeScenario.name : "极端天气下的调频调价";

  const triggerScenario = (scenarioId: string, message: string) => {
    const scenario = agentScenarios.find((item) => item.id === scenarioId);
    if (!scenario) return;

    startScenario(scenarioId);
    setActiveTab("agents");
    setSystemResponse(message);
    setCommand("");
    selectEvent(scenario.initialEventId);
  };

  const handleCommandSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const matched = classifyScenario(command);

    if (!command.trim()) {
      setSystemResponse("请输入一个事件或处置意图，例如：#2 引风机振动异常。");
      return;
    }

    if (matched === "scenario-device") {
      triggerScenario(
        matched,
        "已识别为设备异常协同任务。设备健康、运行、安全与协调智能体已进入联动演示。",
      );
      return;
    }

    if (matched === "scenario-conflict") {
      triggerScenario(
        matched,
        "已识别为交叉作业风险任务。作业、安全、数字现场与巡检智能体开始协同排程。",
      );
      return;
    }

    if (matched === "scenario-hotspot") {
      triggerScenario(
        matched,
        "已识别为高风险闭环任务。数字现场、设备、巡检与协调智能体已进入闭环处置。",
      );
      return;
    }

    setSystemResponse(
      "已记录该任务意图。当前建议先演示“设备异常”“交叉作业风险”或“高风险预警闭环”三个预置剧本。",
    );
  };

  return (
    <div className="pb-8">
      <section className="hero-board surface-panel rounded-[40px] p-5 md:p-7 xl:p-10">
        <div className="relative z-[1]">
          <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr] xl:items-start">
            <div>
              <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-200/70">
                POWEROS / NEXUS POWER
              </div>
              <div className="mt-6 max-w-5xl">
                <div className="display-title text-[3.4rem] font-semibold leading-[0.86] text-white sm:text-[4.4rem] xl:text-[5.9rem]">
                  智慧电厂
                </div>
                <div className="display-title text-[3.4rem] font-semibold leading-[0.86] text-white sm:text-[4.4rem] xl:text-[5.9rem]">
                  领航看板 <span className="ml-2">Agentic-Mesh</span>
                </div>
              </div>
              <p className="mt-6 max-w-4xl text-sm leading-8 text-slate-300 md:text-[15px]">
                通过语义总线、多智能体协作和生成式分析画布，把生产管控与经营决策压缩到同一条实时认知链路里。这一页就是 PowerOS 的“舞台模式”，用于向客户呈现未来电厂智能操作系统的主界面形态。
              </p>
            </div>

            <div className="flex justify-center xl:justify-end">
              <div className="metric-orb">
                <div className="metric-orb-core">
                  <div className="text-[1rem] font-medium tracking-[0.04em] text-slate-300">
                    实时联动
                  </div>
                  <div className="display-title mt-5 text-[3.2rem] font-semibold leading-[0.88] text-white">
                    119.4
                  </div>
                  <div className="display-title text-[2rem] font-semibold leading-none text-white">
                    元/MWh
                  </div>
                  <div className="mt-4 text-sm text-slate-400">当前获利能力</div>
                </div>
              </div>
            </div>
          </div>

          <div className="surface-card mt-8 rounded-[32px] p-5 md:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/68">
                  Generative Interface
                </p>
                <h2 className="mt-3 text-[2rem] font-semibold leading-none text-white">
                  对话式任务注入
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="surface-card-soft rounded-full px-4 py-2 text-sm font-medium text-white">
                  {scenarioChipLabel}
                </span>
                <Badge tone="warning">{currentRole.title}视角</Badge>
              </div>
            </div>

            <form className="mt-5" onSubmit={handleCommandSubmit}>
              <textarea
                value={command}
                onChange={(event) => setCommand(event.target.value)}
                rows={4}
                placeholder="例如：#2 引风机振动异常，需要判断是否降负荷并安排点检"
                className="command-textarea w-full rounded-[24px] px-5 py-4 text-base text-white outline-none"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="surface-button rounded-[18px] px-5 py-3 text-sm font-medium text-white"
                >
                  提交指令
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerScenario(
                      "scenario-device",
                      "已注入设备异常剧本。系统正在演示 #2 引风机振动异常的跨智能体协同链路。",
                    )
                  }
                  className="surface-button rounded-[18px] px-5 py-3 text-sm font-medium text-slate-200"
                >
                  注入设备异常
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerScenario(
                      "scenario-conflict",
                      "已注入交叉作业剧本。系统正在演示锅炉区域检修作业与机器人路径冲突的协调流程。",
                    )
                  }
                  className="surface-button rounded-[18px] px-5 py-3 text-sm font-medium text-slate-200"
                >
                  注入交叉作业
                </button>
                <button
                  type="button"
                  onClick={() =>
                    triggerScenario(
                      "scenario-hotspot",
                      "已注入高风险闭环剧本。系统正在演示主变区域热像异常升温的闭环处置链路。",
                    )
                  }
                  className="surface-button rounded-[18px] px-5 py-3 text-sm font-medium text-slate-200"
                >
                  注入高风险闭环
                </button>
              </div>
            </form>

            <div className="surface-card-soft mt-5 rounded-[22px] px-5 py-4 text-[15px] font-medium text-amber-100">
              {systemResponse}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {heroMetrics.map((metric) => (
              <article key={metric.id} className="hero-metric-card rounded-[30px] p-5">
                <p className="text-[12px] tracking-[0.02em] text-slate-400">{metric.label}</p>
                <div className="mt-5">
                  <strong className="display-title text-[2.5rem] font-semibold leading-none text-white">
                    {metric.value}
                  </strong>
                  <div className={`mt-2 text-[1.05rem] font-semibold ${metricToneMap[metric.tone]}`}>
                    {metric.delta}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="surface-card mt-7 rounded-[32px] p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/68">
                  Adaptive Workspace
                </div>
                <h2 className="mt-3 text-[1.8rem] font-semibold text-white">
                  分区工作台
                </h2>
              </div>
              <div className="workspace-dock">
                {workspaceTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "workspace-dock-active text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-divider mt-5" />

            {activeTab === "overview" && (
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="surface-card-hero rounded-[30px] p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="info">{currentRole.title}</Badge>
                    <Badge tone="warning">{currentRole.focus}</Badge>
                  </div>
                  <h3 className="display-title mt-5 text-[2rem] font-semibold leading-[0.94] text-white">
                    当前角色工作摘要
                  </h3>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-300">
                    {currentRole.summary} PowerOS 会主动把相关事件、现场、设备与智能体建议压缩进一张工作台，而不是让使用者在传统菜单和报表之间反复切换。
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {roleMetrics.map((metric) => (
                      <div key={metric.id} className="surface-card-soft rounded-[22px] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                          {metric.label}
                        </div>
                        <div className="mt-3 text-2xl font-semibold text-white">{metric.value}</div>
                        <div className="mt-2 text-sm text-slate-400">{metric.delta}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 space-y-3">
                    {focusInsights.map((insight) => (
                      <button
                        key={insight.id}
                        type="button"
                        className="surface-card-soft w-full rounded-[24px] p-4 text-left transition hover:bg-white/[0.05]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-medium text-white">{insight.title}</div>
                            <p className="mt-2 text-sm leading-7 text-slate-400">
                              {insight.detail}
                            </p>
                          </div>
                          <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.05] text-slate-400">
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="surface-card rounded-[28px] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                          Entry Grid
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">核心工作台入口</h3>
                      </div>
                      <Sparkles className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div className="mt-4 grid gap-3">
                      {quickLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="surface-card-soft rounded-[24px] p-4 transition hover:bg-white/[0.05]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/[0.08] text-cyan-200">
                                <Icon className="h-5 w-5" />
                              </span>
                              <ArrowRight className="h-4 w-4 text-slate-500" />
                            </div>
                            <div className="mt-4 font-medium text-white">{item.title}</div>
                            <p className="mt-2 text-sm leading-7 text-slate-400">{item.detail}</p>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  <div className="surface-card rounded-[28px] p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                          Event Priority
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">当前关键事件</h3>
                      </div>
                      <Badge tone="critical">{focusEvent.time}</Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => selectEvent(focusEvent.id)}
                      className="surface-card-hero mt-4 w-full rounded-[24px] p-4 text-left"
                    >
                      <div className="font-medium text-white">{focusEvent.title}</div>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{focusEvent.summary}</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "agents" && (
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                <div className="surface-card rounded-[30px] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                        Agent Runtime
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">智能体矩阵</h3>
                    </div>
                    <Badge tone="info">
                      {activeScenario ? activeScenario.name : "待触发"}
                    </Badge>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {agents.map((agent) => (
                      <div key={agent.id} className="surface-card-soft rounded-[24px] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-white">{agent.name}</div>
                          <Badge
                            tone={
                              agent.status === "coordinating"
                                ? "critical"
                                : agent.status === "analyzing"
                                  ? "warning"
                                  : "positive"
                            }
                          >
                            {agent.status === "standby"
                              ? "待命"
                              : agent.status === "analyzing"
                                ? "分析中"
                                : agent.status === "coordinating"
                                  ? "协同中"
                                  : "已建议"}
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm text-slate-500">{agent.target}</div>
                        <p className="mt-3 text-sm leading-7 text-slate-400">{agent.lastOutput}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="surface-card rounded-[28px] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                          Scenario Timeline
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">协同推进链路</h3>
                      </div>
                      <Activity className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div className="relative mt-5 space-y-4 before:absolute before:bottom-2 before:left-[10px] before:top-3 before:w-px before:bg-gradient-to-b before:from-cyan-300/20 before:via-white/8 before:to-transparent">
                      {scenarioTimeline.length > 0 ? (
                        scenarioTimeline.map((step) => (
                          <div key={step.id} className="relative ml-7 surface-card-soft rounded-[24px] p-4">
                            <span
                              className={`absolute -left-[25px] top-5 h-3 w-3 rounded-full ${
                                step.status === "done"
                                  ? "bg-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.08)]"
                                  : step.status === "active"
                                    ? "bg-cyan-300 shadow-[0_0_0_8px_rgba(91,231,255,0.08)]"
                                    : "bg-slate-600"
                              }`}
                            />
                            <div className="font-medium text-white">{step.title}</div>
                            <p className="mt-2 text-sm leading-7 text-slate-400">{step.detail}</p>
                          </div>
                        ))
                      ) : (
                        <div className="relative ml-7 surface-card-soft rounded-[24px] p-4 text-sm text-slate-400">
                          选择上方剧本后，这里会展示完整的智能体协同推进链路。
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="surface-card rounded-[28px] p-5">
                    <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                      Orchestration Log
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-white">最近执行记录</h3>
                    <div className="mt-4 space-y-3">
                      {latestLogs.map((item) => (
                        <div key={item.id} className="surface-card-soft rounded-[22px] px-4 py-3">
                          <div className="text-xs text-slate-500">{item.time}</div>
                          <div className="mt-2 text-sm leading-6 text-slate-300">{item.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "observability" && (
              <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="surface-card rounded-[30px] p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                          Runtime Trend
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-white">全厂实时态势曲线</h3>
                      </div>
                      <Gauge className="h-5 w-5 text-cyan-200" />
                    </div>
                    <div className="mt-4 h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendRecords}>
                          <defs>
                            <linearGradient id="heroLoad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#5BE7FF" stopOpacity={0.42} />
                              <stop offset="95%" stopColor="#5BE7FF" stopOpacity={0.02} />
                            </linearGradient>
                            <linearGradient id="heroMargin" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4FA6FF" stopOpacity={0.36} />
                              <stop offset="95%" stopColor="#4FA6FF" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="rgba(148, 163, 184, 0.08)" vertical={false} />
                          <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: "#09131d",
                              border: "1px solid rgba(255,255,255,0.06)",
                              borderRadius: 16,
                            }}
                          />
                          <Area type="monotone" dataKey="load" stroke="#5BE7FF" fill="url(#heroLoad)" />
                          <Area type="monotone" dataKey="margin" stroke="#4FA6FF" fill="url(#heroMargin)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {hotZones.map((zone) => (
                      <div key={zone.id} className="surface-card-soft rounded-[24px] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-white">{zone.name}</div>
                          <Badge
                            tone={
                              zone.risk === "critical"
                                ? "critical"
                                : zone.risk === "warning"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            态势
                          </Badge>
                        </div>
                        <div className="mt-3 text-sm text-slate-400">
                          在岗 {zone.headcount} 人 · 作业 {zone.activePermits.length} 项
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card rounded-[30px] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/60">
                        Event Priority
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">关键事件流</h3>
                    </div>
                    <RadioTower className="h-5 w-5 text-cyan-200" />
                  </div>
                  <div className="mt-5 space-y-3">
                    {topEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => selectEvent(event.id)}
                        className="surface-card-soft relative w-full overflow-hidden rounded-[24px] p-4 text-left transition hover:bg-white/[0.05]"
                      >
                        <div className="absolute inset-y-4 left-0 w-px bg-gradient-to-b from-transparent via-cyan-300/35 to-transparent" />
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium text-white">{event.title}</div>
                          <Badge
                            tone={
                              event.severity === "critical"
                                ? "critical"
                                : event.severity === "high"
                                  ? "warning"
                                  : "info"
                            }
                          >
                            {event.time}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-slate-400">{event.summary}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
