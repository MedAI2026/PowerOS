import {
  Activity,
  Bot,
  BriefcaseBusiness,
  Gauge,
  Layers3,
  Map,
  RadioTower,
  Route,
  ShieldCheck,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import EventDrawer from "../components/shared/EventDrawer";
import RoleSwitcher from "../components/shared/RoleSwitcher";
import { roleProfiles } from "../mock/poweros-data";
import { usePowerStore } from "../store/usePowerStore";
import { cn } from "../utils/cn";

const navItems = [
  { to: "/", label: "总控台", shortLabel: "总控台", icon: Gauge },
  { to: "/events", label: "智能事件中心", shortLabel: "事件", icon: RadioTower },
  { to: "/agents", label: "智能体协同中心", shortLabel: "智能体", icon: Bot },
  { to: "/assets", label: "设备健康工作台", shortLabel: "设备", icon: Activity },
  { to: "/safety", label: "安全作业协同", shortLabel: "安全", icon: ShieldCheck },
  { to: "/site", label: "数字现场", shortLabel: "现场", icon: Map },
  { to: "/operations", label: "运行指挥工作台", shortLabel: "运行", icon: Layers3 },
  { to: "/inspection", label: "巡检闭环中心", shortLabel: "巡检", icon: Route },
  { to: "/executive", label: "管理驾驶舱", shortLabel: "驾驶舱", icon: BriefcaseBusiness },
];

export default function AppShell() {
  const location = useLocation();
  const roleId = usePowerStore((state) => state.roleId);
  const role = roleProfiles.find((item) => item.id === roleId) ?? roleProfiles[0];
  const isDashboard = location.pathname === "/";

  return (
    <div className="min-h-screen bg-hero-grid">
      <div
        className={cn(
          "mx-auto flex min-h-screen px-4 py-5 md:px-6",
          isDashboard ? "max-w-[1940px]" : "max-w-[1720px] gap-7",
        )}
      >
        {!isDashboard && (
          <aside className="surface-panel hidden w-[286px] shrink-0 flex-col rounded-[32px] p-5 backdrop-blur-xl xl:flex">
            <div className="surface-card-hero rounded-[28px] p-6">
              <p className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/64">
                PowerOS
              </p>
              <h1 className="display-title mt-4 text-[2.2rem] font-semibold leading-[0.94] text-white">
                电厂智能体原生操作系统
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                以事件为中心、以智能体为能力中枢、以现场闭环为价值输出。
              </p>
            </div>

            <nav className="mt-7 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-sm transition",
                        isActive
                          ? "bg-white/[0.09] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                          : "text-slate-400 hover:bg-white/[0.035] hover:text-white",
                      )
                    }
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] text-slate-300 transition group-hover:bg-white/[0.08] group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="surface-card mt-auto rounded-[26px] p-5">
              <p className="text-[10px] uppercase tracking-[0.34em] text-slate-500">
                Current POV
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">{role.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{role.summary}</p>
            </div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          {isDashboard ? (
            <header className="mb-4 space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.36em] text-cyan-200/52">
                  <span>PowerOS Runtime</span>
                  <span className="h-px w-16 bg-gradient-to-r from-cyan-300/30 to-transparent" />
                  <span className="text-slate-500">{role.title}</span>
                </div>
                <RoleSwitcher />
              </div>

              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "rounded-full px-4 py-2 text-xs font-medium transition",
                        isActive
                          ? "surface-card-hero text-white"
                          : "surface-card-soft text-slate-400 hover:text-white",
                      )
                    }
                  >
                    {item.shortLabel}
                  </NavLink>
                ))}
              </nav>
            </header>
          ) : (
            <header className="surface-panel mb-7 rounded-[34px] p-6 backdrop-blur-xl md:p-7">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-5xl">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-200/58">
                    PowerOS Runtime
                  </div>
                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                    <h2 className="display-title text-[2.4rem] font-semibold leading-[0.95] text-white md:text-[3rem]">
                      事件即入口 · 智能体即能力中心
                    </h2>
                    <span className="self-start rounded-full bg-white/[0.06] px-3 py-1 text-[11px] text-slate-300 ring-1 ring-inset ring-white/8">
                      {navItems.find((item) => item.to === location.pathname)?.label}
                    </span>
                  </div>
                  <div className="section-divider mt-5 max-w-4xl" />
                  <p className="mt-5 max-w-4xl text-sm leading-8 text-slate-300">
                    这不是传统 MIS 或 BI 看板。PowerOS 会理解当前态势、组织协同链路、给出建议行动，并把设备、作业、人员和现场放进同一套实时上下文中。
                  </p>
                </div>
                <RoleSwitcher />
              </div>
            </header>
          )}

          <main>
            <Outlet />
          </main>
        </div>
      </div>

      <EventDrawer />
    </div>
  );
}
