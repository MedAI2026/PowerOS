export type RoleId =
  | "shift-supervisor"
  | "asset-specialist"
  | "safety-officer"
  | "plant-director";

export type EventSeverity = "critical" | "high" | "medium" | "low";
export type EventStatus =
  | "new"
  | "triaging"
  | "coordinating"
  | "processing"
  | "closed";
export type AgentStatus = "standby" | "analyzing" | "advising" | "coordinating";
export type RiskLevel = "normal" | "attention" | "warning" | "critical";
export type PermitStatus =
  | "draft"
  | "reviewing"
  | "isolating"
  | "ready"
  | "active"
  | "closed";
export type LayerId =
  | "device"
  | "safety"
  | "work"
  | "people"
  | "risk";

export interface RoleProfile {
  id: RoleId;
  name: string;
  title: string;
  focus: string;
  summary: string;
}

export interface AppMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  tone?: "neutral" | "positive" | "warning" | "critical";
}

export interface PowerEvent {
  id: string;
  title: string;
  category: string;
  severity: EventSeverity;
  status: EventStatus;
  source: string;
  time: string;
  zoneId: string;
  equipmentIds: string[];
  ownerRole: RoleId;
  summary: string;
  influence: string;
  recommendedActions: string[];
  agentsInvolved: string[];
}

export interface AgentCard {
  id: string;
  name: string;
  mission: string;
  status: AgentStatus;
  target: string;
  confidence: number;
  lastOutput: string;
  explanationSummary: string[];
  queue: number;
}

export interface EquipmentTrendPoint {
  time: string;
  vibration: number;
  temperature: number;
  load: number;
  health: number;
}

export interface EquipmentAsset {
  id: string;
  name: string;
  area: string;
  system: string;
  score: number;
  risk: RiskLevel;
  mode: string;
  openDefects: number;
  latestIssue: string;
  suggestion: string;
  tags: string[];
  trend: EquipmentTrendPoint[];
}

export interface WorkPermit {
  id: string;
  title: string;
  area: string;
  team: string;
  status: PermitStatus;
  risk: RiskLevel;
  isolationReady: boolean;
  crossConflict: boolean;
  personnel: string[];
  startWindow: string;
  summary: string;
}

export interface PlantZone {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  risk: RiskLevel;
  devices: string[];
  activePermits: string[];
  headcount: number;
  notes: string[];
}

export interface InspectionTask {
  id: string;
  title: string;
  route: string;
  owner: string;
  mode: "robot" | "manual" | "joint";
  status: "queued" | "running" | "exception" | "closed";
  result: string;
  linkedEventId?: string;
  eta: string;
}

export interface DashboardInsight {
  id: string;
  title: string;
  detail: string;
  roleIds: RoleId[];
  tone?: "neutral" | "positive" | "warning" | "critical";
}

export interface TrendRecord {
  label: string;
  load: number;
  margin: number;
  risk: number;
  availability: number;
}

export interface ScenarioStep {
  id: string;
  title: string;
  detail: string;
  actorIds: string[];
  delayMs: number;
  output: string;
}

export type ScenarioStepStatus = "pending" | "active" | "done";

export interface AgentScenario {
  id: string;
  name: string;
  summary: string;
  initialEventId: string;
  recommendedAction: string;
  steps: ScenarioStep[];
}
