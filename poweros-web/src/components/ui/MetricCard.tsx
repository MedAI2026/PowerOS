import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { AppMetric } from "../../types/poweros";
import { cn } from "../../utils/cn";

const toneMap = {
  neutral: "text-slate-300",
  positive: "text-emerald-300",
  warning: "text-amber-300",
  critical: "text-red-300",
};

function TrendIcon({ delta }: { delta?: string }) {
  if (!delta) {
    return <Minus className="h-4 w-4" />;
  }
  if (delta.startsWith("-")) {
    return <ArrowDownRight className="h-4 w-4" />;
  }
  return <ArrowUpRight className="h-4 w-4" />;
}

export default function MetricCard({ metric }: { metric: AppMetric }) {
  return (
    <article className="surface-card relative overflow-hidden rounded-[30px] p-5">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-cyan-300/30 via-white/10 to-transparent" />
      <p className="text-[12px] uppercase tracking-[0.24em] text-slate-500">{metric.label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <strong className="display-title text-[2.35rem] font-semibold leading-none text-white">
          {metric.value}
        </strong>
        {metric.delta && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] ring-1 ring-inset",
              metric.tone ? toneMap[metric.tone] : "text-slate-300",
              "bg-black/10 ring-white/6",
            )}
          >
            <TrendIcon delta={metric.delta} />
            {metric.delta}
          </span>
        )}
      </div>
    </article>
  );
}
