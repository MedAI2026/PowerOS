import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "../components/ui/Badge";
import MetricCard from "../components/ui/MetricCard";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import {
  events,
  insightByRole,
  plantZones,
  roleQuickMetrics,
  summaryMetrics,
  trendRecords,
} from "../mock/poweros-data";

export default function ExecutivePage() {
  const directorMetrics = roleQuickMetrics("plant-director");
  const directorInsights = insightByRole("plant-director");
  const zoneRisk = plantZones.map((zone) => ({
    name: zone.name,
    value:
      zone.risk === "critical"
        ? 90
        : zone.risk === "warning"
          ? 68
          : zone.risk === "attention"
            ? 45
            : 20,
  }));

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="管理驾驶舱"
        description="这个页面面向厂长和部门负责人，但它不是普通 BI。PowerOS 会从智能操作系统视角聚合全厂健康度、风险分布、作业执行、事件闭环和智能体辅助效率，让管理层看到行动脉络，而不是一堆静态图表。"
        actions={<Badge tone="positive">过去 24 小时闭环率 92%</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {summaryMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {directorMetrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-7" eyebrow="Management Trend" title="全厂经营与可用率趋势">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendRecords}>
                <defs>
                  <linearGradient id="executiveMargin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5BE7FF" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#5BE7FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#09131d",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                  }}
                />
                <Area type="monotone" dataKey="margin" stroke="#5BE7FF" fill="url(#executiveMargin)" />
                <Area type="monotone" dataKey="availability" stroke="#4FA6FF" fill="rgba(79,166,255,0.08)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="xl:col-span-5" eyebrow="Risk Distribution" title="区域风险分布">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneRisk} layout="vertical">
                <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" tickLine={false} axisLine={false} width={88} />
                <Tooltip
                  contentStyle={{
                    background: "#09131d",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                  }}
                />
                <Bar dataKey="value" fill="#FFB34D" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-6" eyebrow="Major Summary" title="过去 24 小时重大事件摘要">
          <div className="space-y-3">
            {events.slice(0, 4).map((event) => (
              <div key={event.id} className="surface-card-soft rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{event.title}</div>
                  <Badge tone={event.severity === "critical" ? "critical" : "warning"}>
                    {event.time}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{event.summary}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-6" eyebrow="AI Efficiency" title="智能体辅助管理摘要">
          <div className="space-y-3">
            {directorInsights.map((insight) => (
              <div key={insight.id} className="surface-card-soft rounded-2xl p-4">
                <div className="font-medium text-white">{insight.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{insight.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
