# Nexus Power

`Nexus Power` is a zero-dependency PoC for the Agentic-Mesh architecture described in the approval memo. It demonstrates how a smart power plant can flatten traditional ISA-95 layers into a semantic event layer, a multi-agent reasoning layer, and a generative decision interface.

The implementation is intentionally lightweight so it can run immediately in a clean environment:

- Backend: Python standard library HTTP server
- Agent runtime: deterministic multi-agent orchestration simulator
- Frontend: static HTML, CSS, and JavaScript dashboard
- Deployment: local Python process or `docker compose`

## What the PoC demonstrates

- Unified semantic event feed inspired by MQTT/UNS
- Multi-agent collaboration across production and commercial decisions
- Transparent reasoning board with evidence, trade-offs, and consensus
- Two approval scenarios:
  - Extreme weather auto dispatch and pricing
  - Asset anomaly digital clinic

## Project layout

- `app/server.py`: HTTP server and REST API
- `app/core/`: state, scenario catalog, orchestration engine
- `app/static/`: dashboard UI
- `docs/architecture.md`: implementation notes and upgrade path
- `docker-compose.yml`: single-service demo deployment

## Run locally

```bash
python3 -m app.server
```

Then open [http://localhost:8000](http://localhost:8000).

## Run with Docker Compose

```bash
docker compose up --build
```

Then open [http://localhost:8000](http://localhost:8000).

## API endpoints

- `GET /api/health`
- `GET /api/bootstrap`
- `GET /api/state`
- `POST /api/scenarios/weather-ramp/run`
- `POST /api/scenarios/asset-clinic/run`
- `POST /api/chat`

## Notes

- This PoC uses a built-in simulation bus instead of a live MQTT broker so it can run without external packages.
- The backend boundaries mirror a future production upgrade path to `FastAPI + LangGraph + MQTT/EMQX + vector retrieval`.
