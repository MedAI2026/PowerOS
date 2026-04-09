from __future__ import annotations

import time
from typing import Dict, Tuple

from .knowledge import KNOWLEDGE_SNIPPETS
from .models import ScenarioSession
from .scenarios import SCENARIOS


AGENT_NAMES = {
    "Orchestrator": "主编排智能体",
    "Market Strategist": "现货交易智能体",
    "Optimizer": "性能调优智能体",
    "Asset Guardian": "设备健康智能体",
    "Compliance Officer": "安全合规智能体",
}


def build_scenario_session(key: str) -> ScenarioSession:
    config = SCENARIOS[key]
    final_offset = max(step["offset_ms"] for step in config["steps"])
    return ScenarioSession(
        key=key,
        title=config["title"],
        brief=config["brief"],
        started_at=time.time(),
        final_offset_ms=final_offset,
        steps=config["steps"],
        recommendation=config["recommendation"],
        causal_chain=config["causal_chain"],
        tradeoffs=config["tradeoffs"],
        evidence=KNOWLEDGE_SNIPPETS.get(key, []),
    )


def classify_prompt(message: str) -> Tuple[str | None, str]:
    normalized = message.lower()
    if any(keyword in message for keyword in ["降温", "电价", "报价", "负荷", "寒潮"]) or "price" in normalized:
        return "weather-ramp", "识别为经营与运行联动事件，我已切换到极端天气调频调价场景。"
    if any(keyword in message for keyword in ["轴承", "振动", "检修", "泵", "隐患"]) or "bearing" in normalized:
        return "asset-clinic", "识别为设备健康门诊事件，我已切换到设备隐患数字医生场景。"
    return None, "我已保留当前系统态势。你可以直接输入寒潮、电价、轴承振动或检修等关键词触发对应演示。"


def compose_briefing(message: str, state: Dict[str, object]) -> Dict[str, object]:
    scenario_key, summary = classify_prompt(message)
    active = state.get("active_session")
    metrics = state.get("metrics", [])
    metric_map = {metric["key"]: metric for metric in metrics}

    answer = {
        "summary": summary,
        "insight": (
            f"当前实时获利能力为 {metric_map.get('margin', {}).get('value', '--'):.1f} 元/MWh，"
            f"安全评分 {metric_map.get('safety', {}).get('value', '--'):.1f}。"
            if metric_map.get("margin") and metric_map.get("safety")
            else "当前没有可用的指标快照。"
        ),
        "active_title": active.get("title") if active else "当前无激活任务",
        "scenario_key": scenario_key,
    }
    return answer
