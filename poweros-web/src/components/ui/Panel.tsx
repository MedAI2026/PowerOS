import { ReactNode } from "react";

import { cn } from "../../utils/cn";

interface PanelProps {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export default function Panel({
  title,
  eyebrow,
  action,
  className,
  children,
}: PanelProps) {
  return (
    <section
      className={cn(
        "surface-panel rounded-[32px] p-6 backdrop-blur-xl",
        className,
      )}
    >
      {(title || eyebrow || action) && (
        <div className="relative z-[1] mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-200/62">
                {eyebrow}
              </p>
            )}
            {title && <h3 className="mt-3 text-[1.2rem] font-semibold text-white">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className="relative z-[1]">{children}</div>
    </section>
  );
}
