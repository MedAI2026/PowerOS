import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Radar,
  ShieldCheck,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { usePowerStore } from "../store/usePowerStore";

const defaultUsername = "operator.demo";
const defaultPassword = "PowerOS@2026";

const loginFeatures = [
  {
    title: "快速响应",
    description: "从事件与异常直接进入协同处置链路，而不是先翻菜单再找页面。",
    Icon: Zap,
  },
  {
    title: "智能协同",
    description: "运行、设备、安全与现场智能体共享上下文，给出一体化建议。",
    Icon: Workflow,
  },
  {
    title: "安全可信",
    description: "演示环境只保留体验所需登录态，不接真实用户体系和后台权限。",
    Icon: ShieldCheck,
  },
];

const loginStats = [
  { value: "9", label: "核心工作台" },
  { value: "3", label: "预置剧本" },
  { value: "4", label: "角色视角" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginDemo = usePowerStore((state) => state.loginDemo);

  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);
  const [rememberLogin, setRememberLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [hint, setHint] = useState("演示账号已自动填充，点击即可进入系统。");

  const nextPath =
    (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/";

  const applyDemoCredentials = () => {
    setUsername(defaultUsername);
    setPassword(defaultPassword);
    setHint("已恢复默认演示账号，可直接登录。");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setHint("请输入用户名和密码。演示环境不校验后台，但需要完整填写。");
      return;
    }

    loginDemo(username, rememberLogin);
    navigate(nextPath, { replace: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-hero-grid lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-screen max-w-[1680px] items-center px-4 py-3 md:px-6 md:py-4 xl:h-full xl:min-h-0 xl:px-8 xl:py-2">
        <div className="surface-panel grid w-full overflow-hidden rounded-[34px] xl:h-full xl:grid-cols-[1fr_0.92fr]">
          <section className="relative overflow-hidden px-6 py-7 md:px-9 md:py-8 xl:px-12 xl:py-7">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_8%_10%,rgba(91,231,255,0.12),transparent_24%),radial-gradient(circle_at_80%_88%,rgba(255,179,77,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-[0.14] [background-image:linear-gradient(rgba(91,231,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(91,231,255,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />

            <div className="relative z-[1] flex h-full flex-col">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                PowerOS Runtime
              </div>

              <div className="mt-7 max-w-[700px]">
                <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/62">
                  Demo Workspace For Intelligent Plant Operations
                </div>
                <h1 className="mt-3 text-[2.55rem] font-semibold tracking-[-0.05em] text-white md:text-[3.2rem] xl:text-[3.8rem]">
                  PowerOS
                </h1>
                <h2 className="mt-1.5 text-[1.42rem] font-semibold tracking-[-0.03em] text-white md:text-[1.86rem] xl:text-[2.18rem]">
                  电厂智能操作系统
                </h2>
                <p className="mt-4 max-w-[620px] text-[14px] leading-6.5 text-slate-300 md:text-[15px] md:leading-7">
                  面向火电厂与综合能源电厂的演示入口。默认使用预置账号登录，用于展示生产、设备、安全、现场与智能体协同的一体化工作台。
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  <span className="surface-card-soft rounded-full px-3 py-2 text-[12px] text-slate-300">
                    事件驱动工作台
                  </span>
                  <span className="surface-card-soft rounded-full px-3 py-2 text-[12px] text-slate-300">
                    多智能体协同
                  </span>
                  <span className="surface-card-soft rounded-full px-3 py-2 text-[12px] text-slate-300">
                    数字现场演示
                  </span>
                </div>
              </div>

              <div className="mt-5 grid max-w-[860px] gap-2.5">
                {loginFeatures.map(({ title, description, Icon }) => (
                  <div key={title} className="surface-card rounded-[22px] px-4 py-3 md:px-5 md:py-3.5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-cyan-300/[0.1] text-cyan-100">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <div>
                        <div className="text-[1rem] font-semibold text-white md:text-[1.05rem]">{title}</div>
                        <p className="mt-1 text-[13px] leading-5.5 text-slate-400 md:text-[14px] md:leading-6">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6">
                <div className="section-divider" />
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {loginStats.map((item) => (
                    <div key={item.label}>
                      <div className="text-[1.9rem] font-semibold tracking-[-0.05em] text-white md:text-[2.1rem]">
                        {item.value}
                      </div>
                      <div className="mt-1 text-[13px] text-slate-400 md:text-[14px]">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative flex items-center bg-[linear-gradient(180deg,rgba(3,8,16,0.96),rgba(5,10,18,0.985))] px-6 py-7 md:px-9 md:py-8 xl:border-l xl:border-white/[0.03] xl:px-12 xl:py-7">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_0%,rgba(60,118,255,0.14),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(16,30,56,0.72),transparent_42%)]" />

            <div className="relative z-[1] mx-auto w-full max-w-[540px]">
              <div className="surface-card rounded-[28px] border border-white/[0.06] bg-[linear-gradient(180deg,rgba(18,26,42,0.94),rgba(13,21,35,0.96))] p-5 shadow-[0_32px_90px_rgba(2,8,18,0.36)] md:p-6 xl:p-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-500/18 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                    Demo Access
                  </span>
                  <span className="text-sm text-slate-400">无需真实账号</span>
                </div>

                <h3 className="mt-4 text-[1.52rem] font-semibold tracking-[-0.04em] text-white md:text-[1.74rem]">
                  进入 PowerOS 演示环境
                </h3>
                <p className="mt-2.5 text-[13px] leading-6.5 text-slate-400 md:text-[14px] md:leading-7">
                  默认登录后进入总控台，可从导航切换到智能事件、数字现场、设备健康和协同剧本等核心工作台。
                </p>

                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <label className="block">
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-white">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      用户名
                    </div>
                    <div className="surface-card flex items-center rounded-[16px] px-4 py-3">
                      <input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className="w-full bg-transparent text-[0.98rem] font-medium text-white outline-none placeholder:text-slate-500"
                        placeholder="请输入演示账号"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-white">
                      <LockKeyhole className="h-4 w-4 text-slate-400" />
                      密码
                    </div>
                    <div className="surface-card flex items-center gap-3 rounded-[16px] px-4 py-3">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className="w-full bg-transparent text-[0.98rem] font-medium text-white outline-none placeholder:text-slate-500"
                        placeholder="请输入演示密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className="text-slate-400 transition hover:text-white"
                        aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={applyDemoCredentials}
                      className="rounded-[14px] bg-blue-500/20 px-3.5 py-2.5 text-[12px] font-medium text-blue-100 transition hover:bg-blue-500/28"
                    >
                      演示账号
                    </button>
                    <button
                      type="button"
                      onClick={applyDemoCredentials}
                      className="surface-card-soft rounded-[14px] px-3.5 py-2.5 text-[12px] text-slate-200 transition hover:text-white"
                    >
                      {defaultUsername}
                    </button>
                    <button
                      type="button"
                      onClick={applyDemoCredentials}
                      className="surface-card-soft rounded-[14px] px-3.5 py-2.5 text-[12px] text-slate-200 transition hover:text-white"
                    >
                      {defaultPassword}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="mt-1 flex w-full items-center justify-center gap-3 rounded-[17px] bg-[linear-gradient(135deg,#1d62ff,#3d8dff)] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_20px_44px_rgba(29,98,255,0.34)] transition hover:translate-y-[-1px] hover:shadow-[0_24px_54px_rgba(29,98,255,0.42)]"
                  >
                    登录系统
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="flex flex-col gap-2.5 text-[12px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2.5 text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(event) => setRememberLogin(event.target.checked)}
                        className="h-4 w-4 rounded border-white/10 bg-transparent accent-blue-500"
                      />
                      保持登录
                    </label>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Radar className="h-3.5 w-3.5" />
                      前端演示登录态，支持退出
                    </div>
                  </div>
                </form>

                <div className="mt-4 rounded-[17px] border border-blue-400/18 bg-blue-500/[0.08] px-4 py-3 text-[12px] leading-6 text-blue-100">
                  {hint}
                </div>

                <div className="mt-3 rounded-[18px] border border-white/6 bg-white/[0.03] px-4 py-3 text-[12px] leading-6 text-slate-400">
                  这是演示用模拟登录页，仅用于进入产品工作台，不建立真实用户、权限和账号管理系统。
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
