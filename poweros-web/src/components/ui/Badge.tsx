import { ReactNode } from "react";

import { cn } from "../../utils/cn";

type BadgeTone = "neutral" | "positive" | "warning" | "critical" | "info";

const toneMap: Record<BadgeTone, string> = {
  neutral: "bg-white/[0.06] text-slate-200 ring-1 ring-inset ring-white/8",
  positive: "bg-emerald-400/[0.12] text-emerald-200 ring-1 ring-inset ring-emerald-300/10",
  warning: "bg-amber-400/[0.14] text-amber-200 ring-1 ring-inset ring-amber-300/10",
  critical: "bg-red-400/[0.14] text-red-200 ring-1 ring-inset ring-red-300/10",
  info: "bg-cyan-400/[0.13] text-cyan-200 ring-1 ring-inset ring-cyan-300/10",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export default function Badge({
  children,
  tone = "neutral",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.02em] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
