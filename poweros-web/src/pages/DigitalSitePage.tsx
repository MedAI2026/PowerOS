import { Layers3, MapPinned, Users } from "lucide-react";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { events, plantZones, workPermits } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { LayerId } from "../types/poweros";

const layerLabels: Array<{ id: LayerId; label: string }> = [
  { id: "device", label: "设备层" },
  { id: "safety", label: "安全层" },
  { id: "work", label: "作业层" },
  { id: "people", label: "人员层" },
  { id: "risk", label: "风险层" },
];

function zoneTone(risk: string) {
  if (risk === "critical") return "rgba(255, 107, 107, 0.34)";
  if (risk === "warning") return "rgba(255, 179, 77, 0.28)";
  return "rgba(79, 166, 255, 0.22)";
}

export default function DigitalSitePage() {
  const activeLayers = usePowerStore((state) => state.activeLayers);
  const toggleLayer = usePowerStore((state) => state.toggleLayer);
  const selectedZoneId = usePowerStore((state) => state.selectedZoneId);
  const selectZone = usePowerStore((state) => state.selectZone);
  const selectEvent = usePowerStore((state) => state.selectEvent);
  const selectedZone = plantZones.find((zone) => zone.id === selectedZoneId) ?? plantZones[0];

  const relatedEvents = events.filter((event) => event.zoneId === selectedZone.id);
  const relatedPermits = workPermits.filter((permit) => permit.area === selectedZone.name);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="数字现场 / 厂区态势"
        description="这里不是单纯的三维炫技，而是为所有事件、设备、作业和人员提供统一的现场上下文。点区域能看状态，点设备能看详情，点作业点能看票据和人员，点告警能看影响范围。"
        actions={<Badge tone="info">支持 5 类图层切换</Badge>}
      />

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          eyebrow="Digital Site"
          title="厂区态势图"
          action={<MapPinned className="h-5 w-5 text-cyan-200" />}
        >
          <div className="mb-4 flex flex-wrap gap-2">
            {layerLabels.map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggleLayer(layer.id)}
                className={`rounded-full px-3 py-2 text-sm transition ${
                  activeLayers.includes(layer.id)
                    ? "surface-card-hero text-white"
                    : "surface-card-soft text-slate-400"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          <div className="relative h-[520px] overflow-hidden rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(91,231,255,0.09),transparent_25%),linear-gradient(145deg,#08131f,#102031)]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30" />
            {plantZones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => selectZone(zone.id)}
                className={`absolute rounded-[24px] border p-4 text-left transition ${
                  selectedZone.id === zone.id
                    ? "border-cyan-300/40 shadow-[0_0_0_1px_rgba(91,231,255,0.2)]"
                    : "border-white/10"
                }`}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.w}%`,
                  height: `${zone.h}%`,
                  background: zoneTone(zone.risk),
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-white">{zone.name}</div>
                    {activeLayers.includes("device") && (
                      <div className="mt-2 text-xs text-slate-200/80">
                        {zone.devices.join(" / ")}
                      </div>
                    )}
                  </div>
                  {activeLayers.includes("risk") && (
                    <Badge tone={zone.risk === "critical" ? "critical" : zone.risk === "warning" ? "warning" : "info"}>
                      风险
                    </Badge>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {activeLayers.includes("work") && (
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-slate-200">
                      作业 {zone.activePermits.length}
                    </span>
                  )}
                  {activeLayers.includes("people") && (
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-slate-200">
                      人员 {zone.headcount}
                    </span>
                  )}
                  {activeLayers.includes("safety") && zone.notes[0] && (
                    <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-slate-200">
                      {zone.notes[0]}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-4"
          eyebrow="Zone Context"
          title={selectedZone.name}
          action={<Layers3 className="h-5 w-5 text-cyan-200" />}
        >
          <div className="space-y-5">
            <div className="surface-card rounded-3xl p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-slate-500">在岗状态</div>
                <Badge tone="info">{selectedZone.headcount} 人</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                <Users className="h-4 w-4 text-cyan-200" />
                当前关联设备：{selectedZone.devices.join(" / ")}
              </div>
            </div>

            <div className="surface-card rounded-3xl p-4">
              <div className="font-medium text-white">区域说明</div>
              <div className="mt-3 space-y-2">
                {selectedZone.notes.map((note) => (
                  <div key={note} className="surface-card-soft rounded-2xl px-3 py-2 text-sm text-slate-300">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-white">关联事件</div>
              {relatedEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => selectEvent(event.id)}
                  className="surface-card-soft w-full rounded-2xl px-4 py-3 text-left transition hover:bg-white/[0.05]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-white">{event.title}</span>
                    <Badge tone={event.severity === "critical" ? "critical" : "warning"}>
                      {event.time}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-white">关联作业票</div>
              {relatedPermits.length > 0 ? (
                relatedPermits.map((permit) => (
                  <div key={permit.id} className="surface-card-soft rounded-2xl px-4 py-3">
                    <div className="font-medium text-white">{permit.title}</div>
                    <p className="mt-2 text-sm text-slate-400">{permit.summary}</p>
                  </div>
                ))
              ) : (
                <div className="surface-card-soft rounded-2xl px-4 py-6 text-sm text-slate-400">
                  当前区域暂无关联作业票。
                </div>
              )}
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
