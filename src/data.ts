import { Project, Memory, KnowledgeDoc, Agent, Tool, Workflow, MCPConnector, LogEntry } from './types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_omega',
    name: 'Warborn OS Engine',
    description: 'Central system engine powering the core OS nodes and hypervisors.',
    createdAt: '2026-07-10T14:32:00.000Z',
    status: 'active',
    customInstruction: 'You are the primary kernel developer advisor for Warborn OS. Emphasize low-latency, lock-free structures.',
    model: 'gemini-3.1-pro-preview',
    temperature: 0.2,
  },
  {
    id: 'proj_crm',
    name: 'Warborn CRM Gateway',
    description: 'Intelligent customer relation and voice-interaction router.',
    createdAt: '2026-07-14T09:15:00.000Z',
    status: 'active',
    customInstruction: 'Focus on polite, conversational feedback. Synthesize clear bullet-point action summaries for customers.',
    model: 'gemini-3.5-flash',
    temperature: 0.7,
  },
  {
    id: 'proj_voice',
    name: 'Warborn Voice Synthesizer',
    description: 'Ultra-low latency audio speech translation and speech-to-text pipeline.',
    createdAt: '2026-07-16T18:45:00.000Z',
    status: 'active',
    customInstruction: 'Analyze spoken emotional cues. Provide responses formatted to trigger proper acoustic speech markers.',
    model: 'gemini-3.5-flash',
    temperature: 0.5,
  }
];

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem_1',
    content: 'User prefers dark theme by default, but requested light theme compliance for audits.',
    type: 'episodic',
    timestamp: '2026-07-17T08:12:00.000Z',
    associatedKeywords: ['theme', 'ui-preferences', 'audit']
  },
  {
    id: 'mem_2',
    content: 'All server-side Gemini requests must include User-Agent: aistudio-build telemetry header.',
    type: 'procedural',
    timestamp: '2026-07-17T11:45:00.000Z',
    associatedKeywords: ['telemetry', 'headers', 'gemini-api']
  },
  {
    id: 'mem_3',
    content: 'Warborn OS kernel interfaces with Cortex through custom socket buffers on port 9091.',
    type: 'semantic',
    timestamp: '2026-07-18T01:30:00.000Z',
    associatedKeywords: ['kernel', 'network', 'socket-interface']
  },
  {
    id: 'mem_4',
    content: 'Dynamic Router selects Flash for low-complexity text summaries; upgrades to Pro for token optimization analysis.',
    type: 'procedural',
    timestamp: '2026-07-18T05:22:00.000Z',
    associatedKeywords: ['provider-router', 'routing', 'token-optimization']
  }
];

export const INITIAL_KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc_1',
    name: 'warborn_architecture_specs.md',
    content: 'This document details the micro-kernel architecture of Warborn OS. Standard communications route via low-overhead RPC protocols. Memory is pre-allocated on boot up, utilizing custom slab memory pools. Cortex manages the orchestration layer by routing model calls across dynamic network endpoints.',
    size: 4520,
    embedStatus: 'completed',
    vectorCoords: [0.25, 0.68],
  },
  {
    id: 'doc_2',
    name: 'security_governance_v2.txt',
    content: 'Security governance protocol for Cortex integrations. All API keys are securely vaulted. Access to memory cells requires least-privilege token validation. Memory logs are serialized and encrypted at rest using AES-GCM-256 keys rotated bi-weekly.',
    size: 2840,
    embedStatus: 'completed',
    vectorCoords: [-0.45, 0.35],
  },
  {
    id: 'doc_3',
    name: 'mcp_integration_guide.json',
    content: 'Model Context Protocol specification rules. Hosts expose resources, templates, and tools. Connections must be verified via dual-handshake handshake signatures. Supports dynamic registration of custom database schemas, providing schema tables as structural prompts.',
    size: 8900,
    embedStatus: 'completed',
    vectorCoords: [0.12, -0.72],
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_core',
    name: 'Cortex Overlord',
    description: 'The master reasoning entity orchestrating downstream specialized sub-agents.',
    role: 'Central Dispatch & Planning',
    icon: 'Cpu',
    model: 'gemini-3.1-pro-preview',
    tools: ['googleSearch', 'webScraper', 'vectorSearch'],
    status: 'idle',
  },
  {
    id: 'agent_sec',
    name: 'Sentinel Node',
    description: 'Validates prompt inputs and system instructions against safety directives.',
    role: 'Prompt Defense & Auditing',
    icon: 'Shield',
    model: 'gemini-3.5-flash',
    tools: ['safetyGuard'],
    status: 'idle',
  },
  {
    id: 'agent_coder',
    name: 'Synthesizer Code Node',
    description: 'Generates kernel routines and TypeScript files mapped to specification rules.',
    role: 'Low-level Code Gen & Refactor',
    icon: 'Code2',
    model: 'gemini-3.1-pro-preview',
    tools: ['filesystemAccess'],
    status: 'idle',
  }
];

