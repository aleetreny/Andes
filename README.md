<div align="center">

<img src="frontend/public/andes.svg" alt="Andes logo" width="72" />

# Andes

**Gemini reasons, physics verifies.**
An AI grid coordinator that helps Chile's power system recover from sudden outages, inside a verified digital-twin simulation.

🏆 **Winning project · Gemini × Google DeepMind hackathon · Encode London, 24–25 October 2026**

[**▶ Try the interactive demo**](https://aleetreny.github.io/Andes/) · [About the project](https://aleetreny.github.io/Andes/about) · [Design document](docs/hackathon-design.md)

![React](https://img.shields.io/badge/React_18-TypeScript-3178c6?logo=react&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.13-FastAPI-009688?logo=fastapi&logoColor=white)
![HiGHS](https://img.shields.io/badge/Optimisation-HiGHS_LP-2e7d32)
![Gemini](https://img.shields.io/badge/Agent-Gemini-8e75b2?logo=googlegemini&logoColor=white)
[![Deploy](https://github.com/aleetreny/Andes/actions/workflows/pages.yml/badge.svg)](https://github.com/aleetreny/Andes/actions/workflows/pages.yml)

</div>

---

## What it does

Chile's national grid runs 3,100 km from Arica to Chiloé along a single north–south backbone. When a large plant or a 500 kV line trips, power flows shift instantly, automatic load shedding cuts off homes, and operators have minutes to find a safe redispatch.

Andes puts that moment on a control-room map:

1. **Trigger an outage.** Trip a power plant or a transmission line anywhere on the corridor.
2. **See the impact.** Unserved demand, overloaded lines and homes left without power appear on the map.
3. **Compare recovery plans.** Gemini investigates the fault, calls the optimisation tools and proposes two plans, each solved by an LP solver and checked by an independent validator.
4. **Decide.** The operator applies or vetoes a plan and watches generation, line flows and households recover.

Every MW, MWh and dollar shown comes from deterministic code, never from the language model. Gemini reasons and explains; the solver and validator provide the numbers.

## Interactive demo

**[aleetreny.github.io/Andes](https://aleetreny.github.io/Andes/)** runs entirely in the browser, with no API key and no backend. It replays results that the HiGHS solver computed and the independent validator approved during the hackathon:

- Watch the recorded walkthrough, then pause, resume or restart it.
- Click any plant or line to open its four-hour outage case at the nearest recorded hour (09, 12, 13, 18, 19 or 20 h).
- Compare the two validated recovery options and apply either one, or veto the plan.

See [how the demo works and its limits](docs/portfolio.md).

## Architecture

![Andes architecture: jury input and a CEN-anchored scenario feed the live grid simulation; Gemini detects the outage, calls the HiGHS solver, the independent validator and the comparison tool, and the operator approves or rejects the recovery plan.](docs/architecture.png)

| Layer | What it does | Where |
| --- | --- | --- |
| **Operator console** | Isometric map of Chile, outage and recovery states, decision gate, guided tour | [`frontend/`](frontend) |
| **Autonomous agent** | Gemini function-calling loop: reads the evidence, tests candidate plans, explains the trade-off | [`agent/`](agent) |
| **Deterministic core** | HiGHS linear programme for dispatch and no-hindsight outage recovery, plus a validator that shares no code with the solver | [`optimisation/`](optimisation) |
| **Live backend** | FastAPI service with a simulated hourly clock, event streaming, jury QR page and regulatory audit report | [`backend/`](backend) |
| **Data & contracts** | CEN-anchored scenarios with every field tagged observed, derived or synthetic; shared JSON schemas | [`data/`](data), [`contracts/`](contracts) |

The model follows selected rules from Chilean electricity regulation (LGSE, Supreme Decree 32/2026, NTSyCS and Law 21.505). The [design document](docs/hackathon-design.md) maps each rule to the code and states what is and isn't modelled.

## Run it locally

### Frontend demo (Node 20+)

```bash
cd frontend
npm ci
npm run dev                # open the printed URL; /about has project context
npm run verify:portfolio   # check every recorded outage case
npm run build:portfolio    # static build in frontend/dist
```

### Backend, solver and live mode (Python 3.13)

```bash
python3.13 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
python -m pytest -q
python -m uvicorn backend.main:create_app --factory --host 127.0.0.1 --port 8000
```

Open the API docs at <http://127.0.0.1:8000/docs>. `python scripts/smoke.py` runs two complete investigations over HTTP. `python scripts/smoke.py --mode deterministic` runs the workflow on the real solver without calling Gemini.

To connect the frontend to the backend and Gemini, build it with `npm run build:live` and follow the [release runbook](docs/release-runbook.md). The Gemini key lives only in backend environment variables; copy [`.env.example`](.env.example) to get started.

## Repository layout

```text
Andes/
├── frontend/       React + TypeScript control room and the API-free demo
├── agent/          Gemini orchestration and regulatory tools
├── optimisation/   HiGHS dispatch, sudden-outage solver, independent validator
├── backend/        FastAPI live service, event stream and audit reports
├── data/           CEN historical data and provenance
├── contracts/      Shared JSON schemas and typed clients
├── scripts/        Smoke tests, data preparation and report helpers
├── tests/          Backend and integration test suite
└── docs/           Design document, contracts, verification and runbooks
```

## Further reading

- [Hackathon design document](docs/hackathon-design.md): the problem, the regulatory map and the integration contract
- [Optimisation guide](optimisation/README.md): how the solver and validator work
- [Backend operations](backend/README.md) and [the live contract](docs/contracts-v2.md)
- [Verification](docs/verification.md) and [research notes](docs/task-4-research.md)

## Team

Built in 24 hours by a team of four:

- [Alejandro Treny](https://github.com/aleetreny)
- [Alonso Quezada](https://github.com/alonsoquezadar)
- Bernardo Guterres
- Matteo Zabban

## Disclaimer

Andes is a simulation. It does not control Chile's physical grid, send SCADA commands or reproduce the full national network. The five-zone model is a reduced representation, and homes shown as reconnected are model equivalents, not measured reconnections.
