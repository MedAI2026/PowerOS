# Nexus Power PoC Architecture

## Layers

### 1. Semantic Observation Layer

The PoC exposes a live semantic event feed with globally named paths such as:

- `PowerPlant/Region/Weather/ColdWaveForecast`
- `PowerPlant/Unit1/Market/SpotPriceForecast`
- `PowerPlant/Unit1/Pumps/PumpA/Bearing/Vibration`

The runtime keeps a rolling event log and publishes scenario-triggered updates into the same namespace that the frontend renders.

### 2. Agentic Reasoning Layer

The backend models the following agents:

- `Orchestrator`
- `Market Strategist`
- `Optimizer`
- `Asset Guardian`
- `Compliance Officer`

Each scenario is executed as a timed session with:

- task decomposition
- specialist reasoning
- evidence lookup
- trade-off synthesis
- consensus recommendation

### 3. Generative Interface Layer

The dashboard contains:

- strategic KPI halo
- scenario injection panel
- active agent mesh
- semantic bus panel
- transparent reasoning board
- causal chain and recommendation canvas

## Why the backend is dependency-free

The local environment did not include FastAPI, LangGraph, or MQTT client libraries. To avoid blocking execution on dependency installation, the PoC uses Python standard library components while preserving production-facing interfaces and concepts.

## Upgrade path

The following substitutions can be made without changing the demo story:

- `app/server.py` -> FastAPI service
- `app/core/engine.py` -> LangGraph workflow
- in-memory semantic bus -> EMQX or Mosquitto
- static evidence snippets -> vector retrieval over plant knowledge base
- deterministic routing -> LLM orchestration and tool usage
