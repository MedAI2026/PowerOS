import { Suspense, lazy, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import AppShell from "../layouts/AppShell";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EventCenterPage = lazy(() => import("../pages/EventCenterPage"));
const AgentCenterPage = lazy(() => import("../pages/AgentCenterPage"));
const AssetHealthPage = lazy(() => import("../pages/AssetHealthPage"));
const SafetyCenterPage = lazy(() => import("../pages/SafetyCenterPage"));
const DigitalSitePage = lazy(() => import("../pages/DigitalSitePage"));
const OperationsPage = lazy(() => import("../pages/OperationsPage"));
const InspectionPage = lazy(() => import("../pages/InspectionPage"));
const ExecutivePage = lazy(() => import("../pages/ExecutivePage"));

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
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
]);
