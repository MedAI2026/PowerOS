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

  const applyCustomCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setHint(`已应用${user}账号。`);
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
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb--1" />
      <div className="login-bg-orb login-bg-orb--2" />
      <div className="login-bg-orb login-bg-orb--3" />

      <div className="login-container">
        <div className="login-card-outer">
          <div className="login-grid">
            <section className="login-brand">
              <div className="login-brand-runtime">
                <span className="dot" />
                PowerOS Runtime
              </div>

              <div className="login-brand-title">
                <h1>PowerOS</h1>
                <h2>电厂智能操作系统</h2>
              </div>

              <p className="login-brand-desc">
                面向火电厂与综合能源电厂的演示入口。默认使用预置账号登录，用于展示生产、设备、安全、现场与智能体协同的一体化工作台。
              </p>

              <div className="login-features">
                {loginFeatures.map(({ title, description, Icon }) => (
                  <div key={title} className="login-feature-item">
                    <div className="login-feature-icon">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="login-feature-text">
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="login-brand-stats">
                {loginStats.map((item) => (
                  <div key={item.label}>
                    <div className="login-stat-value">{item.value}</div>
                    <div className="login-stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="login-form-panel">
              <div className="login-form-card">
                <div className="flex items-center gap-3">
                  <span className="login-form-badge">Demo Access</span>
                  <span className="text-sm text-slate-400">无需真实账号</span>
                </div>

                <h3 className="login-form-title">进入 PowerOS 演示环境</h3>
                <p className="login-form-subtitle">
                  默认登录后进入总控台，可从导航切换到智能事件、数字现场、设备健康和协同剧本等核心工作台。
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                  <label className="block">
                    <div className="login-field-label">
                      <UserRound />
                      用户名
                    </div>
                    <div className="login-field-input">
                      <input
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        placeholder="请输入演示账号"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <div className="login-field-label">
                      <LockKeyhole />
                      密码
                    </div>
                    <div className="login-field-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="请输入演示密码"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "隐藏密码" : "显示密码"}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </label>

                  <div className="login-quick-fill">
                    <button
                      type="button"
                      onClick={applyDemoCredentials}
                      className="login-quick-btn login-quick-btn--primary"
                    >
                      演示账号
                    </button>
                    <button
                      type="button"
                      onClick={() => applyCustomCredentials(defaultUsername, defaultPassword)}
                      className="login-quick-btn"
                    >
                      {defaultUsername}
                    </button>
                  </div>

                  <button type="submit" className="login-submit-btn">
                    登录系统
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  <div className="login-options-row">
                    <label className="login-remember">
                      <input
                        type="checkbox"
                        checked={rememberLogin}
                        onChange={(event) => setRememberLogin(event.target.checked)}
                      />
                      保持登录
                    </label>
                    <div className="login-status-info">
                      <Radar />
                      前端演示登录态，支持退出
                    </div>
                  </div>
                </form>

                <div className="login-hint-box">{hint}</div>

                <div className="login-disclaimer">
                  这是演示用模拟登录页，仅用于进入产品工作台，不建立真实用户、权限和账号管理系统。
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
