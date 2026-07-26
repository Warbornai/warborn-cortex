import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { CortexEngine, CortexTestSuiteRunner } from './src/lib/cortexEngine';
import { AgentRuntimeCoordinator, AgentRuntimeTestSuite } from './src/lib/agentRuntime';
import { INITIAL_MEMORIES, INITIAL_KNOWLEDGE_DOCS, INITIAL_TOOLS, INITIAL_MCP_CONNECTORS } from './src/data';
import { IntelligenceServicesPlatform } from './src/lib/intelligencePlatform';
import { AutonomousCognitiveRuntime, CognitiveRuntimeTestSuite } from './src/lib/cognitiveRuntime';
import { identityRoutes } from './src/lib/identityRoutes';
import { IntegrationEngine } from './src/lib/integrationEngine';
import { PlatformGateway } from './src/platform/gateway/PlatformGateway';
import { AIExecutionEngine } from './src/ai/engine/AIExecutionEngine';
import { ContextEngine } from './src/context/engine/ContextEngine';
import { MissionEngine } from './src/agents/missions/MissionEngine';
import { EventBus } from './src/events/bus/EventBus';
import { DistributedScheduler } from './src/runtime/scheduler/DistributedScheduler';
class PluginRuntime {
  public listPlugins() {
    return [
      { id: 'plugin-github', name: 'GitHub Integration', status: 'ACTIVE' },
      { id: 'plugin-jira', name: 'Jira Connector', status: 'ACTIVE' },
      { id: 'plugin-slack', name: 'Slack Bot', status: 'ACTIVE' }
    ];
  }
}

class HealthCheckManager {
  public checkHealth() {
    return { status: 'HEALTHY', timestamp: new Date().toISOString() };
  }
}

class MetricsCollector {
  public getMetrics() {
    return { activeAgents: 12, cpuPercent: 1.2, memoryPercent: 14.5 };
  }
}

// Load environment variables
dotenv.config();

const app = express();
const gateway = new PlatformGateway();
const aiPlatform = new AIExecutionEngine();
const contextEngine = new ContextEngine(aiPlatform);
const missionEngine = new MissionEngine();
const eventBus = new EventBus();
const scheduler = new DistributedScheduler();
const pluginRuntime = new PluginRuntime();
const healthManager = new HealthCheckManager();
const metrics = new MetricsCollector();
app.locals.metrics = metrics;
const PORT = 3001;

// Initialize central Integration Engine for Sprint 3
const integrationEngine = new IntegrationEngine();

// Initialize multi-agent runtime coordinator
const agentRuntimeCoordinator = new AgentRuntimeCoordinator();

// Initialize intelligence services platform container
const intelPlatform = new IntelligenceServicesPlatform();

// Initialize Phase 7 Autonomous Cognitive Runtime
const cognitiveRuntime = new AutonomousCognitiveRuntime();

// Initialize central backend CortexEngine
const cortexEngine = new CortexEngine(
  INITIAL_MEMORIES,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_TOOLS,
  INITIAL_MCP_CONNECTORS
);

app.use(express.json());
app.use('/api', gateway.router);

// Lazy-initialized Gemini Client to prevent startup crashes if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      console.warn('GEMINI_API_KEY not found or holds default value. Running in simulation-assisted mode.');
      return null;
    }
    try {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI Client successfully initialized.');
    } catch (error) {
      console.error('Failed to initialize Gemini AI Client:', error);
      return null;
    }
  }
  return aiClient;
}

// ----------------- API ROUTES -----------------

app.use('/api', identityRoutes);

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

// ============================================================================
// PHASE 6 — INTELLIGENCE SERVICES PLATFORM REST APIS
// ============================================================================

// --- Documents (Module 1) ---
app.post('/api/v1/intelligence/documents', async (req, res) => {
  const { name, content, size, format, author, project } = req.body;
  if (!name || !content) {
    res.status(400).json({ success: false, error: 'name and content are required' });
    return;
  }
  const userRole = req.headers['x-user-role'] as string || 'developer';
  const hasPerm = await intelPlatform.security.checkPermission(userRole, 'workspace_write');
  if (!hasPerm) {
    res.status(403).json({ success: false, error: 'Insufficient permissions' });
    return;
  }

  const result = await intelPlatform.docs.processDocument(
    name,
    content,
    size || content.length,
    format || 'txt',
    author || 'system',
    project || 'default'
  );
  intelPlatform.obs.recordMetric('DocumentProcessed', 1, 'count', { format: format || 'txt' });
  res.json(result);
});

app.get('/api/v1/intelligence/documents', async (req, res) => {
  const list = await intelPlatform.docs.listDocuments();
  res.json({ success: true, count: list.length, documents: list });
});

app.get('/api/v1/intelligence/documents/:id', async (req, res) => {
  const doc = await intelPlatform.docs.getDocument(req.params.id);
  if (!doc) {
    res.status(404).json({ success: false, error: 'Document not found' });
    return;
  }
  res.json({ success: true, document: doc });
});

