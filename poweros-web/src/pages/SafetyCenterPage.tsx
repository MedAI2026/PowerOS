import { ShieldAlert } from "lucide-react";

import Badge from "../components/ui/Badge";
import PageHeader from "../components/ui/PageHeader";
import Panel from "../components/ui/Panel";
import { events, workPermits } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { permitLabel, riskLabel } from "../utils/format";

const workflowOrder = ["reviewing", "isolating", "ready", "active", "closed"] as const;

export default function SafetyCenterPage() {
  const selectedPermitId = usePowerStore((state) => state.selectedPermitId);
  const selectPermit = usePowerStore((state) => state.selectPermit);
  const focusPermit = workPermits.find((permit) => permit.id === selectedPermitId) ?? workPermits[0];
  const relatedEvents = events.filter(
    (event) =>
      event.category.includes("作业") ||
      event.summary.includes(focusPermit.area) ||
      event.zoneId === "zone-boiler",
  );

  const stageIndex = workflowOrder.findIndex((item) => item === focusPermit.status);

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="安全作业协同中心"
        description="PowerOS 不把工作票和风险控制当作孤立流程。系统会理解谁、在什么区域、做什么作业、是否存在冲突、是否隔离到位，并把建议动作组织成许可链路。"
        actions={<Badge tone="critical">1 项交叉作业高风险</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <div className="surface-card rounded-3xl p-4">
          <div className="text-sm text-slate-500">今日工作票</div>
          <div className="mt-3 text-3xl font-semibold text-white">{workPermits.length}</div>
        </div>
        <div className="surface-card rounded-3xl p-4">
          <div className="text-sm text-slate-500">高风险作业</div>
          <div className="mt-3 text-3xl font-semibold text-white">
            {workPermits.filter((permit) => permit.risk === "critical").length}
          </div>
        </div>
        <div className="surface-card rounded-3xl p-4">
          <div className="text-sm text-slate-500">待隔离确认</div>
          <div className="mt-3 text-3xl font-semibold text-white">
            {workPermits.filter((permit) => !permit.isolationReady).length}
          </div>
        </div>
        <div className="surface-card rounded-3xl p-4">
          <div className="text-sm text-slate-500">交叉作业冲突</div>
          <div className="mt-3 text-3xl font-semibold text-white">
            {workPermits.filter((permit) => permit.crossConflict).length}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-7" eyebrow="Permit List" title="作业票与许可状态">
          <div className="space-y-3">
            {workPermits.map((permit) => (
              <button
                key={permit.id}
                type="button"
                onClick={() => selectPermit(permit.id)}
                className={`w-full rounded-[28px] p-5 text-left transition ${
                  permit.id === focusPermit.id
                    ? "surface-card-hero"
                    : "surface-card-soft hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{permit.title}</div>
                    <p className="mt-2 text-sm text-slate-400">{permit.summary}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={permit.risk === "critical" ? "critical" : permit.risk === "warning" ? "warning" : "info"}>
                      {riskLabel(permit.risk)}
                    </Badge>
                    <Badge>{permitLabel(permit.status)}</Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Panel>

        <Panel
          className="xl:col-span-5"
          eyebrow="Permit Context"
          title={focusPermit.title}
          action={<ShieldAlert className="h-5 w-5 text-cyan-200" />}
        >
          <div className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="surface-card-soft rounded-2xl p-4">
                <div className="text-sm text-slate-500">区域</div>
                <div className="mt-2 font-medium text-white">{focusPermit.area}</div>
              </div>
              <div className="surface-card-soft rounded-2xl p-4">
                <div className="text-sm text-slate-500">作业班组</div>
                <div className="mt-2 font-medium text-white">{focusPermit.team}</div>
              </div>
            </div>

            <div className="surface-card rounded-3xl p-4">
              <div className="text-sm text-slate-500">智能审查结论</div>
              <div className="mt-3 space-y-2">
                <div className="surface-card-soft rounded-2xl px-4 py-3 text-sm text-slate-300">
                  隔离完整性：{focusPermit.isolationReady ? "已满足放行条件" : "存在缺口，需二次复核"}
                </div>
                <div className="surface-card-soft rounded-2xl px-4 py-3 text-sm text-slate-300">
                  交叉作业：{focusPermit.crossConflict ? "存在冲突，需动态重排" : "当前无冲突"}
                </div>
                <div className="surface-card-hero rounded-2xl px-4 py-3 text-sm text-slate-100">
                  推荐动作：{focusPermit.crossConflict ? "先调整路径并补充会签，再发放受限许可。" : "按既定窗口放行并强化电子围栏。"}
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-7" eyebrow="Permit Workflow" title="许可闭环流程">
          <div className="space-y-3">
            {workflowOrder.map((stage, index) => (
              <div
                key={stage}
                className={`rounded-2xl p-4 ${
                  index < stageIndex
                    ? "surface-card"
                    : index === stageIndex
                      ? "surface-card-hero"
                      : "surface-card-soft"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{permitLabel(stage)}</div>
                  <Badge
                    tone={
                      index < stageIndex
                        ? "positive"
                        : index === stageIndex
                          ? "info"
                          : "neutral"
                    }
                  >
                    {index < stageIndex ? "已完成" : index === stageIndex ? "当前" : "待执行"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="xl:col-span-5" eyebrow="Related Events" title="关联风险与冲突">
          <div className="space-y-3">
            {relatedEvents.slice(0, 3).map((event) => (
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
      </section>
    </div>
  );
}
