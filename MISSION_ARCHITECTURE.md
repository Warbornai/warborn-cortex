# Warborn Cortex — Phase 5: Mission Operating System
## Technical Architecture & Specifications

This document defines the core architecture, scheduling state machines, and API layers of the Warborn Cortex Mission Engine. It is the central orchestration layer for all long-running autonomous workflows.

---

## 1. Core Architecture Overview

The Mission Operating System runs as a deterministic, event-driven subsystem within the Cortex Node Kernel. It governs the scheduling, dependency routing, agent assignment, and execution of complex, nested, or parallel task structures.

```
       [ Event Triggers ] ── (Timers, Cron, Webhooks, Git PRs, Uploads)
               │
               ▼
   ┌────────────────────────────────────────────────────────┐
   │                  MISSION CONSOLE KERNEL                │
   │                                                        │
   │   ┌────────────────────┐      ┌────────────────────┐   │
   │   │  Mission Registry  │ ──── │   Priority Queue   │   │
   │   └────────────────────┘      └────────────────────┘   │
   │             │                           │              │
   │             ▼                           ▼              │
   │   ┌────────────────────┐      ┌────────────────────┐   │
   │   │  Workflow Engine   │ ──── │ Concurrency Sched  │   │
   │   └────────────────────┘      └────────────────────┘   │
   │             │                           │              │
   │             ▼                           ▼              │
   │   ┌────────────────────────────────────────────────┐   │
   │   │             Multi-Agent Sandbox               │   │
   │   └────────────────────────────────────────────────┘   │
   └────────────────────────────────────────────────────────┘
               │
               ▼
      [ Artifact Vault ] ── (Schemas, Risk Briefs, Code Repos)
```

---

## 2. Deterministic State Machine

Every autonomous mission transitions through the following system states:

| State | Description | Next Allowed States |
|---|---|---|
| `draft` | Core mission specification being defined. | `queued` |
| `queued` | Awaiting core scheduler prioritization. | `running`, `paused` |
| `scheduled` | Reserved for future execution (cron/timers). | `running` |
| `planning` | Decomposing objective into a workflow node graph. | `running`, `failed` |
| `running` | Actively processing workflow steps inside sandbox. | `waiting`, `paused`, `completed`, `failed` |
| `waiting` | Thread asleep awaiting standard API responses. | `running`, `failed` |
| `approval_required` | Blocked awaiting human operator signature. | `running`, `failed`, `recovering` |
| `retrying` | Step failure detected. Running exponential backoff. | `running`, `failed` |
| `recovering` | Self-healing rollback routine active. | `running`, `failed` |
| `completed` | Pipeline executed successfully. Signatures recorded. | `archived` |
| `failed` | Fatal anomaly detected. Resources purged. | `archived` |
| `cancelled` | Manually aborted by developer console. | `archived` |
| `archived` | Artifacts serialized and committed to L2 cache. | None |

---

## 3. Workflow Engine & Execution Topology

The Workflow Engine compiles plain-text goal definitions into directed acyclic graphs (DAGs) representing sequential and parallel step hierarchies:

* **Sequential Chains**: Steps executed in locked order. Failure in any step raises immediate rollback/retry loops.
* **Parallel Splits**: Non-blocking branches executed concurrently by separate agent sandboxes (e.g., parallel security code-analysis and schema generation).
* **Loops / Checkpoints**: Tracks iterations for tasks that require convergence checks (e.g., healing verification loops).
* **Sub-Missions**: Nested workflow execution contexts.

---

## 4. Scheduling Policies & Rate Throttles

The core Scheduler implements:
1. **Priority Scheduling**: Low, Medium, High, and Critical. High-priority triggers automatically preempt L2 CPU allocations.
2. **Concurrency Limits**: Hard cap of 10 concurrent active sandboxes. Surplus missions are placed in the FIFO prioritized registry.
3. **Backoff Strategies**: Exponential backoff with jitter on node execution failure:
   $$t_{sleep} = \min(t_{max}, t_{base} \cdot 2^{attempt}) + \text{random\_jitter}$$

---

## 5. API Platform References

### `POST /api/v1/missions`
Deploys a new autonomous workflow.
* **Body**:
  ```json
  {
    "name": "Audit Production Cluster",
    "priority": "high",
    "template": "security_audit",
    "triggers": [{"type": "cron", "value": "0 0 * * *"}]
  }
  ```

### `POST /api/v1/missions/:id/approve`
Grants HITL signature to bypass a waiting node.
* **Body**:
  ```json
  {
    "signature": "SIG_ARCHITECT_90F1",
    "action": "approve"
  }
  ```

---

## 6. Disaster Recovery Procedures

### Anomaly: Heap Memory Exhaustion during 1,000 Concurrent Jobs
1. **Self-Healing Hook**: The scheduler immediately halts low-priority tasks.
2. **State Transition**: Enrolled jobs are serialized to the `paused` cache state.
3. **Flush Cycle**: System triggers a flush on the L1 semantic vector space.
4. **Resumption**: Re-queues suspended tasks in order of critical priority.
