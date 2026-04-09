import { AgentStatus, EventSeverity, EventStatus, PermitStatus, RiskLevel } from "../types/poweros";

export function formatPercent(value: number) {
  return `${value.toFixed(0)}%`;
}

export function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function severityLabel(value: EventSeverity) {
  return {
    critical: "严重",
    high: "高",
    medium: "中",
    low: "低",
  }[value];
}

export function statusLabel(value: EventStatus) {
  return {
    new: "新发生",
    triaging: "研判中",
    coordinating: "协同中",
    processing: "处理中",
    closed: "已闭环",
  }[value];
}

export function riskLabel(value: RiskLevel) {
  return {
    normal: "正常",
    attention: "关注",
    warning: "预警",
    critical: "严重",
  }[value];
}

export function permitLabel(value: PermitStatus) {
  return {
    draft: "草稿",
    reviewing: "审批中",
    isolating: "隔离校验",
    ready: "许可待发",
    active: "执行中",
    closed: "已关闭",
  }[value];
}

export function agentStatusLabel(value: AgentStatus) {
  return {
    standby: "待命",
    analyzing: "分析中",
    advising: "已生成建议",
    coordinating: "协同中",
  }[value];
}
