import type { KeyboardEvent } from "react";
import { Layers3, MapPinned, Users } from "lucide-react";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { events, plantZones, workPermits } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import type { LayerId, PlantZone } from "../types/poweros";

const layerLabels: Array<{ id: LayerId; label: string }> = [
  { id: "device", label: "设备层" },
  { id: "safety", label: "安全层" },
  { id: "work", label: "作业层" },
  { id: "people", label: "人员层" },
  { id: "risk", label: "风险层" },
];

const MAP_FRAME = {
  x: 56,
  y: 46,
  w: 1088,
  h: 626,
};

const zoneAccentMap: Record<string, string> = {
  "zone-boiler": "#d7b16b",
  "zone-turbine": "#6db8ff",
  "zone-transformer": "#ff7b8c",
  "zone-water": "#84c7ff",
  "zone-fgd": "#6ed4f4",
};

function getZoneRect(zone: PlantZone) {
  return {
    x: MAP_FRAME.x + (zone.x / 100) * MAP_FRAME.w,
    y: MAP_FRAME.y + (zone.y / 100) * MAP_FRAME.h,
    w: (zone.w / 100) * MAP_FRAME.w,
    h: (zone.h / 100) * MAP_FRAME.h,
  };
}

function riskVisual(risk: PlantZone["risk"]) {
  if (risk === "critical") {
    return {
      fill: "rgba(160, 66, 81, 0.44)",
      stroke: "rgba(255, 136, 152, 0.52)",
      glow: "rgba(255, 123, 140, 0.14)",
      badgeTone: "critical" as const,
      label: "高风险",
    };
  }

  if (risk === "warning") {
    return {
      fill: "rgba(133, 104, 56, 0.42)",
      stroke: "rgba(226, 185, 105, 0.48)",
      glow: "rgba(215, 177, 107, 0.14)",
      badgeTone: "warning" as const,
      label: "风险",
    };
  }

  return {
    fill: "rgba(47, 92, 141, 0.34)",
    stroke: "rgba(110, 185, 255, 0.34)",
    glow: "rgba(110, 185, 255, 0.12)",
    badgeTone: "info" as const,
    label: "关注",
  };
}

function chipWidth(label: string) {
  return Math.max(84, label.length * 16 + 26);
}

function pathForLink(from: PlantZone, to: PlantZone) {
  const a = getZoneRect(from);
  const b = getZoneRect(to);
  const startX = a.x + a.w;
  const startY = a.y + a.h * 0.44;
  const endX = b.x;
  const endY = b.y + b.h * 0.42;
  const curve = Math.max(56, Math.abs(endX - startX) * 0.26);

  return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
}

function pathForBranch(from: PlantZone, to: PlantZone, fromBias: number, toBias: number) {
  const a = getZoneRect(from);
  const b = getZoneRect(to);
  const startX = a.x + a.w * fromBias;
  const startY = a.y + a.h;
  const endX = b.x + b.w * toBias;
  const endY = b.y;
  const middleY = startY + (endY - startY) * 0.42;

  return `M ${startX} ${startY} C ${startX} ${middleY}, ${endX} ${middleY}, ${endX} ${endY}`;
}

