import unittest

from app.core.demo_state import DemoState
from app.core.engine import classify_prompt


class DemoStateTests(unittest.TestCase):
    def test_running_weather_scenario_sets_active_session(self) -> None:
        state = DemoState()
        snapshot = state.run_scenario("weather-ramp")
        self.assertEqual(snapshot["active_session"]["key"], "weather-ramp")
        self.assertGreater(len(snapshot["semantic_events"]), 0)

    def test_prompt_classification_matches_asset_scenario(self) -> None:
        scenario_key, _ = classify_prompt("1 号泵 A 轴承振动升高，请安排检修建议")
        self.assertEqual(scenario_key, "asset-clinic")

    def test_snapshot_contains_all_metrics(self) -> None:
        state = DemoState()
        snapshot = state.snapshot()
        metric_keys = {metric["key"] for metric in snapshot["metrics"]}
        self.assertEqual(metric_keys, {"margin", "load", "safety", "carbon", "asset_health"})


if __name__ == "__main__":
    unittest.main()
