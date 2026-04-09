import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-4xl">
        <p className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/58">
          PowerOS Workspace
        </p>
        <h1 className="display-title mt-4 text-[2.9rem] font-semibold tracking-tight text-white md:text-[4rem]">
          {title}
        </h1>
        <div className="section-divider mt-5 max-w-3xl" />
        <p className="mt-5 max-w-3xl text-sm leading-8 text-slate-300 md:text-[15px]">
          {description}
        </p>
      </div>
      {actions && <div className="self-start md:self-end">{actions}</div>}
    </div>
  );
}
