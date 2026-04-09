from __future__ import annotations

import json
import os
import threading
import time
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Dict
from urllib.parse import parse_qs, urlparse

from .core.demo_state import DemoState
from .core.engine import compose_briefing
from .core.scenarios import SCENARIOS


STATE = DemoState()
STATIC_DIR = Path(__file__).with_name("static")


class SimulatorThread(threading.Thread):
    def __init__(self) -> None:
        super().__init__(daemon=True)
        self._running = True

    def stop(self) -> None:
        self._running = False

    def run(self) -> None:
        while self._running:
            STATE.heartbeat()
            time.sleep(1.0)


SIMULATOR = SimulatorThread()


class NexusHandler(BaseHTTPRequestHandler):
    server_version = "NexusPower/0.1"

    def log_message(self, format: str, *args: Any) -> None:
        return

    def _send_json(self, payload: Dict[str, Any], status: int = 200) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, body: bytes, content_type: str, status: int = 200) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_static(self, file_name: str) -> None:
        target = STATIC_DIR / file_name
        if not target.exists():
            self._send_json({"error": "Not found"}, status=404)
            return

        content_type = "text/plain; charset=utf-8"
        if target.suffix == ".html":
            content_type = "text/html; charset=utf-8"
        elif target.suffix == ".css":
            content_type = "text/css; charset=utf-8"
        elif target.suffix == ".js":
            content_type = "application/javascript; charset=utf-8"

        self._send_text(target.read_bytes(), content_type)

    def _read_json(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length).decode("utf-8")
        if not raw:
            return {}
        return json.loads(raw)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path
        if path == "/":
            self._serve_static("index.html")
            return
        if path in {"/styles.css", "/app.js"}:
            self._serve_static(path.lstrip("/"))
            return
        if path == "/api/health":
            self._send_json({"ok": True, "service": "nexus-power"})
            return
        if path in {"/api/bootstrap", "/api/state"}:
            self._send_json(STATE.snapshot())
            return
        if path == "/api/scenarios":
            self._send_json({"items": list(SCENARIOS.values())})
            return
        if path == "/api/search":
            query = parse_qs(parsed.query).get("q", [""])[0]
            result = compose_briefing(query, STATE.snapshot())
            self._send_json(result)
            return
        self._send_json({"error": "Not found"}, status=404)

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        path = parsed.path

        if path.startswith("/api/scenarios/") and path.endswith("/run"):
            scenario_key = path.split("/")[3]
            if scenario_key not in SCENARIOS:
                self._send_json({"error": "Unknown scenario"}, status=404)
                return
            snapshot = STATE.run_scenario(scenario_key)
            self._send_json(snapshot)
            return

        if path == "/api/chat":
            payload = self._read_json()
            message = str(payload.get("message", "")).strip()
            result = compose_briefing(message, STATE.snapshot())
            if result["scenario_key"]:
                snapshot = STATE.run_scenario(result["scenario_key"])
                result["state"] = snapshot
            self._send_json(result)
            return

        self._send_json({"error": "Not found"}, status=404)


def run_server() -> None:
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))

    if not SIMULATOR.is_alive():
        SIMULATOR.start()

    server = ThreadingHTTPServer((host, port), NexusHandler)
    print(f"Nexus Power running on http://{host}:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        SIMULATOR.stop()


if __name__ == "__main__":
    run_server()