export const INITIAL_TOOLS: Tool[] = [
  {
    id: 'tool_search',
    name: 'googleSearch',
    description: 'Grounds model requests in real-time global news and internet documents.',
    isActive: true,
    parameters: 'query: string',
    returns: 'groundingMetadata: { chunks: Array }',
  },
  {
    id: 'tool_scraper',
    name: 'webScraper',
    description: 'Fetches raw HTML/Markdown content from standard public web addresses safely.',
    isActive: true,
    parameters: 'url: string',
    returns: 'htmlBody: string, extractedText: string',
  },
  {
    id: 'tool_vectors',
    name: 'vectorSearch',
    description: 'Queries knowledge bases using high-dimension cosine similarity search.',
    isActive: true,
    parameters: 'query: string, limit?: number',
    returns: 'matchedSegments: Array<{ docId: string, score: number, text: string }>',
  }
];

export const INITIAL_WORKFLOWS: Workflow[] = [
  {
    id: 'wf_audit',
    name: 'Autonomous Code & Memory Security Audit',
    description: 'Loads all active repository files, queries the Vector Engine for safety specs, runs Sentinel agent verification, and formats a report.',
    status: 'idle',
    steps: [
      { id: 'aud_1', name: 'Retrieve Safety Specs', action: 'Vector search for security directives', status: 'pending' },
      { id: 'aud_2', name: 'Synthesizer Prompt Auditing', action: 'Sentinel checks system prompt leakage risk', status: 'pending' },
      { id: 'aud_3', name: 'Refactor Implementation', action: 'Code agent fixes buffer anomalies', status: 'pending' },
      { id: 'aud_4', name: 'Synthesize Report', action: 'Generate final compliance brief', status: 'pending' },
    ]
  },
  {
    id: 'wf_intel',
    name: 'Cortex Market & Trend Analysis',
    description: 'Performs grounding search on target technology, gathers competitive metrics, compiles memory alignment logs, and logs context.',
    status: 'idle',
    steps: [
      { id: 'int_1', name: 'Ground Search', action: 'Trigger search grounding for "Warborn technology trends"', status: 'pending' },
      { id: 'int_2', name: 'Synthesize Metrics', action: 'Compile competitive landscape document', status: 'pending' },
      { id: 'int_3', name: 'Memory Compression', action: 'Commit research findings to semantic memory storage', status: 'pending' },
    ]
  }
];

