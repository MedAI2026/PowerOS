import { useMemo, useState } from "react";
import { Filter, Siren } from "lucide-react";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { assets, events, plantZones } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { EventSeverity } from "../types/poweros";
import { severityLabel, statusLabel } from "../utils/format";

function severityTone(severity: EventSeverity) {
  return ({
    critical: "critical",
    high: "warning",
    medium: "info",
    low: "neutral",
  } as const)[severity];
}

export default function EventCenterPage() {
  const [filter, setFilter] = useState<"all" | EventSeverity>("all");
  const selectedEventId = usePowerStore((state) => state.selectedEventId);
  const selectEvent = usePowerStore((state) => state.selectEvent);

  const filteredEvents = useMemo(
    () => (filter === "all" ? events : events.filter((event) => event.severity === filter)),
    [filter],
  );

  const focusEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="智能事件中心"
        description="这里展示的不是传统告警列表，而是经过智能体理解后的重点事件流。每条事件都带有背景理解、影响范围、建议动作、责任角色和处置状态。"
        actions={<Badge tone="warning">事件优先级已自动排序</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {(["all", "critical", "high", "medium"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-3xl px-4 py-4 text-left transition ${
              filter === item
                ? "surface-card-hero"
                : "surface-card-soft"
            }`}
          >
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Filter className="h-4 w-4" />
              {item === "all" ? "全部事件" : `${severityLabel(item)}级事件`}
            </div>
            <div className="mt-3 text-2xl font-semibold text-white">
              {item === "all"
                ? events.length
                : events.filter((event) => event.severity === item).length}
            </div>
          </button>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-7" eyebrow="Priority Stream" title="事件流">
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => selectEvent(event.id)}
                className={`w-full rounded-[28px] p-5 text-left transition ${
                  focusEvent?.id === event.id
                    ? "surface-card-hero"
                    : "surface-card-soft hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-white">{event.title}</div>
                      <Badge tone={severityTone(event.severity)}>
                        {severityLabel(event.severity)}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{event.summary}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{event.time}</div>
                    <div className="mt-1">{event.source}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{event.category}</Badge>
                  <Badge tone="info">{statusLabel(event.status)}</Badge>
                  <Badge>{event.agentsInvolved.length} 个智能体参与</Badge>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-5"
          eyebrow="Event Context"
          title={focusEvent ? focusEvent.title : "暂无事件"}
          action={<Siren className="h-5 w-5 text-cyan-200" />}
        >
          {focusEvent && (
            <div className="space-y-5">
              <div className="surface-card rounded-3xl p-4">
                <p className="text-sm leading-7 text-slate-300">{focusEvent.influence}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="surface-card-soft rounded-2xl p-4">
                  <div className="text-sm text-slate-500">关联区域</div>
                  <div className="mt-2 font-medium text-white">
                    {plantZones.find((zone) => zone.id === focusEvent.zoneId)?.name ?? "--"}
                  </div>
                </div>
                <div className="surface-card-soft rounded-2xl p-4">
                  <div className="text-sm text-slate-500">关联设备</div>
                  <div className="mt-2 font-medium text-white">
                    {focusEvent.equipmentIds
                      .map((equipmentId) => assets.find((asset) => asset.id === equipmentId)?.name)
                      .filter(Boolean)
                      .join(" / ")}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-white">推荐下一步动作</div>
                <div className="mt-3 space-y-2">
                  {focusEvent.recommendedActions.map((action) => (
                    <div
                      key={action}
                      className="surface-card-hero rounded-2xl px-4 py-3 text-sm text-slate-100"
                    >
                      {action}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => selectEvent(focusEvent.id)}
                className="surface-button w-full rounded-2xl px-4 py-3 text-sm font-medium text-white"
              >
                打开完整事件详情
              </button>
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
