import { useState } from "react";
import { ArrowRight, BadgeCheck, LockKeyhole, RadioTower, ShieldCheck, UserRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { usePowerStore } from "../store/usePowerStore";

const defaultUsername = "operator.demo";
const defaultPassword = "PowerOS@2026";

const loginHighlights = [
  "事件即入口，而不是菜单即入口",
  "多智能体协同推理，而不是单点报表查询",
  "数字现场、设备、安全与经营的统一工作台",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginDemo = usePowerStore((state) => state.loginDemo);

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [hint, setHint] = useState("演示账号已自动填充，点击即可进入系统。");

  const nextPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setHint("请输入用户名和密码。演示环境不校验后台，但需要完整填写。");
      return;
    }

    loginDemo(username);
    navigate(nextPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-[1560px] items-center px-4 py-6 md:px-6">
        <div className="grid w-full gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className="surface-panel rounded-[38px] p-6 md:p-8 xl:p-10">
            <div className="relative z-[1]">
              <div className="text-[10px] uppercase tracking-[0.38em] text-cyan-200/66">
                PowerOS Runtime
              </div>
              <div className="mt-6 max-w-4xl space-y-1.5 md:space-y-2">
                <div className="display-title text-[2.35rem] font-semibold leading-[0.98] text-white md:text-[3.3rem] xl:text-[4.1rem]">
                  电厂智能体
                </div>
                <div className="display-title text-[2.35rem] font-semibold leading-[0.98] text-white md:text-[3.3rem] xl:text-[4.1rem]">
                  原生操作系统
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-[15px] leading-8 text-slate-300">
                面向火电厂与综合能源电厂场景的演示入口。默认使用预置账号登录，用于展示事件驱动、智能体协同和数字现场一体化工作台。
              </p>

              <div className="mt-7 grid gap-3">
                {loginHighlights.map((item) => (
                  <div key={item} className="surface-card-soft rounded-[22px] px-4 py-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/[0.08] text-cyan-200">
                        <BadgeCheck className="h-4 w-4" />
                      </span>
                      <p className="text-sm leading-7 text-slate-300">{item}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    在线智能体
                  </div>
                  <div className="mt-3 display-title text-[2rem] font-semibold text-white">5</div>
                  <div className="mt-2 text-sm text-slate-400">运行 / 设备 / 安全 / 现场 / 协调</div>
                </div>
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    当前剧本
                  </div>
                  <div className="mt-3 text-[1.15rem] font-semibold text-white">极端天气联动</div>
                  <div className="mt-2 text-sm text-slate-400">适合首轮演示开场</div>
                </div>
                <div className="surface-card rounded-[24px] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    演示模式
                  </div>
                  <div className="mt-3 text-[1.15rem] font-semibold text-white">Demo Access</div>
                  <div className="mt-2 text-sm text-slate-400">不接真实用户系统</div>
                </div>
              </div>
            </div>
          </section>

          <section className="surface-panel rounded-[38px] p-6 md:p-8 xl:p-10">
            <div className="relative z-[1] mx-auto max-w-[520px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.36em] text-cyan-200/66">
                    Demo Login
                  </div>
                  <h1 className="mt-4 text-[1.75rem] font-semibold text-white">进入 PowerOS 演示环境</h1>
                </div>
                <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                  默认已填账号
                </div>
              </div>

              <div className="surface-card-hero mt-6 rounded-[28px] p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/[0.12] text-cyan-200">
                    <RadioTower className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white">演示工作台入口</div>
                    <div className="mt-1 text-sm text-slate-300">
                      适合直接进入总控台、数字现场和智能体协同场景。
                    </div>
                  </div>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="surface-card block rounded-[24px] px-5 py-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    <UserRound className="h-4 w-4" />
                    用户名
                  </div>
                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="mt-3 w-full bg-transparent text-base font-medium text-white outline-none"
                  />
                </label>

                <label className="surface-card block rounded-[24px] px-5 py-4">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    <LockKeyhole className="h-4 w-4" />
                    密码
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-3 w-full bg-transparent text-base font-medium text-white outline-none"
                  />
                </label>

                <div className="surface-card-soft rounded-[22px] px-4 py-3 text-sm leading-7 text-slate-300">
                  演示账号：
                  <span className="mx-2 rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-white">
                    {defaultUsername}
                  </span>
                  <span className="rounded-full bg-white/[0.05] px-2.5 py-1 text-xs text-white">
                    {defaultPassword}
                  </span>
                </div>

                <button
                  type="submit"
                  className="surface-button flex w-full items-center justify-center gap-2 rounded-[22px] px-5 py-4 text-sm font-medium text-white"
                >
                  进入系统
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                  预置账号
                </div>
                <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                  无后台校验
                </div>
                <div className="surface-card-soft rounded-full px-3 py-2 text-xs text-slate-300">
                  演示结束可退出
                </div>
              </div>

              <div className="mt-5 rounded-[22px] border border-emerald-300/10 bg-emerald-400/[0.08] px-4 py-3 text-sm leading-7 text-emerald-100">
                {hint}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-white/6 bg-white/[0.03] px-4 py-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
                <p className="text-sm leading-7 text-slate-400">
                  这是演示用途的静态登录页，仅用于进入产品工作台，不建立用户管理、权限系统和真实账号体系。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
