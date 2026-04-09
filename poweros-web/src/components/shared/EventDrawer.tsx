import { X } from "lucide-react";

import { agents, assets, events, plantZones } from "../../mock/poweros-data";
import { usePowerStore } from "../../store/usePowerStore";
import { agentStatusLabel, severityLabel, statusLabel } from "../../utils/format";
import Badge from "../ui/Badge";

function toneFromSeverity(severity: string) {
  return ({
    critical: "critical",
    high: "warning",
    medium: "info",
    low: "neutral",
  } as const)[severity as "critical" | "high" | "medium" | "low"];
}

export default function EventDrawer() {
  const selectedEventId = usePowerStore((state) => state.selectedEventId);
  const selectEvent = usePowerStore((state) => state.selectEvent);
  const currentEvent = events.find((event) => event.id === selectedEventId);

  if (!currentEvent) {
    return null;
  }

  const relatedAssets = assets.filter((asset) =>
    currentEvent.equipmentIds.includes(asset.id),
  );
  const currentZone = plantZones.find((zone) => zone.id === currentEvent.zoneId);
  const currentAgents = agents.filter((agent) =>
    currentEvent.agentsInvolved.includes(agent.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <button
        type="button"
        className="h-full flex-1 cursor-default"
        aria-label="关闭事件抽屉"
        onClick={() => selectEvent(null)}
      />
      <aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/6 bg-slate-950/94 px-6 py-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">
              Event Context
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{currentEvent.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {currentEvent.summary}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectEvent(null)}
            className="surface-button rounded-2xl p-2 text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge tone={toneFromSeverity(currentEvent.severity)}>
            {severityLabel(currentEvent.severity)}
          </Badge>
          <Badge tone="info">{currentEvent.category}</Badge>
          <Badge>{statusLabel(currentEvent.status)}</Badge>
          <Badge>{currentEvent.time}</Badge>
        </div>

        <div className="mt-8 grid gap-6">
          <section className="surface-panel rounded-3xl p-5">
            <h3 className="text-base font-semibold text-white">影响分析</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {currentEvent.influence}
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="surface-card rounded-3xl p-5">
              <h3 className="text-base font-semibold text-white">关联设备</h3>
              <div className="mt-4 space-y-3">
                {relatedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="surface-card-soft rounded-2xl px-4 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{asset.name}</span>
                      <Badge tone={asset.score < 85 ? "warning" : "positive"}>
                        健康 {asset.score}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{asset.latestIssue}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-3xl p-5">
              <h3 className="text-base font-semibold text-white">现场上下文</h3>
              {currentZone ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-sm text-slate-400">关联区域</p>
                    <p className="mt-1 font-medium text-white">{currentZone.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">现场人数</p>
                    <p className="mt-1 font-medium text-white">{currentZone.headcount} 人</p>
                  </div>
                  <div className="space-y-2">
                    {currentZone.notes.map((note) => (
                      <div
                        key={note}
                        className="surface-card-soft rounded-2xl px-3 py-2 text-sm text-slate-300"
                      >
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">暂无关联现场信息。</p>
              )}
            </div>
          </section>

          <section className="surface-card rounded-3xl p-5">
            <h3 className="text-base font-semibold text-white">智能体建议</h3>
            <div className="mt-4 space-y-3">
              {currentEvent.recommendedActions.map((action) => (
                <div
                  key={action}
                    className="surface-card-hero rounded-2xl px-4 py-3 text-sm text-slate-100"
                >
                  {action}
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card rounded-3xl p-5">
            <h3 className="text-base font-semibold text-white">参与智能体</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {currentAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="surface-card-soft rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium text-white">{agent.name}</span>
                    <Badge tone="info">{agentStatusLabel(agent.status)}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{agent.lastOutput}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
