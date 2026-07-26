# 🧠 Warborn Cortex — Multi-Agent Swarm Orchestration Engine

**Status**: Active Flagship Product Repository  
**Ecosystem**: Warborn Technologies AI Operating System (Warborn OS)  
**Deployment**: Vercel Ready | Docker Compatible (`ghcr.io/warborn/cortex`)

---

## 🌐 Overview

**Warborn Cortex** (`warborn-cortex`) is the central intelligence, context routing, and agent orchestration server for the Warborn AI Operating System. It provides a real-time visual workspace, agent state machine execution, DAG mission scheduling, vector memory graph retrieval, and multi-provider AI model routing.

---

## ✨ Key Capabilities

- **Swarm Orchestration**: Coordinates multi-agent persona pools, peer consensus voting, and DAG task breakdown.
- **Dynamic Model Failover**: Integrates seamlessly with multi-provider LLM routers (AWS Bedrock, OpenAI, Anthropic, Gemini, Ollama).
- **Hybrid Memory Engine**: 4-tier memory architecture (Working, Episodic, Semantic Vector HNSW, & Knowledge Graph).
- **Vercel & Cloud Native**: Optimized for 1-click Vercel deployments and containerized Docker production clusters.

---

## 🚀 Quickstart & Local Execution

### Prerequisites:
- **Node.js**: `v20.0.0` or higher (Node 24 recommended)
- **npm**: `v10.0.0` or higher

### Installation:
```bash
# Clone the repository
git clone https://github.com/Warbornai/warborn-cortex.git
cd warborn-cortex

# Install dependencies (100% self-contained)
npm install
```

### Development Mode:
```bash
# Start Vite UI & Express server on http://localhost:3001
npm run dev
```

### Production Build:
```bash
# Build static frontend & bundled Node.js server entrypoint
npm run build

# Start production server
npm start
```

---

## 🛠️ Vercel Deployment

Deploying **Warborn Cortex** to Vercel requires zero complex setup:

1. Import `Warbornai/warborn-cortex` into your **Vercel Dashboard**.
2. Select Framework Preset: **Vite**.
3. Click **Deploy**.

---

## 📄 License & Governance

Licensed under the [MIT License](LICENSE).  
Maintained by the **Warborn Technologies Architecture Team** per [ADR-001](https://github.com/Warbornai/warborn-core/blob/main/docs/adr/ADR-001-repository-strategy.md).
