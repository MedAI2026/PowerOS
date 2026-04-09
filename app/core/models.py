from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List


@dataclass
class Metric:
    key: str
    label: str
    value: float
    unit: str
    decimals: int = 1
    trend: str = "stable"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class AgentCard:
    key: str
    name: str
    persona: str
    focus: str
    status: str = "standby"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ScenarioSession:
    key: str
    title: str
    brief: str
    started_at: float
    final_offset_ms: int
    effects_applied: bool = False
    steps: List[Dict[str, Any]] = field(default_factory=list)
    recommendation: Dict[str, Any] = field(default_factory=dict)
    causal_chain: List[Dict[str, Any]] = field(default_factory=list)
    tradeoffs: List[str] = field(default_factory=list)
    evidence: List[Dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