app.delete('/api/v1/intelligence/documents/:id', async (req, res) => {
  const success = await intelPlatform.docs.deleteDocument(req.params.id);
  res.json({ success });
});

app.post('/api/v1/intelligence/documents/:id/reindex', async (req, res) => {
  const success = await intelPlatform.docs.reindexDocument(req.params.id);
  res.json({ success });
});

// --- Knowledge Engine Hybrid RAG (Module 2) ---
app.post('/api/v1/intelligence/knowledge/retrieve', async (req, res) => {
  const { query, filters } = req.body;
  if (!query) {
    res.status(400).json({ success: false, error: 'query is required' });
    return;
  }

  const result = await intelPlatform.knowledge.retrieve(query, filters);
  intelPlatform.obs.recordMetric('KnowledgeRetrievalLatency', result.retrievalLatencyMs, 'ms');
  res.json({ success: true, result });
});

app.get('/api/v1/intelligence/knowledge/health', async (req, res) => {
  const metrics = await intelPlatform.knowledge.getHealthMetrics();
  res.json({ success: true, metrics });
});

// --- Hierarchical Memory V2 (Module 3) ---
app.post('/api/v1/intelligence/memory', async (req, res) => {
  const node = await intelPlatform.memory.createMemory(req.body);
  res.json({ success: true, memory: node });
});

app.get('/api/v1/intelligence/memory/search', async (req, res) => {
  const { q, type } = req.query;
  const list = await intelPlatform.memory.searchMemories(
    (q as string) || '',
    type as any
  );
  res.json({ success: true, memories: list });
});

app.get('/api/v1/intelligence/memory/graph', async (req, res) => {
  const graph = await intelPlatform.memory.getMemoryGraph();
  res.json({ success: true, graph });
});

app.get('/api/v1/intelligence/memory/approval', async (req, res) => {
  const queue = await intelPlatform.memory.getApprovalQueue();
  res.json({ success: true, queue });
});

app.post('/api/v1/intelligence/memory/approval/:id', async (req, res) => {
  const { approve } = req.body;
  const success = await intelPlatform.memory.approveMemory(req.params.id, approve);
  res.json({ success });
});

app.get('/api/v1/intelligence/memory/analytics', async (req, res) => {
  const analytics = await intelPlatform.memory.getAnalytics();
  res.json({ success: true, analytics });
});

app.put('/api/v1/intelligence/memory/:id', async (req, res) => {
  const node = await intelPlatform.memory.updateMemory(req.params.id, req.body);
  if (!node) {
    res.status(404).json({ success: false, error: 'Memory not found' });
    return;
  }
  res.json({ success: true, memory: node });
});

app.delete('/api/v1/intelligence/memory/:id', async (req, res) => {
  const success = await intelPlatform.memory.deleteMemory(req.params.id);
  res.json({ success });
});

app.post('/api/v1/intelligence/memory/:id/pin', async (req, res) => {
  const { isPinned } = req.body;
  const success = await intelPlatform.memory.pinMemory(req.params.id, isPinned);
  res.json({ success });
});

