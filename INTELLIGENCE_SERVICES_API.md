# Warborn Cortex — Phase 6: Intelligence Services Platform API
## Architecture & OpenAPI Endpoints Documentation

The Warborn Cortex Intelligence Services Platform encapsulates backend AI workflows, making them 100% independent of client UI presentation layers. It serves as a unified services hub accessible by CLI tools, VS Code extensions, web apps, and mobile applications.

---

## 1. Modular Services Architecture

The platform is designed around 12 distinct functional engines that compose the unified intelligence runtime:

```
                      [ CONSUMERS ]
        (CLI, VS Code, Browser Extension, Web UI, SDKs)
                              │
                              ▼
                 ┌─────────────────────────┐
                 │    API PLATFORM (L1)    │
                 │   OpenAPI / REST First  │
                 └─────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐
   │ DOCUMENT INTELLIGENCE │     │    KNOWLEDGE RAG      │
   │ Pipeline Processing   │     │ Hybrid Vector Search  │
   └───────────────────────┘     └───────────────────────┘
               │                             │
               ├─────────────────────────────┤
               ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐
   │ HIERARCHICAL MEMORY   │     │    DEEP RESEARCH      │
   │ Working/LongTerm/Pins │     │  Evidence Collection  │
   └───────────────────────┘     └───────────────────────┘
               │                             │
               ├─────────────────────────────┤
               ▼                             ▼
   ┌───────────────────────┐     ┌───────────────────────┐
   │    AGENT REGISTRY     │     │    ARTIFACT ENGINE    │
   │ Reusable Tool Defs    │     │ Dynamic Lineage Docs  │
   └───────────────────────┘     └───────────────────────┘
               │                             │
               └──────────────┬──────────────┘
                              ▼
                 ┌─────────────────────────┐
                 │   PROVIDER ROUTER V2    │
                 │ Adaptive Model Selection│
                 └─────────────────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ OBSERVABILITY & AUDIT   │
                 │ Telemetry / RBAC Vault  │
                 └─────────────────────────┘
```

---

## 2. API Endpoints Reference

### 2.1. Document Intelligence Pipeline (Module 1)
Uploads, sanitizes, virus scans, chunks, and indexes files into vector structures.

* **Endpoint**: `POST /api/v1/intelligence/documents`
* **Headers**:
  * `Content-Type: application/json`
  * `x-user-role: developer`
* **Body**:
  ```json
  {
    "name": "production_security_guidelines.md",
    "content": "# Production Guidelines\nEnforce TLS 1.3 across all public endpoints...",
    "format": "markdown",
    "project": "cortex-node-1"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "doc_92fd1b2",
      "name": "production_security_guidelines.md",
      "size": 72,
      "format": "markdown",
      "status": "ready",
      "metadata": {
        "title": "production_security_guidelines",
        "author": "system",
        "project": "cortex-node-1",
        "checksum": "SHA256:7B8F12A",
        "language": "en"
      },
      "chunks": [
        {
          "id": "doc_92fd1b2_chunk_0",
          "text": "Enforce TLS 1.3 across all public endpoints...",
          "index": 0
        }
      ]
    },
    "latencyMs": 14
  }
  ```

---

### 2.2. Hybrid Knowledge Search (Module 2)
Blends keyword lookup (BM25 simulation) with vector similarity searches across custom workspace boundaries.

* **Endpoint**: `POST /api/v1/intelligence/knowledge/retrieve`
* **Body**:
  ```json
  {
    "query": "What are the security TLS requirements?",
    "filters": {
      "project": "cortex-node-1",
      "limit": 3
    }
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "result": {
      "text": "[Source: production_security_guidelines.md] Enforce TLS 1.3 across all public endpoints...",
      "sources": [
        { "id": "doc_92fd1b2", "name": "production_security_guidelines.md", "chunkIndex": 0, "relevance": 0.85 }
      ],
      "confidence": 0.91,
      "relevanceScore": 0.85,
      "retrievalLatencyMs": 4
    }
  }
  ```

---

### 2.3. Hierarchical Memory Store (Module 3)
Tracks episodic, semantic, working, organization, and long-term memories with priority scoring and verification queues.

* **Endpoint**: `POST /api/v1/intelligence/memory`
* **Body**:
  ```json
  {
    "type": "long_term",
    "content": "API Platform should leverage secure authorization tokens in all internal tunnels.",
    "importance": 9,
    "owner": "admin"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "memory": {
      "id": "mem_27c8a",
      "type": "long_term",
      "content": "API Platform should leverage secure authorization tokens in all internal tunnels.",
      "importance": 9,
      "owner": "admin"
    }
  }
  ```

*Note: Memories with `importance >= 9` are routed to the Admin Verification Queue and can be approved using `POST /api/v1/intelligence/memory/approval/:id`.*

---

### 2.4. Cortex Deep Research (Module 4)
Orchestrates multi-turn planning, contradictions comparison, and timeline construction to yield comprehensive evidence reports.

* **Endpoint**: `POST /api/v1/intelligence/research/initiate`
* **Body**:
  ```json
  {
    "topic": "Microservice isolation vs Shared kernels"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "session": {
      "id": "res_82dbf9",
      "topic": "Microservice isolation vs Shared kernels",
      "status": "completed",
      "findings": [
        "Semantic caches are 82% faster in clustered deployments.",
        "Zero-trust sandbox execution decreases risk index profile by 4x."
      ],
      "contradictions": [
        "Notice: Legacy report claims local caches perform better, contradicting centralized cloud retrieval architectures."
      ],
      "executiveSummary": "Deep Research successfully accomplished..."
    }
  }
  ```

---

### 2.5. Intelligent Provider Routing V2 (Module 7)
Dynamic, latency-aware fallback routing across Claude, Gemini, and OpenAI backends.

* **Endpoint**: `POST /api/v1/intelligence/providers/route`
* **Body**:
  ```json
  {
    "taskType": "coding",
    "costConstraint": "any"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "decision": {
      "provider": "claude",
      "model": "claude-3-7-sonnet",
      "reasoning": "Routed to Claude Sonnet due to highly strict code schema complexity constraints."
    }
  }
  ```

---

### 2.6. Platform Observability Summary (Module 8)
Fetches aggregated, structured telemetry metrics across all sub-systems.

* **Endpoint**: `GET /api/v1/intelligence/observability/metrics`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "metrics": {
      "PlatformBootLatency": { "avg": 124, "count": 1, "sum": 124 },
      "DocumentProcessed": { "avg": 1, "count": 2, "sum": 2 },
      "KnowledgeRetrievalLatency": { "avg": 4, "count": 5, "sum": 20 }
    }
  }
  ```

---

## 3. OpenAPI 3.0 Manifest Generation
The platform includes self-generating documentation capability for automated developer onboarding:
* **Endpoint**: `GET /api/v1/intelligence/openapi`
* Returns complete, strict OpenAPI 3.0 schemas for native client code-generation.
