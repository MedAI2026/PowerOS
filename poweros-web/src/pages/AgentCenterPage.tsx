import { Sparkles, Workflow } from "lucide-react";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { agentScenarios } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { agentStatusLabel, formatConfidence } from "../utils/format";

export default function AgentCenterPage() {
  const agents = usePowerStore((state) => state.agents);
  const activeScenarioId = usePowerStore((state) => state.activeScenarioId);
  const selectedAgentId = usePowerStore((state) => state.selectedAgentId);
  const selectAgent = usePowerStore((state) => state.selectAgent);
  const startScenario = usePowerStore((state) => state.startScenario);
  const resetScenario = usePowerStore((state) => state.resetScenario);
  const scenarioTimeline = usePowerStore((state) => state.scenarioTimeline);
  const scenarioLogs = usePowerStore((state) => state.scenarioLogs);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) ?? agents[0];
  const activeScenario = agentScenarios.find((scenario) => scenario.id === activeScenarioId);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="智能体协同中心"
        description="这是 PowerOS 的灵魂页面。这里展示运行、设备健康、安全作业、巡检、数字现场与协调智能体如何围绕一个事件形成协同链路，而不是各管一摊。"
        actions={<Badge tone="info">可点击触发 3 个协同剧本</Badge>}
      />

      <section className="grid gap-4 xl:grid-cols-3">
        {agentScenarios.map((scenario) => (
          <Panel
            key={scenario.id}
            eyebrow="Scenario"
            title={scenario.name}
            action={
              <button
                type="button"
                onClick={() => startScenario(scenario.id)}
                className="surface-button rounded-2xl px-3 py-2 text-sm text-white"
              >
                触发剧本
              </button>
            }
          >
            <p className="text-sm leading-7 text-slate-300">{scenario.summary}</p>
            <div className="surface-card-soft mt-4 rounded-[24px] p-4 text-sm text-slate-400">
              输出建议：{scenario.recommendedAction}
            </div>
          </Panel>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-7"
          eyebrow="Scenario Runtime"
          title={activeScenario ? activeScenario.name : "等待协同剧本"}
          action={
            activeScenario && (
              <button
                type="button"
                onClick={resetScenario}
                className="surface-button rounded-2xl px-3 py-2 text-sm text-slate-200"
              >
                清空剧本
              </button>
            )
          }
        >
          {scenarioTimeline.length > 0 ? (
            <div className="relative space-y-4 before:absolute before:bottom-4 before:left-[13px] before:top-4 before:w-px before:bg-gradient-to-b before:from-cyan-300/20 before:via-white/10 before:to-transparent">
              {scenarioTimeline.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative ml-8 rounded-[28px] p-5 ${
                    step.status === "active"
                      ? "surface-card-hero"
                      : step.status === "done"
                        ? "surface-card"
                        : "surface-card-soft opacity-75"
                  }`}
                >
                  <span
                    className={`absolute -left-[31px] top-6 h-3.5 w-3.5 rounded-full ${
                      step.status === "done"
                        ? "bg-emerald-300 shadow-[0_0_0_6px_rgba(16,185,129,0.08)]"
                        : step.status === "active"
                          ? "bg-cyan-300 shadow-[0_0_0_8px_rgba(91,231,255,0.1)]"
                          : "bg-slate-600"
                    }`}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">Step {index + 1}</div>
                      <div className="mt-2 font-semibold text-white">{step.title}</div>
                      <p className="mt-2 text-sm leading-7 text-slate-400">{step.detail}</p>
                    </div>
                    <Badge
                      tone={
                        step.status === "done"
                          ? "positive"
                          : step.status === "active"
                            ? "info"
                            : "neutral"
                      }
                    >
                      {step.status === "done"
                        ? "已完成"
                        : step.status === "active"
                          ? "执行中"
                          : "待执行"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="surface-card-soft rounded-[28px] p-8 text-center text-slate-400">
              点击上方任一剧本，演示智能体之间如何围绕一个事件完成理解、协作与建议输出。
            </div>
          )}
        </Panel>

        <Panel
          className="xl:col-span-5"
          eyebrow="Explainability"
          title={selectedAgent?.name ?? "智能体解释摘要"}
          action={<Sparkles className="h-5 w-5 text-cyan-200" />}
        >
          {selectedAgent && (
            <div className="space-y-4">
              <div className="surface-card rounded-3xl p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="info">{agentStatusLabel(selectedAgent.status)}</Badge>
                  <Badge tone="positive">{formatConfidence(selectedAgent.confidence)}</Badge>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {selectedAgent.mission}
                </p>
              </div>

              <div className="space-y-3">
                {selectedAgent.explanationSummary.map((item) => (
                  <div
                    key={item}
                    className="surface-card-soft rounded-[22px] px-4 py-3 text-sm text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="surface-card-hero rounded-3xl p-4 text-sm text-slate-100">
                最近输出：{selectedAgent.lastOutput}
              </div>
            </div>
          )}
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-8" eyebrow="Agents" title="智能体矩阵">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <button
                key={agent.id}
                type="button"
                onClick={() => selectAgent(agent.id)}
                className={`rounded-[28px] p-5 text-left transition ${
                  selectedAgent?.id === agent.id
                    ? "surface-card-hero"
                    : "surface-card-soft hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{agent.name}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{agent.target}</p>
                  </div>
                  <Badge tone="info">{formatConfidence(agent.confidence)}</Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    tone={
                      agent.status === "analyzing"
                        ? "warning"
                        : agent.status === "coordinating"
                          ? "critical"
                          : "positive"
                    }
                  >
                    {agentStatusLabel(agent.status)}
                  </Badge>
                  <Badge>队列 {agent.queue}</Badge>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-400">{agent.lastOutput}</p>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-4"
          eyebrow="Orchestration Log"
          title="协同执行记录"
          action={<Workflow className="h-5 w-5 text-cyan-200" />}
        >
          <div className="space-y-3">
            {scenarioLogs.map((item) => (
              <div
                key={item.id}
                className="surface-card-soft rounded-[22px] px-4 py-3"
              >
                <div className="text-xs text-slate-500">{item.time}</div>
                <div className="mt-2 text-sm leading-6 text-slate-300">{item.message}</div>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
