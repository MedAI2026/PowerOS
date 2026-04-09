from __future__ import annotations

import random
import threading
import time
from typing import Any, Dict, List

from .engine import AGENT_NAMES, build_scenario_session
from .models import AgentCard, Metric
from .scenarios import SCENARIOS


class DemoState:
    def __init__(self) -> None:
        self._lock = threading.RLock()
        self._rng = random.Random(7)
        self._metric_order = ["margin", "load", "safety", "carbon", "asset_health"]
        self._metric_labels = {
            "margin": ("实时获利能力", "元/MWh", 1),
            "load": ("机组负荷", "%", 1),
            "safety": ("安全评分", "分", 1),
            "carbon": ("碳强度", "t/MWh", 3),
            "asset_health": ("设备健康", "分", 1),
        }
        self._metrics: Dict[str, float] = {
            "margin": 82.4,
            "load": 71.5,
            "safety": 97.4,
            "carbon": 0.812,
            "asset_health": 94.6,
        }
        self._targets = dict(self._metrics)
        self._agents: List[AgentCard] = [
            AgentCard("Orchestrator", AGENT_NAMES["Orchestrator"], "LLM Orchestrator", "负责跨域任务拆解与共识汇总"),
            AgentCard("Market Strategist", AGENT_NAMES["Market Strategist"], "Market Reasoner", "盯住现货价格、边际成本和报价曲线"),
            AgentCard("Optimizer", AGENT_NAMES["Optimizer"], "Physics-informed Optimizer", "校核锅炉效率、热耗和操作边界"),
            AgentCard("Asset Guardian", AGENT_NAMES["Asset Guardian"], "Asset Doctor", "监测设备健康并组织数字门诊"),
            AgentCard("Compliance Officer", AGENT_NAMES["Compliance Officer"], "Safety Guardian", "执行作业票、风险点和边界约束校核"),
        ]
        self._feed: List[Dict[str, Any]] = []
        self._semantic_events: List[Dict[str, Any]] = []
        self._active_session: Dict[str, Any] | None = None
        self._scenario_history: List[Dict[str, Any]] = []
        self._seed_default_feed()

    def _now(self) -> float:
        return time.time()

    def _timestamp(self) -> str:
        return time.strftime("%H:%M:%S", time.localtime())

    def _seed_default_feed(self) -> None:
        self._append_feed("系统启动", "Nexus Power 演示系统已进入仿真态。")
        self._append_feed("语义总线", "已装载 3 层逻辑面与 5 个核心智能体。")
        self._append_event(
            "PowerPlant/Unit1/Boiler/MainSteam/Temperature",
            540.2,
            "degC",
            0.98,
            "主蒸汽温度稳定。"
        )
        self._append_event(
            "PowerPlant/Unit1/Market/CurrentSpotPrice",
            468,
            "CNY/MWh",
            0.99,
            "当前现货价格处于平稳区间。"
        )

    def _append_feed(self, title: str, detail: str) -> None:
        self._feed.insert(0, {"time": self._timestamp(), "title": title, "detail": detail})
        self._feed = self._feed[:14]

    def _append_event(
        self,
        path: str,
        value: float,
        unit: str,
        confidence: float,
        summary: str,
    ) -> None:
        self._semantic_events.insert(
            0,
            {
                "time": self._timestamp(),
                "path": path,
                "value": value,
                "unit": unit,
                "confidence": confidence,
                "summary": summary,
            },
        )
        self._semantic_events = self._semantic_events[:12]

    def _build_metrics(self) -> List[Dict[str, Any]]:
        metrics: List[Dict[str, Any]] = []
        for key in self._metric_order:
            label, unit, decimals = self._metric_labels[key]
            metrics.append(Metric(key, label, self._metrics[key], unit, decimals).to_dict())
        return metrics

    def _active_step_index(self, elapsed_ms: float, steps: List[Dict[str, Any]]) -> int:
        for index, step in enumerate(steps):
            next_offset = steps[index + 1]["offset_ms"] if index + 1 < len(steps) else 10**9
            if step["offset_ms"] <= elapsed_ms < next_offset:
                return index
        return len(steps) - 1

    def _materialize_session(self) -> Dict[str, Any] | None:
        if not self._active_session:
            return None

        elapsed_ms = max(0.0, (self._now() - self._active_session["started_at"]) * 1000.0)
        steps = []
        current_index = self._active_step_index(elapsed_ms, self._active_session["steps"])

        for index, step in enumerate(self._active_session["steps"]):
            if elapsed_ms >= step["offset_ms"]:
                status = "active" if index == current_index and elapsed_ms < self._active_session["final_offset_ms"] else "done"
            else:
                status = "queued"
            steps.append({**step, "status": status})

        return {
            "key": self._active_session["key"],
            "title": self._active_session["title"],
            "brief": self._active_session["brief"],
            "started_at": self._active_session["started_at"],
            "elapsed_ms": elapsed_ms,
            "final_offset_ms": self._active_session["final_offset_ms"],
            "steps": steps,
            "recommendation": self._active_session["recommendation"],
            "causal_chain": self._active_session["causal_chain"],
            "tradeoffs": self._active_session["tradeoffs"],
            "evidence": self._active_session["evidence"],
        }

    def _update_agents(self) -> None:
        active_session = self._materialize_session()
        active_agent_key = None
        completed_agents = set()
        if active_session:
            for step in active_session["steps"]:
                if step["status"] == "active":
                    active_agent_key = step["agent"]
                if step["status"] == "done":
                    completed_agents.add(step["agent"])

        for agent in self._agents:
            if agent.key == active_agent_key:
                agent.status = "active"
            elif agent.key in completed_agents:
                agent.status = "engaged"
            else:
                agent.status = "standby"

    def heartbeat(self) -> None:
        with self._lock:
            for key, target in self._targets.items():
                gap = target - self._metrics[key]
                self._metrics[key] += gap * 0.18 + self._rng.uniform(-0.18, 0.18)

            self._metrics["safety"] = max(88.0, min(99.5, self._metrics["safety"]))
            self._metrics["asset_health"] = max(70.0, min(99.0, self._metrics["asset_health"]))
            self._metrics["load"] = max(45.0, min(100.0, self._metrics["load"]))
            self._metrics["margin"] = max(40.0, min(140.0, self._metrics["margin"]))
            self._metrics["carbon"] = max(0.700, min(0.920, self._metrics["carbon"]))

            active_session = self._materialize_session()
            if active_session and not self._active_session["effects_applied"]:
                if active_session["elapsed_ms"] >= self._active_session["final_offset_ms"]:
                    effects = SCENARIOS[self._active_session["key"]]["effects"]
                    for key, delta in effects.items():
                        self._targets[key] += delta
                    self._active_session["effects_applied"] = True
                    self._scenario_history.insert(
                        0,
                        {
                            "key": self._active_session["key"],
                            "title": self._active_session["title"],
                            "finished_at": self._timestamp(),
                        },
                    )
                    self._append_feed("联合决策完成", active_session["recommendation"]["headline"])

            if self._rng.random() < 0.25:
                self._append_event(
                    "PowerPlant/Unit1/Turbine/LoadSetpoint",
                    round(self._metrics["load"], 1),
                    "%",
                    0.97,
                    "负荷设定值保持在当前优化目标附近。"
                )

            self._update_agents()

    def run_scenario(self, key: str) -> Dict[str, Any]:
        with self._lock:
            session = build_scenario_session(key)
            self._active_session = session.to_dict()
            self._append_feed("场景注入", f"{session.title} 已开始执行。")
            self._append_feed("编排器接管", session.brief)
            for event in SCENARIOS[key]["semantic_events"]:
                self._append_event(
                    event["path"],
                    event["value"],
                    event["unit"],
                    event["confidence"],
                    event["summary"],
                )
            self._update_agents()
            return self.snapshot()

    def snapshot(self) -> Dict[str, Any]:
        with self._lock:
            active_session = self._materialize_session()
            return {
                "title": "Nexus Power",
                "subtitle": "智慧电厂 Agentic-Mesh 演示系统",
                "metrics": self._build_metrics(),
                "agents": [agent.to_dict() for agent in self._agents],
                "semantic_events": list(self._semantic_events),
                "feed": list(self._feed),
                "active_session": active_session,
                "scenarios": [
                    {
                        "key": item["key"],
                        "title": item["title"],
                        "brief": item["brief"],
                        "prompt_hint": item["prompt_hint"],
                    }
                    for item in SCENARIOS.values()
                ],
                "history": list(self._scenario_history[:6]),
                "layers": [
                    {
                        "name": "语义感知底座面",
                        "detail": "统一命名空间承载设备、市场和环境事件流。"
                    },
                    {
                        "name": "智能体推理面",
                        "detail": "多智能体执行任务拆解、证据检索和协同共识。"
                    },
                    {
                        "name": "生成式交互面",
                        "detail": "自然语言提问、推理透明化与决策画布。"
                    },
                ],
            }
