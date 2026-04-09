import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, createBrowserRouter, createHashRouter, useLocation } from "react-router-dom";

import AppShell from "../layouts/AppShell";
import { usePowerStore } from "../store/usePowerStore";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EventCenterPage = lazy(() => import("../pages/EventCenterPage"));
const AgentCenterPage = lazy(() => import("../pages/AgentCenterPage"));
const AssetHealthPage = lazy(() => import("../pages/AssetHealthPage"));
const SafetyCenterPage = lazy(() => import("../pages/SafetyCenterPage"));
const DigitalSitePage = lazy(() => import("../pages/DigitalSitePage"));
const OperationsPage = lazy(() => import("../pages/OperationsPage"));
const InspectionPage = lazy(() => import("../pages/InspectionPage"));
const ExecutivePage = lazy(() => import("../pages/ExecutivePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));

function withSuspense(node: ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="rounded-[28px] border border-white/8 bg-white/[0.04] p-8 text-sm text-slate-300 shadow-panel">
          正在加载工作台...
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

function ProtectedShell() {
  const isAuthenticated = usePowerStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AppShell />;
}

function LoginEntry() {
  const isAuthenticated = usePowerStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return withSuspense(<LoginPage />);
}

const routes = [
  {
    path: "/login",
    element: <LoginEntry />,
  },
  {
    path: "/",
    element: <ProtectedShell />,
    children: [
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: "events", element: withSuspense(<EventCenterPage />) },
      { path: "agents", element: withSuspense(<AgentCenterPage />) },
      { path: "assets", element: withSuspense(<AssetHealthPage />) },
      { path: "safety", element: withSuspense(<SafetyCenterPage />) },
      { path: "site", element: withSuspense(<DigitalSitePage />) },
      { path: "operations", element: withSuspense(<OperationsPage />) },
      { path: "inspection", element: withSuspense(<InspectionPage />) },
      { path: "executive", element: withSuspense(<ExecutivePage />) },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

const isGithubPages =
  typeof window !== "undefined" && window.location.hostname.endsWith("github.io");

export const router = isGithubPages
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