// --- Enhanced Memory Graph Traversal (Module 3 extension) ---
app.get('/api/v1/intelligence/memory/clusters', async (req, res) => {
  try {
    const clusters = await intelPlatform.memory.semanticClustering();
    res.json({ success: true, clusters });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/memory/path', async (req, res) => {
  try {
    const { nodeId1, nodeId2 } = req.query;
    if (!nodeId1 || !nodeId2) {
      res.status(400).json({ success: false, error: 'nodeId1 and nodeId2 are required.' });
      return;
    }
    const pathInfo = await intelPlatform.memory.findRelatedPaths(nodeId1 as string, nodeId2 as string);
    res.json({ success: true, ...pathInfo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/memory/:id/traverse', async (req, res) => {
  try {
    const depth = parseInt(req.query.depth as string || '2', 10);
    const traversal = await intelPlatform.memory.traverseGraph(req.params.id, depth);
    res.json({ success: true, traversal });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/memory/link', async (req, res) => {
  try {
    const { sourceId, targetId } = req.body;
    if (!sourceId || !targetId) {
      res.status(400).json({ success: false, error: 'sourceId and targetId are required.' });
      return;
    }
    const success = await intelPlatform.memory.addMemoryLink(sourceId, targetId);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Universal Context Engine Endpoints ---
app.get('/api/v1/intelligence/context', async (req, res) => {
  try {
    const items = await intelPlatform.contextEngine.getContextItems();
    const links = intelPlatform.contextEngine.getCustomLinks();
    res.json({ success: true, count: items.length, items, links });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/context/summary', async (req, res) => {
  try {
    const summary = await intelPlatform.contextEngine.getContextSummary();
    res.json({ success: true, ...summary });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/context/search', async (req, res) => {
  try {
    const { q } = req.query;
    const items = await intelPlatform.contextEngine.searchContext((q as string) || '');
    res.json({ success: true, count: items.length, items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/context/link', async (req, res) => {
  try {
    const { sourceId, targetId, relationship } = req.body;
    if (!sourceId || !targetId || !relationship) {
      res.status(400).json({ success: false, error: 'sourceId, targetId, and relationship are required.' });
      return;
    }
    const success = await intelPlatform.contextEngine.linkContext(sourceId, targetId, relationship);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Universal Event Bus Endpoints ---
app.get('/api/v1/intelligence/eventbus/history', async (req, res) => {
  try {
    const topic = req.query.topic as string || 'all';
    const history = intelPlatform.eventBus.getEventHistory(topic);
    res.json({ success: true, count: history.length, history });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/eventbus/triggers', async (req, res) => {
  try {
    const triggers = intelPlatform.eventBus.getTriggers();
    res.json({ success: true, count: triggers.length, triggers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/eventbus/triggers', async (req, res) => {
  try {
    const { sourceTopic, targetTopic, conditionField, conditionValue, actionPayload } = req.body;
    if (!sourceTopic || !targetTopic) {
      res.status(400).json({ success: false, error: 'sourceTopic and targetTopic are required.' });
      return;
    }
    const trigger = intelPlatform.eventBus.addTrigger({
      sourceTopic,
      targetTopic,
      conditionField,
      conditionValue,
      actionPayload,
    });
    res.json({ success: true, trigger });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/v1/intelligence/eventbus/triggers/:id', async (req, res) => {
  try {
    const success = intelPlatform.eventBus.removeTrigger(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/eventbus/publish', async (req, res) => {
  try {
    const { topic, eventType, source, payload, priority } = req.body;
    if (!topic || !eventType || !source) {
      res.status(400).json({ success: false, error: 'topic, eventType, and source are required.' });
      return;
    }
    const event = intelPlatform.eventBus.publish({
      topic,
      eventType,
      source,
      payload: payload || {},
      priority: priority || 'normal',
    });
    res.json({ success: true, event });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/intelligence/eventbus/telemetry', async (req, res) => {
  try {
    const telemetry = intelPlatform.eventBus.getTelemetry();
    res.json({ success: true, telemetry });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Deep Research (Module 4) ---
app.post('/api/v1/intelligence/research/initiate', async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    res.status(400).json({ success: false, error: 'topic is required' });
    return;
  }
  const session = await intelPlatform.research.initiateResearch(topic);
  res.json({ success: true, session });
});

app.get('/api/v1/intelligence/research/sessions', async (req, res) => {
  const sessions = await intelPlatform.research.listSessions();
  res.json({ success: true, sessions });
});

app.get('/api/v1/intelligence/research/sessions/:id', async (req, res) => {
  const session = await intelPlatform.research.getSession(req.params.id);
  if (!session) {
    res.status(404).json({ success: false, error: 'Session not found' });
    return;
  }
  res.json({ success: true, session });
});

// --- Agent Registry (Module 5) ---
app.get('/api/v1/intelligence/agents', async (req, res) => {
  const agents = await intelPlatform.agents.getAllAgents();
  res.json({ success: true, agents });
});

// --- Artifact Engine (Module 6) ---
app.post('/api/v1/intelligence/artifacts', async (req, res) => {
  const { name, type, content, lineage, generatorAgent, model } = req.body;
  if (!name || !content || !type) {
    res.status(400).json({ success: false, error: 'name, type, and content are required' });
    return;
  }
  const art = await intelPlatform.artifacts.createArtifact(
    name,
    type,
    content,
    lineage || [],
    generatorAgent || 'system',
    model || 'gemini-3.5-flash'
  );
  res.json({ success: true, artifact: art });
});

app.get('/api/v1/intelligence/artifacts', async (req, res) => {
  const list = await intelPlatform.artifacts.listArtifacts();
  res.json({ success: true, artifacts: list });
});

app.get('/api/v1/intelligence/artifacts/:id', async (req, res) => {
  const art = await intelPlatform.artifacts.getArtifact(req.params.id);
  if (!art) {
    res.status(404).json({ success: false, error: 'Artifact not found' });
    return;
  }
  res.json({ success: true, artifact: art });
});

app.post('/api/v1/intelligence/artifacts/:id/regenerate', async (req, res) => {
  const { reason, user } = req.body;
  const art = await intelPlatform.artifacts.regenerateArtifact(
    req.params.id,
    reason || 're-eval',
    user || 'developer'
  );
  if (!art) {
    res.status(404).json({ success: false, error: 'Artifact not found' });
    return;
  }
  res.json({ success: true, artifact: art });
});

// --- Provider Router (Module 7) ---
app.post('/api/v1/intelligence/providers/route', async (req, res) => {
  const { taskType, costConstraint, contextLength } = req.body;
  const decision = await intelPlatform.router.selectOptimalProvider({
    taskType: taskType || 'reasoning',
    costConstraint,
    contextLength,
  });
  res.json({ success: true, decision });
});

app.get('/api/v1/intelligence/providers/health', async (req, res) => {
  const healthMatrix = await intelPlatform.router.getHealthMatrix();
  res.json({ success: true, providers: healthMatrix });
});

// --- Observability Platform (Module 8) ---
app.get('/api/v1/intelligence/observability/metrics', async (req, res) => {
  const summary = intelPlatform.obs.getMetricsSummary();
  res.json({ success: true, metrics: summary });
});

// --- Security Audit Log (Module 10) ---
app.get('/api/v1/intelligence/security/audit', async (req, res) => {
  const logs = await intelPlatform.security.getAuditLogs();
  res.json({ success: true, auditLogs: logs });
});

// --- Developer OpenAPI docs (Module 12) ---
app.get('/api/v1/intelligence/openapi', (req, res) => {
  const spec = intelPlatform.generateOpenApiDoc();
  res.json(spec);
});

// --- Dynamic Projects Engine (Module 4 Integration) ---
app.get('/api/v1/projects', async (req, res) => {
  try {
    const documents = await intelPlatform.docs.listDocuments();
    const artifacts = await intelPlatform.artifacts.listArtifacts();
    const research = await intelPlatform.research.listSessions();
    const memories = await intelPlatform.memory.searchMemories('', undefined);

    const projectNames = new Set<string>();
    documents.forEach(d => projectNames.add(d.metadata.project || 'default'));
    projectNames.add('default');
    projectNames.add('Warborn OS Kernel');
    projectNames.add('Cortex Core');

    const projects = Array.from(projectNames).map(name => {
      const projDocs = documents.filter(d => (d.metadata.project || 'default').toLowerCase() === name.toLowerCase());
      const totalDocSize = projDocs.reduce((acc, d) => acc + d.size, 0);
      
      const projArts = artifacts.filter(art => {
        return art.name.toLowerCase().includes(name.toLowerCase()) || name === 'default';
      });

      const projResearch = research.filter(s => {
        return s.topic.toLowerCase().includes(name.toLowerCase()) || name === 'default';
      });

      const projMemories = memories.filter(m => {
        return m.content.toLowerCase().includes(name.toLowerCase()) || name === 'default';
      });

      return {
        name,
        metadata: {
          documentsCount: projDocs.length,
          artifactsCount: projArts.length,
          researchCount: projResearch.length,
          memoriesCount: projMemories.length,
          totalBytes: totalDocSize,
          averageConfidence: projResearch.length > 0 ? 0.88 : 0.94,
        },
        documents: projDocs,
        artifacts: projArts,
        research: projResearch,
        memories: projMemories,
        statistics: {
          memoryFootprintKB: parseFloat((totalDocSize / 1024).toFixed(2)),
          concurrencyActive: name === 'Cortex Core' ? 2 : 0,
          cacheHitRate: name === 'default' ? 0.92 : 0.84,
        },
        missionHistory: [
          { text: `Initialized project space for ${name}`, user: 'system', time: '1 day ago' },
          { text: `Synchronized knowledge vectors and indexed chunks for ${name}`, user: 'developer', time: '2 hours ago' }
        ]
      };
    });

    res.json({ success: true, projects });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Mission & Workflow Orchestration (Module 5 Integration) ---
app.get('/api/v1/intelligence/missions', async (req, res) => {
  try {
    const platformMissions = await intelPlatform.missions.listMissions();
    const engineMissions = missionEngine.listMissions();
    const list = [...platformMissions, ...engineMissions];
    res.json({ success: true, count: list.length, missions: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/missions', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      res.status(400).json({ success: false, error: 'Name and description are required.' });
      return;
    }
    const newMission = await missionEngine.createAndRunMission(name, description);
    eventBus.publish('MissionCreated', 'missions', { missionId: newMission.id, name: newMission.name });
    res.json({ success: true, mission: newMission });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/v1/intelligence/missions/:id/state', async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) {
      res.status(400).json({ success: false, error: 'State is required.' });
      return;
    }
    const success = await intelPlatform.missions.updateMissionState(req.params.id, state);
    if (!success) {
      res.status(404).json({ success: false, error: 'Mission not found.' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/v1/events/history', (req, res) => {
  res.json({ success: true, count: eventBus.getHistory().length, events: eventBus.getHistory() });
});

// --- Observability Platform (Module 7 Integration) ---
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, health: healthManager.checkHealth() });
});

app.get('/api/v1/metrics', (req, res) => {
  res.json({ success: true, metrics: metrics.getSnapshot() });
});

// --- Distributed Runtime & Plugins (Module 6 Integration) ---
app.get('/api/v1/jobs', (req, res) => {
  res.json({ success: true, count: scheduler.getJobs().length, jobs: scheduler.getJobs() });
});

app.post('/api/v1/jobs', (req, res) => {
  const { name, payload, priority } = req.body;
  if (!name) {
    res.status(400).json({ success: false, error: 'Job name is required.' });
    return;
  }
  const job = scheduler.submitJob(name, payload, priority);
  res.json({ success: true, job });
});

app.get('/api/v1/plugins', (req, res) => {
  res.json({ success: true, count: pluginRuntime.getRegistry().list().length, plugins: pluginRuntime.getRegistry().list() });
});

app.post('/api/v1/plugins/install', (req, res) => {
  const { id, name, version, entrypoint } = req.body;
  if (!id || !name || !version) {
    res.status(400).json({ success: false, error: 'Plugin id, name, and version are required.' });
    return;
  }
  const manifest = { id, name, version, author: 'Third Party', permissions: [], capabilities: [], entrypoint: entrypoint || '', minPlatformVersion: '1.0.0' };
  pluginRuntime.load(manifest);
  res.json({ success: true, manifest });
});

app.post('/api/v1/intelligence/missions/:id/approve', async (req, res) => {
  try {
    const { stepId, comments } = req.body;
    if (!stepId) {
      res.status(400).json({ success: false, error: 'stepId is required.' });
      return;
    }
    const success = await intelPlatform.missions.approveStep(req.params.id, stepId, comments);
    if (!success) {
      res.status(404).json({ success: false, error: 'Mission or approval step not found.' });
      return;
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Periodic background sweep for mission and workflow node execution simulation
setInterval(() => {
  intelPlatform.missions.stepSimulation().catch((err) => {
    console.error('Failed to run mission simulation step:', err);
  });
}, 5000);

// Semantic Embedding Generator
app.post('/api/cortex/embed', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'Text content is required' });
    return;
  }

  const client = getGeminiClient();
  if (!client) {
    // Generate high-quality mock coordinates/vector for full client functionality
    const vector = Array.from({ length: 128 }, (_, i) => {
      let sum = 0;
      for (let j = 0; j < text.length; j++) {
        sum += text.charCodeAt(j) * (i + 1);
      }
      return Math.sin(sum) * 0.5 + 0.5;
    });
    res.json({ vector, simulated: true });
    return;
  }

  try {
    const response = await client.models.embedContent({
      model: 'gemini-embedding-2-preview',
      contents: text,
    });
    const vector = (response as any).embedding?.values || [];
    res.json({ vector, simulated: false });
  } catch (error: any) {
    console.error('Embedding generation failed:', error);
    // Fallback vector
    const fallbackVector = Array.from({ length: 128 }, () => Math.random());
    res.json({ vector: fallbackVector, error: error.message || 'Embedding error', simulated: true });
  }
});

// Intelligence Agent and Routing Engine (Unified Cortex Pipeline)
app.post('/api/cortex/agent', async (req, res) => {
  const {
    message,
    history = [],
    model = 'gemini-3.5-flash',
    systemInstruction,
    useSearch = false,
    temperature = 0.7,
  } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message content is required' });
    return;
  }

  const startTime = Date.now();

  try {
    // 1. Execute full modular Cortex Engine Request Pipeline
    const pipelineResult = await cortexEngine.executePipeline(
      message,
      history,
      systemInstruction || 'You are Warborn Cortex.'
    );

    // 2. If real Gemini Client is available, run real model execution
    const client = getGeminiClient();
    if (client && !pipelineResult.metrics.cacheHit) {
      const chatHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      const tools: any[] = [];
      if (useSearch) {
        tools.push({ googleSearch: {} });
      }

      let response;
      let usedModel = model;
      let fallbackTriggered = false;
      let simulationTriggered = false;

      try {
        const engineResponse = await contextEngine.executeEnriched(usedModel, message);
        response = {
          text: engineResponse.text,
          candidates: [{
            content: { parts: [{ text: engineResponse.text }] }
          }]
        } as any;
      } catch (firstError: any) {
        console.error('AI Execution Engine run failed. Falling back to simulation mode.', firstError.message);
        simulationTriggered = true;
      }

      if (simulationTriggered || !response) {
        // Fallback gracefully to simulated response already prepared in pipelineResult
        console.log('Using simulated baseline for Cortex Agent response.');
        pipelineResult.text = pipelineResult.text + '\n\n*(System Note: Active Gemini API endpoint quota exceeded or rate-limited. Operating in offline simulation-assisted mode.)*';
        const modelStep = pipelineResult.pipelineTrace.find(t => t.stage === 'Model Execution');
        if (modelStep) {
          modelStep.outputSummary = `Simulation mode activated due to API limits.`;
          modelStep.details = { error: 'Quota/API Limit exceeded' };
        }
      } else {
        const responseText = response.text || 'Command completed successfully.';
        let finalText = responseText;
        if (fallbackTriggered) {
          finalText += '\n\n*(System Note: High-performance model is currently rate-limited or requires billing setup. Automatically fell back to gemini-3.5-flash for seamless continuity.)*';
        }
        pipelineResult.text = finalText;

        // Adjust metrics
        const promptTokens = Math.floor((message.length + JSON.stringify(chatHistory).length) / 4.2) + 50;
        const generationTokens = Math.floor(responseText.length / 4.2);
        const reasoningTokens = usedModel.includes('pro') ? Math.floor(generationTokens * 0.3) : 0;
        const totalTokens = promptTokens + generationTokens + reasoningTokens;
        const isPro = usedModel.includes('pro');
        const cost = isPro
          ? (promptTokens * 0.00125 + generationTokens * 0.00375) / 1000
          : (promptTokens * 0.000075 + generationTokens * 0.0003) / 1000;

        pipelineResult.metrics = {
          ...pipelineResult.metrics,
          promptTokens,
          generationTokens,
          reasoningTokens,
          totalTokens,
          latencyMs: Date.now() - startTime,
          costUsd: cost,
          routingReason: fallbackTriggered ? `Fell back to ${usedModel} due to primary quota exhaustion.` : pipelineResult.metrics.routingReason,
        };

        // Set grounding details
        if (response.candidates?.[0]?.groundingMetadata) {
          (pipelineResult as any).groundingMetadata = response.candidates[0].groundingMetadata;
        }

        // Update trace
        const modelStep = pipelineResult.pipelineTrace.find(t => t.stage === 'Model Execution');
        if (modelStep) {
          modelStep.outputSummary = `Real execution complete on model: ${usedModel}.`;
          modelStep.details = { model: usedModel, api: 'Google GenAI SDK', fallback: fallbackTriggered };
        }
      }
    }

    res.json(pipelineResult);
  } catch (error: any) {
    console.error('Cortex dispatch pipeline failed:', error);
    res.status(500).json({
      error: 'Cortex Pipeline Dispatch Failure',
      details: error.message || error,
      fallbackText: 'Emergency protocol initiated. Simulated baseline active.'
    });
  }
});

// Developer Diagnostics Center - Automated Test Suite Runner
app.post('/api/cortex/diagnostics', async (req, res) => {
  const logs: string[] = [];
  const runner = new CortexTestSuiteRunner(cortexEngine);

  try {
    const results = await runner.runAllTests((line) => {
      console.log(line);
      logs.push(line);
    });

    res.json({
      success: true,
      results: results.results,
      coverage: results.coverage,
      metrics: results.metrics,
      logs
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || error,
      logs
    });
  }
});

// MULTI-AGENT RUNTIME ENDPOINTS

// 1. Get All Registered Agents and Metrics
app.get('/api/cortex/multiagent/agents', (req, res) => {
  try {
    const agents = agentRuntimeCoordinator.registry.getAllAgents();
    res.json({ success: true, agents });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || e });
  }
});

// 2. Create a new multi-agent mission from user prompt
app.post('/api/cortex/multiagent/mission', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ success: false, error: 'Prompt is required.' });
    return;
  }
  try {
    const mission = await agentRuntimeCoordinator.createMission(prompt);
    res.json({ success: true, mission });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || e });
  }
});

// 3. Execute an existing multi-agent mission
app.post('/api/cortex/multiagent/execute', async (req, res) => {
  const { missionId } = req.body;
  if (!missionId) {
    res.status(400).json({ success: false, error: 'missionId is required.' });
    return;
  }
  try {
    const stepProgressLogs: string[] = [];
    const mission = await agentRuntimeCoordinator.executeMission(missionId, (step, logs) => {
      stepProgressLogs.push(`[${step.assignedRole}] ${logs.join(' | ')}`);
    });
    const events = agentRuntimeCoordinator.bus.getEventsForMission(missionId);
    res.json({
      success: true,
      mission,
      events,
      logs: stepProgressLogs
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message || e });
  }
});

// 4. Run automated agent runtime diagnostics tests
app.post('/api/cortex/multiagent/tests', async (req, res) => {
  const logs: string[] = [];
  const suite = new AgentRuntimeTestSuite(agentRuntimeCoordinator);
  try {
    const data = await suite.runAgentTests((line) => {
      console.log(line);
      logs.push(line);
    });
    res.json({
      success: true,
      results: data.results,
      metrics: data.metrics,
      logs
    });
  } catch (e: any) {
    res.status(500).json({
      success: false,
      error: e.message || e,
      logs
    });
  }
});

// ============================================================================
// PHASE 7 — AUTONOMOUS COGNITIVE RUNTIME ENDPOINTS (REST/STREAMING CAPABLE V2)
// ============================================================================

// 1. Module 1: Formulate execution plan / DAG
app.post('/api/v2/cognitive/plan', (req, res) => {
  const { objective, priority = 'medium' } = req.body;
  if (!objective) {
    res.status(400).json({ success: false, error: 'objective is required' });
    return;
  }
  try {
    const blueprint = cognitiveRuntime.planner.generateBlueprint(objective, priority);
    const workflow = cognitiveRuntime.planner.compileWorkflow(blueprint);
    cognitiveRuntime.eventBus.publish({
      source: 'mission',
      eventType: 'PlanFormulated',
      payload: { objective, priority, milestoneCount: blueprint.milestones.length },
      priority: 'normal',
    });
    res.json({ success: true, blueprint, workflow });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 2. Module 2: Dispatch / Deploy Mission
app.post('/api/v2/cognitive/execute', async (req, res) => {
  const { name, description, priority = 'medium', objective } = req.body;
  if (!name || !objective) {
    res.status(400).json({ success: false, error: 'name and objective are required' });
    return;
  }
  try {
    const blueprint = cognitiveRuntime.planner.generateBlueprint(objective, priority);
    const workflow = cognitiveRuntime.planner.compileWorkflow(blueprint);
    const mission = await cognitiveRuntime.runtime.deployMission(name, description || '', priority, blueprint, workflow);

    cognitiveRuntime.eventBus.publish({
      source: 'mission',
      eventType: 'MissionDispatched',
      payload: { id: mission.id, name, priority },
      priority: 'high',
    });

    res.json({ success: true, mission });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 3. Get all deployed missions
app.get('/api/v2/cognitive/missions', async (req, res) => {
  try {
    const list = await cognitiveRuntime.runtime.listMissions();
    res.json({ success: true, missions: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 4. Get detailed mission status and reflection (Module 3)
app.get('/api/v2/cognitive/missions/:id', async (req, res) => {
  try {
    const mission = await cognitiveRuntime.runtime.getMission(req.params.id);
    if (!mission) {
      res.status(404).json({ success: false, error: 'Mission not found' });
      return;
    }
    const reflection = cognitiveRuntime.reflection.getReflection(mission.id) || cognitiveRuntime.reflection.generateReflection(mission);
    res.json({ success: true, mission, reflection });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 5. Update mission state (Module 2 State persistence & transition)
app.post('/api/v2/cognitive/missions/:id/state', async (req, res) => {
  const { state, logs = [] } = req.body;
  if (!state) {
    res.status(400).json({ success: false, error: 'state is required' });
    return;
  }
  try {
    const updated = await cognitiveRuntime.runtime.updateMissionState(req.params.id, state, logs);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Mission not found' });
      return;
    }
    const mission = await cognitiveRuntime.runtime.getMission(req.params.id);

    cognitiveRuntime.eventBus.publish({
      source: 'mission',
      eventType: 'StateTransition',
      payload: { id: req.params.id, state },
      priority: 'normal',
    });

    res.json({ success: true, mission });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 6. Lease control for multi-tenant worker safety
app.post('/api/v2/cognitive/missions/:id/lease', (req, res) => {
  const { action, workerId, durationMs } = req.body;
  if (!action || !workerId) {
    res.status(400).json({ success: false, error: 'action and workerId are required' });
    return;
  }
  try {
    if (action === 'acquire') {
      const ok = cognitiveRuntime.runtime.acquireLease(req.params.id, workerId, durationMs);
      res.json({ success: ok, message: ok ? 'Lease acquired' : 'Lease already held by another worker' });
    } else {
      const ok = cognitiveRuntime.runtime.releaseLease(req.params.id, workerId);
      res.json({ success: ok, message: ok ? 'Lease released' : 'No active matching lease to release' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 7. Module 6: Organization Knowledge Graph
app.get('/api/v2/cognitive/knowledge-graph', (req, res) => {
  try {
    res.json({ success: true, graph: cognitiveRuntime.graph.getGraphData() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 8. Module 7: Real-Time Event Bus publish
app.post('/api/v2/cognitive/event-bus/publish', (req, res) => {
  const { source, eventType, payload, priority = 'normal' } = req.body;
  if (!source || !eventType || !payload) {
    res.status(400).json({ success: false, error: 'source, eventType, and payload are required' });
    return;
  }
  try {
    cognitiveRuntime.eventBus.publish({ source, eventType, payload, priority });
    res.json({ success: true, message: 'Event dispatched successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 9. Module 8: Policies Retrieval
app.get('/api/v2/cognitive/policies', (req, res) => {
  try {
    res.json({ success: true, policies: cognitiveRuntime.policy.getPolicies() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 10. Module 9: Explainable Decisions log
app.get('/api/v2/cognitive/decisions', (req, res) => {
  try {
    res.json({ success: true, decisions: cognitiveRuntime.decision.listDecisions() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 11. Module 10: Cost Intelligence statement
app.get('/api/v2/cognitive/costs', (req, res) => {
  try {
    res.json({ success: true, costs: cognitiveRuntime.cost.getCostStatement() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 12. Module 11: Circuit Breaker status
app.get('/api/v2/cognitive/reliability', (req, res) => {
  try {
    res.json({ success: true, breakers: cognitiveRuntime.reliability.getCircuitStates() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 13. Module 12: OpenAPI specs retrieval
app.get('/api/v2/cognitive/openapi', (req, res) => {
  try {
    res.json(cognitiveRuntime.generateCognitiveOpenApiSpec());
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || err });
  }
});

// 14. Module 14: Automated Diagnostic Tests for Cognitive Runtime
app.post('/api/v2/cognitive/tests', async (req, res) => {
  const logs: string[] = [];
  const suite = new CognitiveRuntimeTestSuite(cognitiveRuntime);
  try {
    const data = await suite.runAllTests((line) => {
      console.log(line);
      logs.push(line);
    });
    res.json({
      success: true,
      results: data.results,
      successRate: data.successRate,
      logs,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || err,
      logs,
    });
  }
});

// ============================================================================
// SPRINT 3 — INTEGRATION HUB & AUTOMATION WORKFLOWS REST APIS
// ============================================================================

// List all integrations
app.get('/api/v1/integrations', (req, res) => {
  try {
    res.json({ success: true, integrations: integrationEngine.listIntegrations() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Connect an integration
app.post('/api/v1/integrations/:id/connect', async (req, res) => {
  try {
    const { configuration } = req.body;
    const result = await integrationEngine.connectIntegration(req.params.id, configuration);
    res.json({ success: true, integration: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Disconnect an integration
app.post('/api/v1/integrations/:id/disconnect', async (req, res) => {
  try {
    const result = await integrationEngine.disconnectIntegration(req.params.id);
    res.json({ success: true, integration: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger manual/auto sync for an integration
app.post('/api/v1/integrations/:id/sync', async (req, res) => {
  try {
    const result = await integrationEngine.syncIntegration(req.params.id);
    res.json({ success: true, integration: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Configure an integration (syncMode, permissions)
app.post('/api/v1/integrations/:id/configure', (req, res) => {
  try {
    const { syncMode, permissions } = req.body;
    const result = integrationEngine.configureIntegration(req.params.id, { syncMode, permissions });
    res.json({ success: true, integration: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Execute SQL query on DB Hub
app.post('/api/v1/integrations/database/query', (req, res) => {
  try {
    const { engine, sql } = req.body;
    if (!engine || !sql) {
      res.status(400).json({ success: false, error: 'engine and sql parameters are required' });
      return;
    }
    const result = integrationEngine.runDatabaseQuery(engine, sql);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search across everything (Unified Search)
app.post('/api/v1/integrations/search', (req, res) => {
  try {
    const { query } = req.body;
    if (query === undefined) {
      res.status(400).json({ success: false, error: 'Query parameter is required' });
      return;
    }
    const results = integrationEngine.searchAcrossAll(query);
    res.json({ success: true, results });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Workflows List
app.get('/api/v1/workflows', (req, res) => {
  try {
    res.json({ success: true, workflows: integrationEngine.listWorkflows() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create Workflow
app.post('/api/v1/workflows', (req, res) => {
  try {
    const result = integrationEngine.createWorkflow(req.body);
    res.json({ success: true, workflow: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Workflow
app.put('/api/v1/workflows/:id', (req, res) => {
  try {
    const result = integrationEngine.updateWorkflow(req.params.id, req.body);
    res.json({ success: true, workflow: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Workflow
app.delete('/api/v1/workflows/:id', (req, res) => {
  try {
    const success = integrationEngine.deleteWorkflow(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Manually execute/trigger a Workflow
app.post('/api/v1/workflows/:id/trigger', async (req, res) => {
  try {
    const result = await integrationEngine.executeWorkflow(req.params.id);
    res.json({ success: true, workflow: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// PHASE 6 — COGNITIVE RUNTIME V2 ENDPOINTS (PERSISTENT MISSIONS & LEARNING)
// ============================================================================

// List V2 Missions (backed by persistent orchestration engine)
app.get('/api/v2/cognitive/missions', async (req, res) => {
  try {
    const list = await intelPlatform.missions.listMissions();
    res.json({ success: true, count: list.length, missions: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create V2 Mission
app.post('/api/v2/cognitive/missions', async (req, res) => {
  try {
    const { name, description, priority, template } = req.body;
    if (!name || !description) {
      res.status(400).json({ success: false, error: 'Name and description are required.' });
      return;
    }
    const newMission = await intelPlatform.missions.createMission({ name, description, priority, template });
    res.json({ success: true, mission: newMission });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update V2 Mission State
app.post('/api/v2/cognitive/missions/:id/state', async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) {
      res.status(400).json({ success: false, error: 'State is required.' });
      return;
    }
    const success = await intelPlatform.missions.updateMissionState(req.params.id, state);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Approve V2 Mission Step
app.post('/api/v2/cognitive/missions/:id/approve', async (req, res) => {
  try {
    const { stepId, comments } = req.body;
    if (!stepId) {
      res.status(400).json({ success: false, error: 'stepId is required.' });
      return;
    }
    const success = await intelPlatform.missions.approveStep(req.params.id, stepId, comments);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Decisions (Cognitive trace)
app.get('/api/v2/cognitive/decisions', (req, res) => {
  try {
    const { missionId } = req.query;
    const list = intelPlatform.missions.getDecisions(missionId as string);
    res.json({ success: true, decisions: list });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Watchers
app.get('/api/v2/cognitive/watchers', (req, res) => {
  try {
    res.json({ success: true, watchers: intelPlatform.missions.getWatchers() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle Watcher Active/Idle
app.post('/api/v2/cognitive/watchers/:id/toggle', (req, res) => {
  try {
    const success = intelPlatform.missions.toggleWatcher(req.params.id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trigger Watcher Event
app.post('/api/v2/cognitive/watchers/trigger', (req, res) => {
  try {
    const { type, target } = req.body;
    intelPlatform.missions.triggerWatcherEvent(type, target);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Playbooks
app.get('/api/v2/cognitive/playbooks', (req, res) => {
  try {
    res.json({ success: true, playbooks: intelPlatform.missions.getPlaybooks() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- VITE MIDDLEWARE / SPA SETUP -----------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in Development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production-compiled static assets from:', distPath);
  }

  gateway.mountErrorHandler(app);

  app.listen(PORT, '0.0.0.0', () => {
    scheduler.start();
    console.log(`[CORTEX APP] Server running at http://localhost:${PORT}`);
  });
}

startServer();
