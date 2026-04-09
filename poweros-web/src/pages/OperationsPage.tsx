import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { agents, events, trendRecords } from "../mock/poweros-data";

const operationMetrics = [
  { label: "机组负荷", value: "84%", detail: "高峰窗口上沿" },
  { label: "边际收益", value: "98 元/MWh", detail: "优于昨日均值" },
  { label: "关键约束", value: "3 项", detail: "主变与引风需关注" },
  { label: "运行建议", value: "4 条", detail: "2 条建议优先执行" },
];

export default function OperationsPage() {
  const operationEvents = events.filter(
    (event) => event.category === "运行偏差" || event.title.includes("引风机"),
  );
  const operationAgent = agents.find((agent) => agent.id === "operations-agent");

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="运行指挥工作台"
        description="这里不是复杂工艺画面的替代品，而是值长风格的智能运行工作台。重点展示当前负荷、关键运行参数、约束边界、异常点和智能体生成的运行建议。"
        actions={<Badge tone="info">值长风格工作台</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4">
        {operationMetrics.map((metric) => (
          <div key={metric.label} className="surface-card rounded-3xl p-4">
            <div className="text-sm text-slate-500">{metric.label}</div>
            <div className="mt-3 text-3xl font-semibold text-white">{metric.value}</div>
            <div className="mt-2 text-sm text-slate-400">{metric.detail}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-7" eyebrow="Operation Curve" title="负荷与边际收益">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendRecords}>
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
                <Line type="monotone" dataKey="load" stroke="#5BE7FF" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="margin" stroke="#FFB34D" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="xl:col-span-5" eyebrow="Running Summary" title="运行智能体建议">
          <div className="surface-card-hero rounded-[28px] p-5">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info">置信度 {Math.round((operationAgent?.confidence ?? 0) * 100)}%</Badge>
              <Badge tone="positive">建议已生成</Badge>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {operationAgent?.lastOutput}
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {operationAgent?.explanationSummary.map((item) => (
              <div key={item} className="surface-card-soft rounded-2xl p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-6" eyebrow="Constraint Radar" title="约束态势">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendRecords}>
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
                <Bar dataKey="risk" fill="#FF6B6B" radius={[8, 8, 0, 0]} />
                <Bar dataKey="availability" fill="#4FA6FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="xl:col-span-6" eyebrow="Focus Items" title="当前重点关注">
          <div className="space-y-3">
            {operationEvents.map((event) => (
              <div key={event.id} className="surface-card-soft rounded-2xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{event.title}</div>
                  <Badge tone={event.severity === "high" ? "warning" : "info"}>
                    {event.time}
                  </Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">{event.summary}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
