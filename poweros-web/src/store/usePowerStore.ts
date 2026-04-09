import { create } from "zustand";

import {
  agentScenarios,
  agents as mockAgents,
  assets,
  events,
  inspectionTasks,
  plantZones,
  roleProfiles,
  workPermits,
} from "../mock/poweros-data";
import {
  AgentCard,
  AgentStatus,
  LayerId,
  RoleId,
  ScenarioStep,
  ScenarioStepStatus,
} from "../types/poweros";

interface RuntimeScenarioStep extends ScenarioStep {
  status: ScenarioStepStatus;
}

interface ScenarioLogItem {
  id: string;
  time: string;
  message: string;
}

interface PowerStore {
  roleId: RoleId;
  selectedEventId: string | null;
  selectedAssetId: string | null;
  selectedPermitId: string | null;
  selectedZoneId: string | null;
  selectedAgentId: string | null;
  activeLayers: LayerId[];
  agents: AgentCard[];
  activeScenarioId: string | null;
  scenarioTimeline: RuntimeScenarioStep[];
  scenarioLogs: ScenarioLogItem[];
  setRole: (roleId: RoleId) => void;
  selectEvent: (eventId: string | null) => void;
  selectAsset: (assetId: string | null) => void;
  selectPermit: (permitId: string | null) => void;
  selectZone: (zoneId: string | null) => void;
  selectAgent: (agentId: string | null) => void;
  toggleLayer: (layerId: LayerId) => void;
  startScenario: (scenarioId: string) => void;
  resetScenario: () => void;
}

const initialRoleId: RoleId = "shift-supervisor";
const initialEventId = null;
const scenarioTimers: number[] = [];

function cloneAgents() {
  return mockAgents.map((agent) => ({ ...agent, explanationSummary: [...agent.explanationSummary] }));
}

function clearTimers() {
  scenarioTimers.forEach((timer) => window.clearTimeout(timer));
  scenarioTimers.length = 0;
}

function nowLabel() {
  return new Date().toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function applyAgentStep(agents: AgentCard[], actorIds: string[], stepIndex: number, total: number) {
  return agents.map((agent) => {
    if (actorIds.includes(agent.id)) {
      const status: AgentStatus = stepIndex === total - 1 ? "coordinating" : "analyzing";
      return {
        ...agent,
        status,
      };
    }

    if (agent.status !== "standby") {
      return { ...agent, status: "advising" as AgentStatus };
    }

    return agent;
  });
}

export const usePowerStore = create<PowerStore>((set, get) => ({
  roleId: initialRoleId,
  selectedEventId: initialEventId,
  selectedAssetId: assets[0]?.id ?? null,
  selectedPermitId: workPermits[0]?.id ?? null,
  selectedZoneId: plantZones[0]?.id ?? null,
  selectedAgentId: mockAgents[0]?.id ?? null,
  activeLayers: ["device", "safety", "work", "risk"],
  agents: cloneAgents(),
  activeScenarioId: null,
  scenarioTimeline: [],
  scenarioLogs: [
    {
      id: "boot-01",
      time: nowLabel(),
      message: "PowerOS 已进入 Demo 模式，等待新的智能体协同剧本触发。",
    },
  ],
  setRole: (roleId) => set({ roleId }),
  selectEvent: (selectedEventId) => set({ selectedEventId }),
  selectAsset: (selectedAssetId) => set({ selectedAssetId }),
  selectPermit: (selectedPermitId) => set({ selectedPermitId }),
  selectZone: (selectedZoneId) => set({ selectedZoneId }),
  selectAgent: (selectedAgentId) => set({ selectedAgentId }),
  toggleLayer: (layerId) =>
    set((state) => ({
      activeLayers: state.activeLayers.includes(layerId)
        ? state.activeLayers.filter((item) => item !== layerId)
        : [...state.activeLayers, layerId],
    })),
  resetScenario: () => {
    clearTimers();
    set({
      activeScenarioId: null,
      scenarioTimeline: [],
      agents: cloneAgents(),
      scenarioLogs: [
        {
          id: `log-${Date.now()}`,
          time: nowLabel(),
          message: "已清空当前协同剧本，系统恢复到观察态。",
        },
      ],
    });
  },
  startScenario: (scenarioId) => {
    clearTimers();

    const scenario = agentScenarios.find((item) => item.id === scenarioId);
    if (!scenario) {
      return;
    }

    const baselineAgents = cloneAgents();
    const firstActors = scenario.steps[0]?.actorIds ?? [];
    const startedAgents = applyAgentStep(baselineAgents, firstActors, 0, scenario.steps.length);

    set({
      activeScenarioId: scenarioId,
      selectedEventId: scenario.initialEventId,
      agents: startedAgents,
      scenarioTimeline: scenario.steps.map((step, index) => ({
        ...step,
        status: index === 0 ? "active" : "pending",
      })),
      scenarioLogs: [
        {
          id: `log-start-${Date.now()}`,
          time: nowLabel(),
          message: `已触发剧本：${scenario.name}`,
        },
      ],
    });

    scenario.steps.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        const total = scenario.steps.length;
        const updatedAgents = applyAgentStep(cloneAgents(), step.actorIds, index, total).map((agent) => {
          if (scenario.steps.some((scenarioStep, stepIndex) => stepIndex <= index && scenarioStep.actorIds.includes(agent.id))) {
            const status: AgentStatus = step.actorIds.includes(agent.id)
              ? index === total - 1
                ? "coordinating"
                : "analyzing"
              : "advising";
            return {
              ...agent,
              status,
            };
          }

          return agent;
        });

        set((state) => ({
          agents: updatedAgents,
          scenarioTimeline: state.scenarioTimeline.map((runtimeStep, runtimeIndex) => ({
            ...runtimeStep,
            status:
              runtimeIndex < index ? "done" : runtimeIndex === index ? "active" : "pending",
          })),
          scenarioLogs: [
            ...state.scenarioLogs,
            {
              id: `log-${scenario.id}-${step.id}`,
              time: nowLabel(),
              message: `${step.title}：${step.output}`,
            },
          ],
        }));
      }, step.delayMs);

      scenarioTimers.push(timer);
    });

    const finishTimer = window.setTimeout(() => {
      set((state) => ({
        agents: state.agents.map((agent) =>
          scenario.steps.some((step) => step.actorIds.includes(agent.id))
            ? { ...agent, status: "advising" }
            : agent,
        ),
        scenarioTimeline: state.scenarioTimeline.map((runtimeStep) => ({
          ...runtimeStep,
          status: "done",
        })),
        scenarioLogs: [
          ...state.scenarioLogs,
          {
            id: `log-finish-${scenario.id}`,
            time: nowLabel(),
            message: `剧本完成：${scenario.recommendedAction}`,
          },
        ],
      }));
    }, scenario.steps[scenario.steps.length - 1].delayMs + 1200);

    scenarioTimers.push(finishTimer);
  },
}));

export const staticPowerData = {
  roleProfiles,
  events,
  assets,
  permits: workPermits,
  zones: plantZones,
  inspections: inspectionTasks,
  scenarios: agentScenarios,
};