export const INITIAL_MCP_CONNECTORS: MCPConnector[] = [
  {
    id: 'mcp_fs',
    name: 'Local Filesystem Connector',
    url: 'file:///workspace/src',
    status: 'connected',
    capabilities: ['resources', 'tools'],
    methods: ['list_files', 'read_file', 'write_file', 'search_grep'],
  },
  {
    id: 'mcp_pg',
    name: 'PostgreSQL Vector Vault',
    url: 'postgresql://db.warborn.internal:5432',
    status: 'connected',
    capabilities: ['resources', 'prompts'],
    methods: ['query_embeddings', 'fetch_schema', 'backup_memory'],
  },
  {
    id: 'mcp_git',
    name: 'GitHub Repository Bridge',
    url: 'https://github.com/warborn-os',
    status: 'disconnected',
    capabilities: ['resources'],
    methods: ['sync_pull_requests', 'generate_commit_draft'],
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { timestamp: '2026-07-18T06:00:01.002Z', level: 'info', module: 'BOOT', message: 'Warborn Cortex Core Engine initializing...' },
  { timestamp: '2026-07-18T06:00:01.215Z', level: 'info', module: 'MEM', message: 'Loaded 4 persistent memory clusters into L1 cache.' },
  { timestamp: '2026-07-18T06:00:01.350Z', level: 'info', module: 'VEC', message: 'Semantic vector space mapped with 128 dimensions.' },
  { timestamp: '2026-07-18T06:00:01.480Z', level: 'info', module: 'MCP', message: 'Connected 2 Model Context Protocol servers.' },
  { timestamp: '2026-07-18T06:00:01.550Z', level: 'info', module: 'BOOT', message: 'Cortex routing layer activated on port 3000.' },
  { timestamp: '2026-07-18T06:01:22.910Z', level: 'trace', module: 'ROUTER', message: 'Incoming inquiry parsed. Selected Baseline Flash router.' }
];

import { Mission } from './types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission_saas_builder',
    name: 'Build & Deploy Secure SaaS Applet',
    description: 'Decomposes the SaaS specification, provisions database nodes, executes parallel security code verification, requests architectural audit, and deploys verified codebase.',
    state: 'paused',
    priority: 'critical',
    workflow: {
      id: 'wf_saas_builder',
      name: 'Autonomous SaaS Development Lifecycle',
      version: 'v2.1.0',
      nodes: [
        { id: 'node_1', label: 'Decompose Spec & Plan Goals', type: 'sequential', status: 'completed', assignedAgent: 'Sentinel Agent', duration: 1200 },
        { id: 'node_2', label: 'Provision Database Nodes', type: 'sequential', status: 'completed', assignedAgent: 'Operator Agent', duration: 800 },
        { id: 'node_3', label: 'Execute Code Generation', type: 'parallel', status: 'running', assignedAgent: 'Code Agent', duration: 3400 },
        { id: 'node_4', label: 'Run Automated Security Verification', type: 'parallel', status: 'pending', assignedAgent: 'Sentinel Agent' },
        { id: 'node_5', label: 'Manual Human-in-the-Loop Sign-off', type: 'conditional', status: 'waiting', assignedAgent: 'Architect Agent' },
        { id: 'node_6', label: 'Perform Edge Sandbox Deployment', type: 'sub-mission', status: 'pending', assignedAgent: 'Operator Agent' },
      ],
      edges: [
        { from: 'node_1', to: 'node_2' },
        { from: 'node_2', to: 'node_3' },
        { from: 'node_2', to: 'node_4' },
        { from: 'node_3', to: 'node_5' },
        { from: 'node_4', to: 'node_5' },
        { from: 'node_5', to: 'node_6' },
      ],
    },
    triggers: [
      { id: 'trig_saas_git', type: 'git', value: 'git-push:main', isActive: true },
      { id: 'trig_saas_cron', type: 'cron', value: '0 9 * * 1-5', isActive: false },
    ],
    approvals: [
      {
        id: 'app_saas_architect',
        stepId: 'node_5',
        stepName: 'Manual Human-in-the-Loop Sign-off',
        status: 'pending',
        requestedAt: '2026-07-18T06:50:00Z',
        comments: 'Pending validation of database schema constraints and vector cluster connections.',
      }
    ],
    artifacts: [
      {
        id: 'art_schema_sql',
        name: 'Database Schema Blueprint',
        type: 'config',
        size: '12.4 KB',
        hash: 'SHA256:0F4A7C93...',
        lineage: ['node_2'],
        createdAt: '2026-07-18T06:45:12Z',
        content: `CREATE TABLE IF NOT EXISTS users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  role VARCHAR(50) DEFAULT 'user',\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE IF NOT EXISTS api_keys (\n  id UUID PRIMARY KEY,\n  user_id UUID REFERENCES users(id) ON DELETE CASCADE,\n  hashed_key VARCHAR(255) NOT NULL,\n  is_active BOOLEAN DEFAULT true\n);`
      },
      {
        id: 'art_architecture_pdf',
        name: 'Comprehensive Architecture Specification',
        type: 'pdf',
        size: '2.8 MB',
        hash: 'SHA256:D782F11A...',
        lineage: ['node_1'],
        createdAt: '2026-07-18T06:30:45Z',
      }
    ],
    progress: 45,
    currentStepIndex: 2,
    tokensUsed: 425000,
    cost: 1.275,
    latency: 18500,
    retries: 0,
    createdAt: '2026-07-18T06:15:00Z',
    updatedAt: '2026-07-18T06:50:00Z',
    logs: [
      'Mission received from workspace event queue.',
      'Validation succeeded: Spec conforms to enterprise schema layout guidelines.',
      'Task decomposition complete: Generated 6 executable workflow nodes.',
      'Resource check: code execution sandbox healthy. Allocated Sentinel & Operator cells.',
      'Executing Step 1: Decompose Spec & Plan Goals. (Status: COMPLETED, Duration: 1200ms)',
      'Executing Step 2: Provision Database Nodes. (Status: COMPLETED, Duration: 800ms)',
      'Executing Step 3: Execute Code Generation. (Status: RUNNING)',
      'Awaiting manual architectural sign-off on approval checkpoint node_5.',
    ]
  },
  {
    id: 'mission_competitor_radar',
    name: 'Competitor Intellishield Radar',
    description: 'Polls market research indexes, analyzes competitor patents via search grounding, processes contract clauses, and commits updates to semantic L2 memory cache.',
    state: 'scheduled',
    priority: 'high',
    workflow: {
      id: 'wf_competitor_radar',
      name: 'Intellishield Research Pipeline',
      version: 'v1.4.2',
      nodes: [
        { id: 'rad_1', label: 'Ground Search Competitor Sites', type: 'sequential', status: 'pending', assignedAgent: 'Research Agent' },
        { id: 'rad_2', label: 'Extract Threat Matrix Metrics', type: 'sequential', status: 'pending', assignedAgent: 'Sentinel Agent' },
        { id: 'rad_3', label: 'Analyze Contract Clauses', type: 'sequential', status: 'pending', assignedAgent: 'Code Agent' },
        { id: 'rad_4', label: 'Sync to L2 Semantic Memory', type: 'sequential', status: 'pending', assignedAgent: 'Operator Agent' },
      ],
      edges: [
        { from: 'rad_1', to: 'rad_2' },
        { from: 'rad_2', to: 'rad_3' },
        { from: 'rad_3', to: 'rad_4' },
      ]
    },
    triggers: [
      { id: 'trig_rad_cron', type: 'cron', value: '0 8 * * *', isActive: true },
    ],
    approvals: [],
    artifacts: [],
    progress: 0,
    currentStepIndex: 0,
    tokensUsed: 0,
    cost: 0,
    latency: 0,
    retries: 0,
    createdAt: '2026-07-18T07:00:00Z',
    updatedAt: '2026-07-18T07:00:00Z',
    logs: [
      'Mission created via Daily Scheduler.',
      'Scheduled to run at 2026-07-19T08:00:00Z.',
    ]
  },
  {
    id: 'mission_infra_monitor',
    name: 'Infrastructure Health & Self-Healing',
    description: 'Monitors endpoint responses, analyzes log anomalies, conducts rollback loops if memory threshold is violated, and emits compliance summary report.',
    state: 'running',
    priority: 'critical',
    workflow: {
      id: 'wf_infra_monitor',
      name: 'Sentinel Auto-Healing Workflow',
      version: 'v3.0.1',
      nodes: [
        { id: 'inf_1', label: 'Poll REST API Endpoints', type: 'sequential', status: 'completed', assignedAgent: 'Operator Agent', duration: 450 },
        { id: 'inf_2', label: 'Log Cluster Anomaly Analysis', type: 'sequential', status: 'completed', assignedAgent: 'Sentinel Agent', duration: 1100 },
        { id: 'inf_3', label: 'Self-Healing Checkpoint Rollback', type: 'loop', status: 'running', assignedAgent: 'Operator Agent', loopCount: 2, maxLoops: 5, duration: 2100 },
        { id: 'inf_4', label: 'Generate Compliance Brief', type: 'sequential', status: 'pending', assignedAgent: 'Sentinel Agent' },
      ],
      edges: [
        { from: 'inf_1', to: 'inf_2' },
        { from: 'inf_2', to: 'inf_3' },
        { from: 'inf_3', to: 'inf_4' },
      ],
    },
    triggers: [
      { id: 'trig_infra_timer', type: 'timer', value: 'every 5m', isActive: true },
      { id: 'trig_infra_webhook', type: 'webhook', value: '/webhooks/infra-alert', isActive: true },
    ],
    approvals: [],
    artifacts: [
      {
        id: 'art_infra_brief',
        name: 'Autonomic Self-Healing Audit Logs',
        type: 'report',
        size: '142 KB',
        hash: 'SHA256:B2239BCE...',
        lineage: ['inf_2'],
        createdAt: '2026-07-18T06:58:30Z',
        content: `Cortex Health Monitor: cluster_primary\n[OK] REST Gateway responsive. (RTT: 42ms)\n[WARN] L1 memory allocation spike detected (84.1% utilization).\n[HEAL] Initated self-healing recovery routine: cluster_flush.\n[OK] Flush cycle complete. Current allocation: 51.2%`
      }
    ],
    progress: 75,
    currentStepIndex: 2,
    tokensUsed: 120500,
    cost: 0.3615,
    latency: 3650,
    retries: 1,
    createdAt: '2026-07-18T06:55:00Z',
    updatedAt: '2026-07-18T06:58:30Z',
    logs: [
      'Mission triggered by infrastructure heartbeat alert.',
      'Analyzing cluster response logs...',
      'Anomaly detected: Heap memory footprint exceeding SLA. Raising healing ticket.',
      'Executing Step 3: Checkpoint Self-Healing Rollback. Iteration 1 of 5. Rollback succeeded.',
      'Iteration 2 of 5 starting: verifying cluster health post-flush.',
    ]
  }
];

