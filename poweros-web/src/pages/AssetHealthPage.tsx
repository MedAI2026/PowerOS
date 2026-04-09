import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { assets } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { riskLabel } from "../utils/format";

const pieColors = ["#5BE7FF", "#4FA6FF", "#FFB34D", "#FF6B6B"];

export default function AssetHealthPage() {
  const selectedAssetId = usePowerStore((state) => state.selectedAssetId);
  const selectAsset = usePowerStore((state) => state.selectAsset);
  const focusAsset = assets.find((asset) => asset.id === selectedAssetId) ?? assets[0];

  const riskDistribution = [
    { name: "正常", value: assets.filter((asset) => asset.risk === "normal").length },
    { name: "关注", value: assets.filter((asset) => asset.risk === "attention").length },
    { name: "预警", value: assets.filter((asset) => asset.risk === "warning").length },
    { name: "严重", value: assets.filter((asset) => asset.risk === "critical").length },
  ];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="设备健康工作台"
        description="设备在 PowerOS 中不是孤立对象。这里会把设备健康评分、工况、检修、风险和作业上下文关联到一起，帮助设备专工和运行人员同时理解“设备状态”和“系统影响”。"
        actions={<Badge tone="warning">预测性维护优先级已排序</Badge>}
      />

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-4" eyebrow="Risk Mix" title="设备风险分层">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={88}
                  paddingAngle={4}
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#09131d",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {riskDistribution.map((item, index) => (
              <div key={item.name} className="surface-card-soft flex items-center justify-between rounded-2xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: pieColors[index] }}
                  />
                  <span className="text-sm text-slate-300">{item.name}</span>
                </div>
                <span className="font-medium text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-8" eyebrow="Asset Detail" title={focusAsset.name}>
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="surface-card rounded-[28px] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">健康评分</div>
                  <div className="mt-2 text-4xl font-semibold text-white">{focusAsset.score}</div>
                </div>
                <Badge tone={focusAsset.score < 80 ? "critical" : focusAsset.score < 88 ? "warning" : "positive"}>
                  {riskLabel(focusAsset.risk)}
                </Badge>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="surface-card-soft rounded-2xl p-4">
                  <div className="text-sm text-slate-500">所属系统</div>
                  <div className="mt-2 font-medium text-white">{focusAsset.system}</div>
                </div>
                <div className="surface-card-soft rounded-2xl p-4">
                  <div className="text-sm text-slate-500">当前模式</div>
                  <div className="mt-2 font-medium text-white">{focusAsset.mode}</div>
                </div>
              </div>
              <div className="surface-card-soft rounded-2xl p-4">
                <div className="text-sm text-slate-500">最新异常</div>
                <div className="mt-2 font-medium text-white">{focusAsset.latestIssue}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{focusAsset.suggestion}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAsset.tags.map((tag) => (
                  <Badge key={tag} tone="info">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-[28px] p-5">
              <div className="text-sm text-slate-500">健康趋势与异常参数</div>
              <div className="mt-4 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={focusAsset.trend}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                    <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#09131d",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                      }}
                    />
                    <Line type="monotone" dataKey="health" stroke="#5BE7FF" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="vibration" stroke="#FFB34D" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="temperature" stroke="#FF6B6B" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <Panel eyebrow="Asset Portfolio" title="关键设备列表">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => selectAsset(asset.id)}
              className={`rounded-[28px] p-5 text-left transition ${
                focusAsset.id === asset.id
                  ? "surface-card-hero"
                  : "surface-card-soft hover:bg-white/[0.05]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-white">{asset.name}</div>
                  <div className="mt-2 text-sm text-slate-500">{asset.area}</div>
                </div>
                <Badge tone={asset.score < 80 ? "critical" : asset.score < 88 ? "warning" : "positive"}>
                  {asset.score}
                </Badge>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{asset.latestIssue}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {asset.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