function renderBoilerSilhouette(rect: ReturnType<typeof getZoneRect>, accent: string) {
  return (
    <g opacity={0.58}>
      <rect
        x={rect.x + rect.w * 0.1}
        y={rect.y + rect.h * 0.18}
        width={rect.w * 0.22}
        height={rect.h * 0.56}
        rx={16}
        fill="rgba(255,255,255,0.08)"
      />
      <rect
        x={rect.x + rect.w * 0.37}
        y={rect.y + rect.h * 0.1}
        width={rect.w * 0.08}
        height={rect.h * 0.46}
        rx={10}
        fill="rgba(255,255,255,0.1)"
      />
      <rect
        x={rect.x + rect.w * 0.49}
        y={rect.y + rect.h * 0.23}
        width={rect.w * 0.22}
        height={rect.h * 0.16}
        rx={12}
        fill="rgba(255,255,255,0.06)"
      />
      <circle
        cx={rect.x + rect.w * 0.76}
        cy={rect.y + rect.h * 0.6}
        r={rect.h * 0.11}
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M ${rect.x + rect.w * 0.23} ${rect.y + rect.h * 0.66} H ${rect.x + rect.w * 0.72}`}
        stroke={accent}
        strokeOpacity="0.45"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d={`M ${rect.x + rect.w * 0.42} ${rect.y + rect.h * 0.18} V ${rect.y + rect.h * 0.08}`}
        stroke={accent}
        strokeOpacity="0.36"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderTurbineSilhouette(rect: ReturnType<typeof getZoneRect>, accent: string) {
  return (
    <g opacity={0.56}>
      <rect
        x={rect.x + rect.w * 0.08}
        y={rect.y + rect.h * 0.34}
        width={rect.w * 0.6}
        height={rect.h * 0.18}
        rx={18}
        fill="rgba(255,255,255,0.08)"
      />
      <rect
        x={rect.x + rect.w * 0.71}
        y={rect.y + rect.h * 0.28}
        width={rect.w * 0.16}
        height={rect.h * 0.28}
        rx={14}
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M ${rect.x + rect.w * 0.1} ${rect.y + rect.h * 0.32} L ${rect.x + rect.w * 0.18} ${rect.y + rect.h * 0.22} H ${rect.x + rect.w * 0.66} L ${rect.x + rect.w * 0.72} ${rect.y + rect.h * 0.32}`}
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M ${rect.x + rect.w * 0.18} ${rect.y + rect.h * 0.58} H ${rect.x + rect.w * 0.84}`}
        stroke={accent}
        strokeOpacity="0.42"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderTransformerSilhouette(rect: ReturnType<typeof getZoneRect>, accent: string) {
  return (
    <g opacity={0.56}>
      {[0.18, 0.42, 0.66].map((offset) => (
        <g key={offset}>
          <rect
            x={rect.x + rect.w * offset}
            y={rect.y + rect.h * 0.34}
            width={rect.w * 0.12}
            height={rect.h * 0.28}
            rx={10}
            fill="rgba(255,255,255,0.1)"
          />
          <path
            d={`M ${rect.x + rect.w * offset} ${rect.y + rect.h * 0.32} H ${rect.x + rect.w * (offset + 0.12)}`}
            stroke={accent}
            strokeOpacity="0.45"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </g>
      ))}
      <path
        d={`M ${rect.x + rect.w * 0.18} ${rect.y + rect.h * 0.26} H ${rect.x + rect.w * 0.78}`}
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderWaterSilhouette(rect: ReturnType<typeof getZoneRect>, accent: string) {
  return (
    <g opacity={0.56}>
      {[0.18, 0.46].map((offset) => (
        <g key={offset}>
          <ellipse
            cx={rect.x + rect.w * offset}
            cy={rect.y + rect.h * 0.34}
            rx={rect.w * 0.09}
            ry={rect.h * 0.08}
            fill="rgba(255,255,255,0.1)"
          />
          <rect
            x={rect.x + rect.w * (offset - 0.09)}
            y={rect.y + rect.h * 0.34}
            width={rect.w * 0.18}
            height={rect.h * 0.18}
            fill="rgba(255,255,255,0.08)"
          />
          <ellipse
            cx={rect.x + rect.w * offset}
            cy={rect.y + rect.h * 0.52}
            rx={rect.w * 0.09}
            ry={rect.h * 0.08}
            fill="rgba(255,255,255,0.08)"
          />
        </g>
      ))}
      <circle
        cx={rect.x + rect.w * 0.77}
        cy={rect.y + rect.h * 0.52}
        r={rect.h * 0.11}
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M ${rect.x + rect.w * 0.27} ${rect.y + rect.h * 0.52} H ${rect.x + rect.w * 0.68}`}
        stroke={accent}
        strokeOpacity="0.4"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderFgdSilhouette(rect: ReturnType<typeof getZoneRect>, accent: string) {
  return (
    <g opacity={0.58}>
      <rect
        x={rect.x + rect.w * 0.16}
        y={rect.y + rect.h * 0.18}
        width={rect.w * 0.17}
        height={rect.h * 0.46}
        rx={14}
        fill="rgba(255,255,255,0.1)"
      />
      <rect
        x={rect.x + rect.w * 0.44}
        y={rect.y + rect.h * 0.28}
        width={rect.w * 0.26}
        height={rect.h * 0.22}
        rx={18}
        fill="rgba(255,255,255,0.08)"
      />
      <circle
        cx={rect.x + rect.w * 0.78}
        cy={rect.y + rect.h * 0.5}
        r={rect.h * 0.12}
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d={`M ${rect.x + rect.w * 0.24} ${rect.y + rect.h * 0.64} H ${rect.x + rect.w * 0.74}`}
        stroke={accent}
        strokeOpacity="0.42"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d={`M ${rect.x + rect.w * 0.25} ${rect.y + rect.h * 0.18} V ${rect.y + rect.h * 0.08}`}
        stroke={accent}
        strokeOpacity="0.34"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function renderZoneSilhouette(zoneId: string, rect: ReturnType<typeof getZoneRect>, accent: string) {
  switch (zoneId) {
    case "zone-boiler":
      return renderBoilerSilhouette(rect, accent);
    case "zone-turbine":
      return renderTurbineSilhouette(rect, accent);
    case "zone-transformer":
      return renderTransformerSilhouette(rect, accent);
    case "zone-water":
      return renderWaterSilhouette(rect, accent);
    case "zone-fgd":
      return renderFgdSilhouette(rect, accent);
    default:
      return null;
  }
}

function ZoneChip({
  x,
  y,
  label,
  tone,
}: {
  x: number;
  y: number;
  label: string;
  tone: "neutral" | "info" | "warning" | "critical";
}) {
  const width = chipWidth(label);
  const palette = {
    neutral: {
      fill: "rgba(18, 32, 48, 0.9)",
      stroke: "rgba(255,255,255,0.08)",
      text: "#d6dfeb",
    },
    info: {
      fill: "rgba(38, 76, 112, 0.88)",
      stroke: "rgba(109,184,255,0.28)",
      text: "#bce8ff",
    },
    warning: {
      fill: "rgba(101, 78, 38, 0.9)",
      stroke: "rgba(226,185,105,0.28)",
      text: "#ffde94",
    },
    critical: {
      fill: "rgba(112, 49, 61, 0.9)",
      stroke: "rgba(255,132,150,0.26)",
      text: "#ffd2d9",
    },
  }[tone];

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={32}
        rx={16}
        fill={palette.fill}
        stroke={palette.stroke}
      />
      <text
        x={x + 16}
        y={y + 21}
        fontSize="14"
        fontWeight="600"
        fill={palette.text}
      >
        {label}
      </text>
    </g>
  );
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
  const boilerZone = plantZones.find((zone) => zone.id === "zone-boiler") ?? plantZones[0];
  const turbineZone = plantZones.find((zone) => zone.id === "zone-turbine") ?? plantZones[1];
  const transformerZone = plantZones.find((zone) => zone.id === "zone-transformer") ?? plantZones[2];
  const waterZone = plantZones.find((zone) => zone.id === "zone-water") ?? plantZones[3];
  const fgdZone = plantZones.find((zone) => zone.id === "zone-fgd") ?? plantZones[4];

  const showDeviceLayer = activeLayers.includes("device");
  const showSafetyLayer = activeLayers.includes("safety");
  const showWorkLayer = activeLayers.includes("work");
  const showPeopleLayer = activeLayers.includes("people");
  const showRiskLayer = activeLayers.includes("risk");

  const onZoneKeyDown = (event: KeyboardEvent<SVGGElement>, zoneId: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectZone(zoneId);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="数字现场 / 厂区态势"
        description="这里不再只是抽象色块，而是一张可点击、可叠加、可解释的电厂模拟总图。它把主厂房、主变、水处理、脱硫和现场风险放进同一张操作上下文里，让事件和作业都能找到明确空间位置。"
        actions={<Badge tone="info">支持 5 类图层切换</Badge>}
      />

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-8"
          eyebrow="Digital Site"
          title="电厂模拟总图"
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

          <div className="relative overflow-hidden rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,#09131d,#0d1a2a)]">
            <svg viewBox="0 0 1200 720" className="h-[660px] w-full">
              <defs>
                <linearGradient id="siteBackdrop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0c1a28" />
                  <stop offset="100%" stopColor="#0a1726" />
                </linearGradient>
                <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="16" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect
                x={MAP_FRAME.x}
                y={MAP_FRAME.y}
                width={MAP_FRAME.w}
                height={MAP_FRAME.h}
                rx={40}
                fill="url(#siteBackdrop)"
                stroke="rgba(255,255,255,0.1)"
              />

              {Array.from({ length: 12 }).map((_, index) => (
                <line
                  key={`v-${index}`}
                  x1={MAP_FRAME.x + ((index + 1) * MAP_FRAME.w) / 13}
                  x2={MAP_FRAME.x + ((index + 1) * MAP_FRAME.w) / 13}
                  y1={MAP_FRAME.y}
                  y2={MAP_FRAME.y + MAP_FRAME.h}
                  stroke="rgba(91, 231, 255, 0.04)"
                />
              ))}
              {Array.from({ length: 8 }).map((_, index) => (
                <line
                  key={`h-${index}`}
                  x1={MAP_FRAME.x}
                  x2={MAP_FRAME.x + MAP_FRAME.w}
                  y1={MAP_FRAME.y + ((index + 1) * MAP_FRAME.h) / 9}
                  y2={MAP_FRAME.y + ((index + 1) * MAP_FRAME.h) / 9}
                  stroke="rgba(91, 231, 255, 0.04)"
                />
              ))}

              <rect
                x={getZoneRect(boilerZone).x - 24}
                y={getZoneRect(boilerZone).y - 32}
                width={
                  getZoneRect(turbineZone).x + getZoneRect(turbineZone).w - getZoneRect(boilerZone).x + 48
                }
                height={Math.max(getZoneRect(boilerZone).h, getZoneRect(turbineZone).h) + 64}
                rx={36}
                fill="rgba(255,255,255,0.015)"
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="8 12"
              />
              <text
                x={getZoneRect(boilerZone).x - 4}
                y={getZoneRect(boilerZone).y - 12}
                fontSize="14"
                fill="#7f8ca1"
                letterSpacing="0.18em"
              >
                MAIN PLANT / 主厂房系统
              </text>

              <g opacity={showDeviceLayer ? 0.94 : 0.18}>
                <path
                  d={pathForLink(boilerZone, turbineZone)}
                  fill="none"
                  stroke="#7bd7ff"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <text x="454" y="196" fontSize="14" fill="#a9eaff">
                  主蒸汽 / 热能主线
                </text>

                <path
                  d={pathForLink(turbineZone, transformerZone)}
                  fill="none"
                  stroke="#8cb8ff"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text x="852" y="184" fontSize="14" fill="#bdd2ff">
                  发电输出
                </text>

                <path
                  d={pathForBranch(boilerZone, fgdZone, 0.76, 0.22)}
                  fill="none"
                  stroke="#7fd8f2"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text x="690" y="404" fontSize="14" fill="#c3f3ff">
                  烟气至脱硫
                </text>

                <path
                  d={pathForBranch(turbineZone, waterZone, 0.26, 0.72)}
                  fill="none"
                  stroke="#78c6ff"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="284" y="394" fontSize="14" fill="#c6e7ff">
                  凝结水回路
                </text>
              </g>

              {showSafetyLayer && (
                <g opacity="0.7">
                  <rect
                    x={getZoneRect(transformerZone).x - 18}
                    y={getZoneRect(transformerZone).y - 18}
                    width={getZoneRect(transformerZone).w + 36}
                    height={getZoneRect(transformerZone).h + 36}
                    rx={28}
                    fill="none"
                    stroke="rgba(255, 123, 140, 0.46)"
                    strokeDasharray="10 8"
                  />
                  <rect
                    x={getZoneRect(boilerZone).x - 14}
                    y={getZoneRect(boilerZone).y - 14}
                    width={getZoneRect(boilerZone).w + 28}
                    height={getZoneRect(boilerZone).h + 28}
                    rx={28}
                    fill="none"
                    stroke="rgba(226, 185, 105, 0.34)"
                    strokeDasharray="10 8"
                  />
                  <text
                    x={getZoneRect(transformerZone).x + 18}
                    y={getZoneRect(transformerZone).y - 26}
                    fontSize="13"
                    fill="#ffb4bf"
                  >
                    安全隔离围栏
                  </text>
                </g>
              )}

              {plantZones.map((zone) => {
                const rect = getZoneRect(zone);
                const accent = zoneAccentMap[zone.id] ?? "#6db8ff";
                const visual = riskVisual(zone.risk);
                const selected = selectedZone.id === zone.id;

                return (
                  <g
                    key={zone.id}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer"
                    onClick={() => selectZone(zone.id)}
                    onKeyDown={(event) => onZoneKeyDown(event, zone.id)}
                  >
                    {showRiskLayer && zone.risk !== "normal" && (
                      <rect
                        x={rect.x - 10}
                        y={rect.y - 10}
                        width={rect.w + 20}
                        height={rect.h + 20}
                        rx={32}
                        fill={visual.glow}
                        filter="url(#softGlow)"
                      />
                    )}

                    <rect
                      x={rect.x}
                      y={rect.y}
                      width={rect.w}
                      height={rect.h}
                      rx={28}
                      fill={visual.fill}
                      stroke={selected ? "rgba(151, 235, 255, 0.86)" : visual.stroke}
                      strokeWidth={selected ? 2.5 : 1.4}
                    />

                    <rect
                      x={rect.x + 10}
                      y={rect.y + 10}
                      width={rect.w - 20}
                      height={rect.h - 20}
                      rx={22}
                      fill="rgba(6, 15, 26, 0.16)"
                      stroke="rgba(255,255,255,0.03)"
                    />

                    {renderZoneSilhouette(zone.id, rect, accent)}

                    <foreignObject
                      x={rect.x + 22}
                      y={rect.y + 18}
                      width={rect.w - 44}
                      height={rect.h - 36}
                    >
                      <div className="pointer-events-none flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[18px] font-semibold text-white">{zone.name}</div>
                            {showDeviceLayer && (
                              <div className="mt-2 text-[12px] leading-5 text-slate-200/85">
                                {zone.devices.join(" / ")}
                              </div>
                            )}
                          </div>
                          {showRiskLayer && (
                            <span
                              className="rounded-full border px-3 py-1 text-[12px] font-semibold"
                              style={{
                                background:
                                  zone.risk === "critical"
                                    ? "rgba(112,49,61,0.82)"
                                    : zone.risk === "warning"
                                      ? "rgba(101,78,38,0.84)"
                                      : "rgba(38,76,112,0.82)",
                                borderColor:
                                  zone.risk === "critical"
                                    ? "rgba(255,123,140,0.26)"
                                    : zone.risk === "warning"
                                      ? "rgba(226,185,105,0.24)"
                                      : "rgba(109,184,255,0.22)",
                                color:
                                  zone.risk === "critical"
                                    ? "#ffd2d9"
                                    : zone.risk === "warning"
                                      ? "#ffde94"
                                      : "#bfe8ff",
                              }}
                            >
                              {visual.label}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {showWorkLayer && zone.activePermits.length > 0 && (
                            <span className="rounded-full border border-white/10 bg-slate-950/24 px-3 py-1 text-[12px] font-medium text-white">
                              作业 {zone.activePermits.length}
                            </span>
                          )}
                          {showPeopleLayer && (
                            <span className="rounded-full border border-white/10 bg-slate-950/24 px-3 py-1 text-[12px] font-medium text-white">
                              在岗 {zone.headcount}
                            </span>
                          )}
                          {showSafetyLayer && zone.notes[0] && (
                            <span className="rounded-full border border-white/10 bg-slate-950/24 px-3 py-1 text-[12px] font-medium text-white">
                              {zone.notes[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {showWorkLayer && (
                <g opacity="0.94">
                  <ZoneChip x={292} y={300} label="作业点 A" tone="warning" />
                  <ZoneChip x={913} y={244} label="检修票 WP-003" tone="critical" />
                  <ZoneChip x={268} y={528} label="隔离待确认" tone="info" />
                </g>
              )}

              {showPeopleLayer && (
                <g opacity="0.92">
                  {[
                    { x: 254, y: 276, count: 8 },
                    { x: 634, y: 278, count: 5 },
                    { x: 1018, y: 214, count: 2 },
                    { x: 344, y: 525, count: 4 },
                    { x: 828, y: 512, count: 3 },
                  ].map((marker) => (
                    <g key={`${marker.x}-${marker.y}`}>
                      <circle cx={marker.x} cy={marker.y} r={15} fill="rgba(91,231,255,0.18)" />
                      <circle cx={marker.x} cy={marker.y} r={8} fill="#8feeff" />
                      <text
                        x={marker.x + 18}
                        y={marker.y + 5}
                        fontSize="13"
                        fontWeight="600"
                        fill="#d9f8ff"
                      >
                        {marker.count} 人
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>

            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
              <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                主厂房总图
              </div>
              <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                工艺连线
              </div>
              <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                区域风险叠加
              </div>
            </div>
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
