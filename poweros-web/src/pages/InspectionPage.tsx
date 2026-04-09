import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { events, inspectionTasks } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";

export default function InspectionPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(inspectionTasks[0]?.id ?? "");
  const selectEvent = usePowerStore((state) => state.selectEvent);
  const focusTask = inspectionTasks.find((task) => task.id === selectedTaskId) ?? inspectionTasks[0];
  const linkedEvent = events.find((event) => event.id === focusTask?.linkedEventId);

  const statusData = useMemo(
    () => [
      { name: "待执行", value: inspectionTasks.filter((task) => task.status === "queued").length },
      { name: "执行中", value: inspectionTasks.filter((task) => task.status === "running").length },
      { name: "异常", value: inspectionTasks.filter((task) => task.status === "exception").length },
      { name: "已闭环", value: inspectionTasks.filter((task) => task.status === "closed").length },
    ],
    [],
  );

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="巡检与处置闭环中心"
        description="PowerOS 把机器人巡检、人工巡检、异常复核和工单闭环放在一条链上。巡检不是孤立模块，而是与设备健康、事件、安全和处置流程联动。"
        actions={<Badge tone="info">机器人与人工巡检联动</Badge>}
      />

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-5" eyebrow="Inspection Queue" title="今日巡检任务">
          <div className="space-y-3">
            {inspectionTasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                className={`w-full rounded-[28px] p-5 text-left transition ${
                  focusTask.id === task.id
                    ? "surface-card-hero"
                    : "surface-card-soft hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{task.title}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{task.route}</p>
                  </div>
                  <Badge tone={task.status === "exception" ? "critical" : task.status === "running" ? "warning" : task.status === "closed" ? "positive" : "info"}>
                    {task.eta}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-7" eyebrow="Closure Status" title={focusTask.title}>
          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="surface-card rounded-[28px] p-5">
              <div className="text-sm text-slate-500">任务状态</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={focusTask.status === "exception" ? "critical" : focusTask.status === "running" ? "warning" : focusTask.status === "closed" ? "positive" : "info"}>
                  {focusTask.status}
                </Badge>
                <Badge>{focusTask.mode}</Badge>
                <Badge>{focusTask.owner}</Badge>
              </div>
              <p className="text-sm leading-7 text-slate-300">{focusTask.result}</p>
              {linkedEvent && (
                <button
                  type="button"
                  onClick={() => selectEvent(linkedEvent.id)}
                className="surface-button w-full rounded-2xl px-4 py-3 text-sm font-medium text-white"
                >
                  查看关联事件：{linkedEvent.title}
                </button>
              )}
            </div>

            <div className="surface-card rounded-[28px] p-5">
              <div className="text-sm text-slate-500">巡检执行分布</div>
              <div className="mt-4 h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#09131d",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                      }}
                    />
                    <Bar dataKey="value" fill="#5BE7FF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
