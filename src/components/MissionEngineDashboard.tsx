import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Rocket,
  Zap,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Activity,
  Workflow,
  TrendingUp,
  Send,
  Database,
  Users,
  Check,
  Eye,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Plus,
  Search,
  Sparkles,
  Terminal,
  FileText,
  FileCode,
  ShieldAlert,
  Fingerprint,
  Cpu,
  CornerDownRight,
  HelpCircle,
  Network
} from 'lucide-react';
import { Mission, MissionState, MissionTrigger, MissionApproval, MissionArtifact, MissionNode, LogEntry } from '../types';
import { INITIAL_MISSIONS } from '../data';

interface MissionEngineDashboardProps {
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function MissionEngineDashboard({ onAddLog, isDark }: MissionEngineDashboardProps) {
  // ------------------ STATE ------------------
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [selectedMissionId, setSelectedMissionId] = useState<string>(INITIAL_MISSIONS[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [isSimulatorRunning, setIsSimulatorRunning] = useState<boolean>(true);
  const [systemUtilization, setSystemUtilization] = useState({ cpu: 34, memory: 58, throughput: 14.2 });

  // Slide-over state for New Mission creation
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [newMissionName, setNewMissionName] = useState('');
  const [newMissionDesc, setNewMissionDesc] = useState('');
  const [newMissionPriority, setNewMissionPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [newMissionTemplate, setNewMissionTemplate] = useState<string>('saas');

  // Interactive Verification Tab
  const [activeSubTab, setActiveSubTab] = useState<'monitor' | 'cognitive' | 'artifacts' | 'triggers' | 'testing'>('monitor');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(null);

  // Phase 5 Cognitive Runtime States
  const [cognitiveDecisions, setCognitiveDecisions] = useState<any[]>([]);
  const [cognitivePolicies, setCognitivePolicies] = useState<any[]>([]);
  const [circuitBreakers, setCircuitBreakers] = useState<any[]>([]);
  const [cognitiveCosts, setCognitiveCosts] = useState<any | null>(null);
  const [activeReflection, setActiveReflection] = useState<any | null>(null);
  const [knowledgeGraph, setKnowledgeGraph] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [activeCognitiveStep, setActiveCognitiveStep] = useState<number>(0);
  const [watchers, setWatchers] = useState<any[]>([]);
  const [playbooks, setPlaybooks] = useState<any[]>([]);

  // Time Travel Replay index (for the active selected mission's log list)
  const [replayLogIndex, setReplayLogIndex] = useState<number>(-1);

  // Testing & Benchmark Suite Execution state
  const [testSuite, setTestSuite] = useState<{
    isRunning: boolean;
    type: 'none' | 'unit' | 'integration' | 'e2e' | 'stress' | 'security';
    progress: number;
    results: string[];
    stressData: Array<{ x: number; throughput: number; latency: number; load: number }>;
  }>({
    isRunning: false,
    type: 'none',
    progress: 0,
    results: [],
    stressData: []
  });

  // Current selected mission
  const fallbackMission: Mission = {
    id: 'placeholder',
    name: 'Initializing Telemetry Core...',
    description: 'Awaiting connection to active Cortex instance boundaries...',
    priority: 'low',
    state: 'queued',
    progress: 0,
    currentStepIndex: 0,
    tokensUsed: 0,
    cost: 0,
    latency: 0,
    retries: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    workflow: {
      id: 'ws_placeholder',
      name: 'Placeholder',
      version: '1.0',
      nodes: [],
      edges: []
    } as any,
    approvals: [],
    logs: [],
    artifacts: [],
    triggers: []
  };

  const activeMission = missions.find(m => m.id === selectedMissionId) || missions[0] || fallbackMission;

  // Fetch missions helper
  const fetchMissions = async () => {
    try {
      const res = await fetch('/api/v1/intelligence/missions');
      const json = await res.json();
      if (json.success && json.missions) {
        setMissions(json.missions);
        if (json.missions.length > 0 && !selectedMissionId) {
          setSelectedMissionId(json.missions[0].id);
          if (json.missions[0].artifacts?.length > 0) {
            setSelectedArtifactId(json.missions[0].artifacts[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching missions from Cortex:', err);
    }
  };

  const fetchCognitiveData = async () => {
    try {
      // Fetch decisions (Explainability)
      const decisionsRes = await fetch('/api/v2/cognitive/decisions');
      if (decisionsRes.ok) {
        const data = await decisionsRes.json();
        if (data?.success) setCognitiveDecisions(data.decisions);
      }

      // Fetch compliance policies
      const policiesRes = await fetch('/api/v2/cognitive/policies');
      if (policiesRes.ok) {
        const data = await policiesRes.json();
        if (data?.success) setCognitivePolicies(data.policies);
      }

      // Fetch reliability circuit status
      const breakersRes = await fetch('/api/v2/cognitive/reliability');
      if (breakersRes.ok) {
        const data = await breakersRes.json();
        if (data?.success) setCircuitBreakers(data.breakers);
      }

      // Fetch cost intelligence details
      const costsRes = await fetch('/api/v2/cognitive/costs');
      if (costsRes.ok) {
        const data = await costsRes.json();
        if (data?.success) setCognitiveCosts(data.costs);
      }

      // Fetch active mission reflection / self-reflection details
      if (activeMission.id && activeMission.id !== 'placeholder') {
        const reflectionRes = await fetch(`/api/v2/cognitive/missions/${activeMission.id}`);
        if (reflectionRes.ok) {
          const data = await reflectionRes.json();
          if (data?.success && data.reflection) {
            setActiveReflection(data.reflection);
          }
        }
      }

      // Fetch semantic knowledge graph structure
      const graphRes = await fetch('/api/v2/cognitive/knowledge-graph');
      if (graphRes.ok) {
        const data = await graphRes.json();
        if (data?.success && data.graph) {
          setKnowledgeGraph(data.graph);
        }
      }

      // Fetch persistent watchers
      const watchersRes = await fetch('/api/v2/cognitive/watchers');
      if (watchersRes.ok) {
        const data = await watchersRes.json();
        if (data?.success) setWatchers(data.watchers);
      }

      // Fetch persistent playbooks
      const playbooksRes = await fetch('/api/v2/cognitive/playbooks');
      if (playbooksRes.ok) {
        const data = await playbooksRes.json();
        if (data?.success) setPlaybooks(data.playbooks);
      }
    } catch (err) {
      console.error('Error fetching Phase 5 cognitive data:', err);
    }
  };

  // ------------------ LIVE CORTEX API POLLING ------------------
  useEffect(() => {
    fetchMissions();
    fetchCognitiveData();
  }, [selectedMissionId]);

  useEffect(() => {
    if (!isSimulatorRunning) return;

    const timer = setInterval(() => {
      // Periodic update to utilization
      setSystemUtilization(prev => ({
        cpu: Math.min(95, Math.max(10, prev.cpu + Math.floor(Math.random() * 11) - 5)),
        memory: Math.min(90, Math.max(30, prev.memory + Math.floor(Math.random() * 5) - 2)),
        throughput: Math.min(45, Math.max(2, parseFloat((prev.throughput + (Math.random() * 2 - 1)).toFixed(1))))
      }));

      // Cycle the cognitive loop step: Observe (0) -> Improve (10)
      setActiveCognitiveStep(prev => (prev + 1) % 11);

      // Pull fresh data from the active planning scheduler running inside the server
      fetchMissions();
      fetchCognitiveData();
    }, 3000);

    return () => clearInterval(timer);
  }, [isSimulatorRunning, selectedMissionId, activeMission.id]);

  // ------------------ ACTIONS ------------------
  const handleTogglePlayPause = async (id: string) => {
    const target = missions.find(m => m.id === id);
    if (!target) return;

    const isRunning = target.state === 'running';
    const nextState = isRunning ? 'paused' : 'running';
    const actionText = isRunning ? 'Paused' : 'Resumed';

    try {
      const res = await fetch(`/api/v1/intelligence/missions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: nextState })
      });
      const json = await res.json();
      if (json.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MISSION',
          message: `${actionText} autonomous mission: '${target.name}'.`
        });
        fetchMissions();
      }
    } catch (err) {
      console.error('Failed to toggle mission state:', err);
    }
  };

  const handleStepForward = async (id: string) => {
    // Step forward simulation using active node updates
    const target = missions.find(m => m.id === id);
    if (!target) return;

    const nodesCopy = [...target.workflow.nodes];
    const activeNodeIndex = nodesCopy.findIndex(n => n.status === 'running' || n.status === 'waiting');

    if (activeNodeIndex !== -1) {
      const current = nodesCopy[activeNodeIndex];
      // Mark active node completed and trigger a fast state refresh
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'trace',
        module: 'MISSION',
        message: `Manual step-override executed on mission: '${target.name}'.`
      });
      
      // Override state to completed directly on server if possible, or simulate via PUT
      try {
        await fetch(`/api/v1/intelligence/missions/${id}/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: 'running' })
        });
        fetchMissions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleResetMission = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/intelligence/missions/${id}/state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: 'running' })
      });
      if ((await res.json()).success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MISSION',
          message: `Re-initiated and reset execution memory graph for mission.`
        });
        fetchMissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerApprovalAction = async (missionId: string, approvalId: string, action: 'approve' | 'reject' | 'modify' | 'delegate' | 'escalate' | 'rollback') => {
    const target = missions.find(m => m.id === missionId);
    if (!target) return;

    const approval = target.approvals.find(a => a.id === approvalId);
    if (!approval) return;

    try {
      if (action === 'approve') {
        const res = await fetch(`/api/v1/intelligence/missions/${missionId}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId: approval.stepId, comments: 'Approved by human manager.' })
        });
        if ((await res.json()).success) {
          onAddLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            module: 'HITL',
            message: `User approved mission checkpoint [${missionId}]. Continuing core pipeline.`
          });
          fetchMissions();
        }
      } else {
        // Fallback state change for other actions
        const res = await fetch(`/api/v1/intelligence/missions/${missionId}/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ state: action === 'reject' ? 'failed' : 'running' })
        });
        if ((await res.json()).success) {
          onAddLog({
            timestamp: new Date().toISOString(),
            level: action === 'reject' ? 'error' : 'info',
            module: 'HITL',
            message: `User triggered ${action} on checkpoint [${missionId}].`
          });
          fetchMissions();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleWatcher = async (id: string) => {
    try {
      const res = await fetch(`/api/v2/cognitive/watchers/${id}/toggle`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'WATCHER',
          message: `Toggled active state for watcher: '${id}'.`
        });
        fetchCognitiveData();
      }
    } catch (err) {
      console.error('Error toggling watcher:', err);
    }
  };

  const handleTriggerWatcherEvent = async (type: string, target: string) => {
    try {
      const res = await fetch(`/api/v2/cognitive/watchers/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, target })
      });
      const json = await res.json();
      if (json.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'EVENT',
          message: `Dispatched external live event trigger: ${type.toUpperCase()} over '${target}'.`
        });
        fetchCognitiveData();
        fetchMissions();
      }
    } catch (err) {
      console.error('Error triggering watcher:', err);
    }
  };

  const handleSimulateTrigger = (triggerType: 'webhook' | 'git' | 'timer' | 'upload' | 'db') => {
    // Generate simulated event and trace to appropriate mission triggers
    const timestamp = new Date().toISOString();
    let matchingMission: Mission | null = null;
    let logMessage = '';

    if (triggerType === 'webhook') {
      matchingMission = missions.find(m => m.id === 'mission_infra_monitor') || null;
      logMessage = `Webhook triggered: POST /webhooks/infra-alert - Payload { alert: 'memory_threshold_exceeded', value: 89 }`;
    } else if (triggerType === 'git') {
      matchingMission = missions.find(m => m.id === 'mission_saas_builder') || null;
      logMessage = `Git Webhook received: Repository 'warborn-os/cortex-core' pushed commit 'sha:90f13a9' on branch 'main'.`;
    } else if (triggerType === 'timer') {
      matchingMission = missions.find(m => m.id === 'mission_competitor_radar') || null;
      logMessage = `Cron Scheduler triggered event: '0 8 * * *' (Daily Competitor Radar Check).`;
    } else if (triggerType === 'upload') {
      logMessage = `File upload complete: 'contract_audit_compliance_v4.pdf' (1.4 MB). Generating custom analyzing mission...`;
    } else {
      logMessage = `Database Change event captured: Table 'api_keys' INSERT operation detected.`;
    }

    onAddLog({
      timestamp,
      level: 'info',
      module: 'EVENT_TRIGGER',
      message: logMessage
    });

    if (matchingMission) {
      setMissions(prev => prev.map(m => {
        if (m.id === matchingMission!.id) {
          onAddLog({
            timestamp,
            level: 'info',
            module: 'MISSION_SCHEDULER',
            message: `Queueing and prioritizing scheduled mission '${m.name}' due to Event trigger.`
          });

          // Reset progress and nodes
          const resetNodes = m.workflow.nodes.map((n, i) => ({
            ...n,
            status: i === 0 ? ('running' as const) : ('pending' as const)
          }));

          return {
            ...m,
            state: 'running' as MissionState,
            progress: 10,
            workflow: { ...m.workflow, nodes: resetNodes },
            logs: [...m.logs, `Event trigger [${triggerType.toUpperCase()}] received. Spawning execution flow.`],
            updatedAt: timestamp
          };
        }
        return m;
      }));

      setSelectedMissionId(matchingMission.id);
    } else if (triggerType === 'upload') {
      // Create a brand new mission on file upload
      const newId = `mission_upload_${Date.now()}`;
      const newMiss: Mission = {
        id: newId,
        name: `Automated Analysis: contract_audit_compliance_v4`,
        description: 'Autonomously digests contract specifications, flags anomalous compliance statements, and structures risk assessment reports.',
        state: 'running',
        priority: 'high',
        workflow: {
          id: `wf_${newId}`,
          name: 'Dynamic Document Assessment',
          version: 'v1.0.0',
          nodes: [
            { id: 'u_1', label: 'Extract PDF Text Layers', type: 'sequential', status: 'completed', assignedAgent: 'Operator Agent', duration: 300 },
            { id: 'u_2', label: 'Cross-reference Vector Directives', type: 'sequential', status: 'running', assignedAgent: 'Sentinel Agent', duration: 100 },
            { id: 'u_3', label: 'Compile Risk Matrix Compliance', type: 'sequential', status: 'pending', assignedAgent: 'Code Agent' },
          ],
          edges: [
            { from: 'u_1', to: 'u_2' },
            { from: 'u_2', to: 'u_3' }
          ]
        },
        triggers: [
          { id: `trig_${newId}`, type: 'upload', value: 'contract_audit_compliance_v4.pdf', isActive: true }
        ],
        approvals: [],
        artifacts: [
          {
            id: `art_${newId}_risk`,
            name: 'Contract Extraction Token Ledger',
            type: 'analysis',
            size: '4.8 KB',
            hash: 'SHA256:7B8F12A...',
            lineage: ['u_1'],
            createdAt: timestamp,
            content: `Document: contract_audit_compliance_v4.pdf\n- Word Count: 12,450 words\n- Integrity Hash: SHA256:EE3382D...\n- Status: Safe. Flagged 2 suspect indemnity clauses in Section 8.3.`
          }
        ],
        progress: 35,
        currentStepIndex: 1,
        tokensUsed: 42000,
        cost: 0.126,
        latency: 410,
        retries: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        logs: [
          'Dynamic mission triggered by user document upload event.',
          'Extracting text layers via localized filesystem container.',
          'Comparing text indices with semantic alignment directives...'
        ]
      };

      setMissions(prev => [newMiss, ...prev]);
      setSelectedMissionId(newId);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMissionName.trim()) return;

    try {
      const res = await fetch('/api/v1/intelligence/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMissionName,
          description: newMissionDesc || 'Custom developer-orchestrated mission.',
          priority: newMissionPriority,
          template: newMissionTemplate
        })
      });
      const json = await res.json();
      if (json.success && json.mission) {
        setSelectedMissionId(json.mission.id);
        setShowCreatePanel(false);
        setNewMissionName('');
        setNewMissionDesc('');

        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MISSION_REGISTRY',
          message: `Enrolled new autonomous mission: '${newMissionName}' in priority queue [${newMissionPriority.toUpperCase()}].`
        });

        fetchMissions();
      }
    } catch (err) {
      console.error('Failed to create mission via live Cortex API:', err);
    }
  };

  // ------------------ TEST & VERIFICATION SUITE SIMULATOR ------------------
  const runTestSuite = (type: 'unit' | 'integration' | 'e2e' | 'stress' | 'security') => {
    setTestSuite({
      isRunning: true,
      type,
      progress: 0,
      results: [`Initializing ${type.toUpperCase()} test runner inside isolated sandbox environment...`],
      stressData: []
    });

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'QA_VERIFIER',
      message: `Starting Automated Phase 5 Verification suite: Type: [${type.toUpperCase()}]`
    });

    let currentProgress = 0;
    const testLogs: string[] = [];
    const stressPoints: Array<{ x: number; throughput: number; latency: number; load: number }> = [];

    const interval = setInterval(() => {
      currentProgress += 10;
      
      // Dynamic logs depending on type
      if (type === 'unit') {
        if (currentProgress === 20) testLogs.push('✓ Unit test: MissionState state machine transitions - PASS');
        if (currentProgress === 40) testLogs.push('✓ Unit test: Concurrency prioritizer & Rate Limiter - PASS');
        if (currentProgress === 60) testLogs.push('✓ Unit test: Artifact SHA256 integrity checkers - PASS');
        if (currentProgress === 80) testLogs.push('✓ Unit test: Cron-expressions string parser - PASS');
        if (currentProgress === 100) testLogs.push('✓ Unit tests complete: 28 assertions, 0 failures, coverage 98.4%.');
      } else if (type === 'integration') {
        if (currentProgress === 20) testLogs.push('✓ Integration: Event Trigger Engine ➔ Scheduler Queue dispatch - PASS');
        if (currentProgress === 40) testLogs.push('✓ Integration: Workflow Engine ➔ Agent execution assignment loop - PASS');
        if (currentProgress === 60) testLogs.push('✓ Integration: HitL Sign-off block ➔ State Rollback routine - PASS');
        if (currentProgress === 80) testLogs.push('✓ Integration: Memory storage write-back post mission - PASS');
        if (currentProgress === 100) testLogs.push('✓ Integration checks verified: Node bindings fully stable.');
      } else if (type === 'security') {
        if (currentProgress === 20) testLogs.push('[AUDIT] Verifying zero-trust sandbox execution limits...');
        if (currentProgress === 40) testLogs.push('✓ Sandbox integrity audit: Isolated node environments secure - PASS');
        if (currentProgress === 60) testLogs.push('✓ Secret manager key rotation: Automatic masking verified - PASS');
        if (currentProgress === 80) testLogs.push('✓ Audit logs and policy checking: Strict boundaries enforced - PASS');
        if (currentProgress === 100) testLogs.push('✓ Security review complete: Code execution environment cleared.');
      } else if (type === 'e2e') {
        if (currentProgress === 20) testLogs.push('E2E Walkthrough Step 1: User spawns new custom workspace mission... OK');
        if (currentProgress === 40) testLogs.push('E2E Walkthrough Step 2: System receives git trigger webhook... Scheduled immediately.');
        if (currentProgress === 60) testLogs.push('E2E Walkthrough Step 3: Sentinel Agent requests Human Approval on step 5... OK');
        if (currentProgress === 80) testLogs.push('E2E Walkthrough Step 4: Human grants sign-off; pipeline executes to completed node... OK');
        if (currentProgress === 100) testLogs.push('✓ E2E Lifecycle validation succeeded with perfect coordination logs.');
      } else if (type === 'stress') {
        // Build simulated historical timeline load curves
        const pointIdx = currentProgress / 10;
        const simulatedLoad = Math.round(100 + (pointIdx * 150) + Math.random() * 50);
        const simulatedThroughput = parseFloat((25 + (pointIdx * 35.5) + Math.random() * 10).toFixed(1));
        const simulatedLatency = Math.round(450 - (pointIdx * 35) + Math.random() * 20);
        
        stressPoints.push({
          x: currentProgress,
          throughput: simulatedThroughput,
          latency: simulatedLatency,
          load: simulatedLoad
        });

        testLogs.push(`[LOAD SIMULATOR] Concurrently simulating ${simulatedLoad} missions... Active Rate: ${simulatedThroughput} jobs/s. Latency: ${simulatedLatency}ms.`);
        
        if (currentProgress === 100) {
          testLogs.push('✓ Load Limit test complete. Max 1,000 parallel queued jobs parsed. Zero thread drop errors detected. Automatic rate throttles throttled safely.');
        }
      }

      setTestSuite(prev => ({
        ...prev,
        progress: currentProgress,
        results: [...prev.results, ...testLogs],
        stressData: stressPoints
      }));
      testLogs.length = 0; // Clear printed

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTestSuite(prev => ({ ...prev, isRunning: false }));
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'QA_VERIFIER',
          message: `Verification complete. Suite status: [PASS] for [${type.toUpperCase()}]`
        });
      }
    }, 800);
  };

  // ------------------ HELPERS ------------------
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStateColor = (state: MissionState) => {
    switch (state) {
      case 'completed': return 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20';
      case 'failed': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'paused': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'running': return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
      case 'approval_required': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'scheduled': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredMissions = missions.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = stateFilter === 'all' ? true : m.state === stateFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6" id="mission-engine-view-wrapper">
      {/* ------------------ TITLE BAR ------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-gradient-to-br from-amber-500 to-red-500 text-white shadow-lg">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </span>
            <h1 className="text-xl font-bold tracking-tight uppercase font-display text-white">
              Mission Orchestration Engine
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Cortex Kernel 5.0 — Multi-Agent workflows, deterministic state machines, human approval hubs, and security sandboxing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimulatorRunning(!isSimulatorRunning)}
            className={`px-3 py-1.5 rounded-sm border text-xs font-mono flex items-center gap-2 transition-all ${
              isSimulatorRunning
                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                : 'bg-white/5 text-white/50 border-white/10'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSimulatorRunning ? 'bg-[#10B981] animate-ping' : 'bg-white/20'}`} />
            {isSimulatorRunning ? 'CORE SCHEDULER: ON' : 'CORE SCHEDULER: OFF'}
          </button>

          <button
            onClick={() => setShowCreatePanel(true)}
            id="spawn-mission-btn"
            className="bg-white text-black hover:bg-white/90 px-4 py-1.5 rounded-sm text-xs font-bold uppercase flex items-center gap-1.5 transition-all shadow-md select-none"
          >
            <Plus className="w-4 h-4" />
            Launch Mission
          </button>
        </div>
      </div>

      {/* ------------------ OVERALL TELEMETRY ------------------ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="telemetry-grid">
        <div className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Throughput Rate</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-white">{systemUtilization.throughput}</span>
            <span className="text-xs text-white/50">jobs/sec</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${(systemUtilization.throughput / 45) * 100}%` }} />
          </div>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">CPU Core Load</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-white">{systemUtilization.cpu}%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${systemUtilization.cpu}%` }} />
          </div>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">L2 Memory Allocation</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-white">{systemUtilization.memory}%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-purple-500 h-full transition-all duration-1000" style={{ width: `${systemUtilization.memory}%` }} />
          </div>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Total Enrolled Jobs</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-mono font-bold text-white">{missions.length}</span>
            <span className="text-xs text-[#10B981] ml-1">({missions.filter(m => m.state === 'running').length} running)</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#10B981] h-full" style={{ width: `${(missions.filter(m => m.state === 'running').length / Math.max(1, missions.length)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ------------------ MAIN GRID SECTION ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="mission-console-primary-grid">
        
        {/* LEFT COLUMN: MISSION REGISTRY & QUEUE (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider font-display text-white flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-500" />
                Active Mission Queue
              </span>
              <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full font-bold">
                {filteredMissions.length} items
              </span>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Filter by objective..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <select
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                className="bg-white/5 border border-white/10 text-xs text-white px-2 py-1.5 rounded-sm focus:outline-none focus:border-amber-500/50"
              >
                <option value="all">All States</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="queued">Queued</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="approval_required">Waiting Approval</option>
              </select>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <AnimatePresence initial={false}>
                {filteredMissions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-white/30 p-8">
                    <Sliders className="w-8 h-8 mb-2 stroke-1" />
                    <span className="text-xs">No missions matching query found</span>
                  </div>
                ) : (
                  filteredMissions.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        setSelectedMissionId(m.id);
                        setReplayLogIndex(-1); // Reset log replay when switching
                      }}
                      className={`p-3 rounded-md border text-left cursor-pointer transition-all select-none ${
                        selectedMissionId === m.id
                          ? 'bg-white/5 border-amber-500/40 shadow-md shadow-amber-500/5'
                          : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                      }`}
                      id={`mission-card-${m.id}`}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-white truncate max-w-[180px] font-display">
                          {m.name}
                        </span>
                        <div className="flex gap-1">
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs border font-bold ${getPriorityColor(m.priority)}`}>
                            {m.priority}
                          </span>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-xs border font-bold ${getStateColor(m.state)}`}>
                            {m.state.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
                        {m.description}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.03]">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/60 font-bold">
                            {m.progress}%
                          </span>
                          <div className="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-red-500 h-full transition-all duration-500"
                              style={{ width: `${m.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL OPERATIONS CENTER (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="border border-white/5 bg-[#0D0D0D] p-5 rounded-lg flex flex-col min-h-[520px]">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-md font-bold text-white uppercase tracking-tight font-display">
                    {activeMission.name}
                  </h2>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm border font-bold ${getPriorityColor(activeMission.priority)}`}>
                    {activeMission.priority}
                  </span>
                </div>
                <p className="text-xs text-white/55 mt-1 leading-relaxed">
                  {activeMission.description}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTogglePlayPause(activeMission.id)}
                  title={activeMission.state === 'running' ? 'Pause Mission' : 'Execute Mission'}
                  className={`p-2 rounded-sm border transition-all ${
                    activeMission.state === 'running'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                  }`}
                >
                  {activeMission.state === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  onClick={() => handleStepForward(activeMission.id)}
                  title="Manual Step Forward (Override)"
                  className="p-2 rounded-sm border bg-white/5 text-white border-white/10 hover:bg-white/10 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleResetMission(activeMission.id)}
                  title="Reset Mission Cache"
                  className="p-2 rounded-sm border bg-white/5 text-white border-white/10 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-white/5 gap-1 mb-4 select-none overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveSubTab('monitor')}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === 'monitor'
                    ? 'border-amber-500 text-white font-bold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Workflow Monitor
              </button>
              <button
                onClick={() => setActiveSubTab('cognitive')}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === 'cognitive'
                    ? 'border-amber-500 text-white font-bold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Cognitive Reasoning Engine
              </button>
              <button
                onClick={() => setActiveSubTab('artifacts')}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === 'artifacts'
                    ? 'border-amber-500 text-white font-bold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Artifact Vault ({activeMission.artifacts.length})
              </button>
              <button
                onClick={() => setActiveSubTab('triggers')}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === 'triggers'
                    ? 'border-amber-500 text-white font-bold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Event Triggers
              </button>
              <button
                onClick={() => setActiveSubTab('testing')}
                className={`px-4 py-2 text-xs font-mono border-b-2 transition-all whitespace-nowrap ${
                  activeSubTab === 'testing'
                    ? 'border-amber-500 text-white font-bold'
                    : 'border-transparent text-white/40 hover:text-white/70'
                }`}
              >
                Simulation & Tests
              </button>
            </div>

            {/* SUB-TAB CONTENTS */}
            <div className="flex-1 flex flex-col justify-between">
              
              {/* MONITOR SUB-TAB */}
              {activeSubTab === 'monitor' && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="workflow-monitor-tab">
                  {/* Visual Flow graph */}
                  <div className="border border-white/5 bg-black/40 rounded-lg p-4 relative overflow-hidden flex flex-col justify-center min-h-[170px]">
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="text-[9px] font-mono text-white/40 uppercase">Execution Graph Topology (Active)</span>
                    </div>

                    <div className="absolute top-2 right-2 text-[9px] font-mono text-white/30">
                      Version {activeMission.workflow.version}
                    </div>

                    {/* Clean SVG/HTML hybrid custom Graph rendering */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-6 relative z-10">
                      {activeMission.workflow.nodes.map((node, index) => {
                        const isNodeRunning = node.status === 'running';
                        const isNodeCompleted = node.status === 'completed';
                        const isNodeWaiting = node.status === 'waiting';
                        const isNodeFailed = node.status === 'failed';

                        return (
                          <div
                            key={node.id}
                            className={`p-2.5 rounded-sm border transition-all relative ${
                              isNodeRunning
                                ? 'bg-[#18181B] border-cyan-500/50 shadow-md shadow-cyan-500/5'
                                : isNodeCompleted
                                ? 'bg-white/[0.01] border-[#10B981]/30'
                                : isNodeWaiting
                                ? 'bg-purple-500/[0.02] border-purple-500/40 animate-pulse'
                                : isNodeFailed
                                ? 'bg-red-500/[0.02] border-red-500/40'
                                : 'bg-white/[0.01] border-white/5 opacity-55'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-[10px] font-mono text-white/40 font-bold">
                                0{index + 1}
                              </span>
                              <div className="flex gap-1 items-center">
                                {isNodeCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />}
                                {isNodeRunning && <RefreshCw className="w-3.5 h-3.5 text-cyan-500 animate-spin" />}
                                {isNodeWaiting && <AlertCircle className="w-3.5 h-3.5 text-purple-400" />}
                                {isNodeFailed && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                              </div>
                            </div>

                            <span className="text-xs text-white font-medium block truncate" title={node.label}>
                              {node.label}
                            </span>

                            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/[0.03]">
                              <span className="text-[9px] font-mono text-white/40">
                                {node.assignedAgent || 'System Engine'}
                              </span>
                              {node.duration && (
                                <span className="text-[9px] font-mono text-[#10B981]">
                                  {node.duration}ms
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* DETERMINISTIC STATE MACHINE VISUALIZER */}
                  <div className="border border-white/5 bg-[#080808] p-3 rounded-lg">
                    <span className="text-[9px] font-mono text-white/40 block uppercase tracking-wider mb-2">
                      Deterministic Lifecycle Map
                    </span>
                    <div className="flex flex-wrap items-center gap-1">
                      {(['draft', 'queued', 'planning', 'running', 'waiting', 'approval_required', 'completed'] as MissionState[]).map((state, i) => {
                        const isActive = activeMission.state === state;
                        const isPast = ['draft', 'queued', 'planning', 'running', 'waiting', 'approval_required', 'completed'].indexOf(activeMission.state) > i;

                        return (
                          <React.Fragment key={state}>
                            {i > 0 && <ArrowRight className="w-3 h-3 text-white/10 shrink-0" />}
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                                isActive
                                  ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                                  : isPast
                                  ? 'bg-white/[0.02] border-white/10 text-white/50'
                                  : 'bg-transparent border-transparent text-white/20'
                              }`}
                            >
                              {state.toUpperCase().replace('_', ' ')}
                            </span>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>

                  {/* HITL HUMAN-IN-THE-LOOP INTERVENTION GATE */}
                  {activeMission.approvals.some(a => a.status === 'pending') && (
                    <div className="border border-purple-500/20 bg-purple-500/[0.03] p-4 rounded-lg animate-pulse-slow">
                      <div className="flex items-start gap-3">
                        <Fingerprint className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                            MANDATORY HUMAN APPROVAL SIGN-OFF REQUIRED
                          </span>
                          <p className="text-xs text-white/70">
                            {activeMission.approvals.find(a => a.status === 'pending')?.comments}
                          </p>

                          <div className="flex flex-wrap gap-2 pt-3">
                            <button
                              onClick={() => handleTriggerApprovalAction(activeMission.id, activeMission.approvals[0].id, 'approve')}
                              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-sm flex items-center gap-1 transition-all"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve Code Deploy
                            </button>
                            <button
                              onClick={() => handleTriggerApprovalAction(activeMission.id, activeMission.approvals[0].id, 'reject')}
                              className="px-3 py-1 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-sm flex items-center gap-1 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject / Block
                            </button>
                            <button
                              onClick={() => handleTriggerApprovalAction(activeMission.id, activeMission.approvals[0].id, 'rollback')}
                              className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-sm flex items-center gap-1 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Rollback Step
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LOGS / DEV REPLAY TERMINAL */}
                  <div className="flex-1 flex flex-col min-h-[160px]">
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Orchestration Trace Logs ({activeMission.logs.length})</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-white/30 font-mono">Time-Travel Replay:</span>
                        <div className="flex border border-white/10 rounded-sm overflow-hidden bg-black font-mono text-[9px]">
                          <button
                            onClick={() => setReplayLogIndex(prev => Math.max(-1, prev - 1))}
                            disabled={replayLogIndex === -1}
                            className="px-1.5 py-0.5 border-r border-white/10 hover:bg-white/5 disabled:opacity-30"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() => setReplayLogIndex(prev => Math.min(activeMission.logs.length - 1, prev + 1))}
                            disabled={replayLogIndex === activeMission.logs.length - 1}
                            className="px-1.5 py-0.5 hover:bg-white/5 disabled:opacity-30"
                          >
                            Next
                          </button>
                        </div>
                        {replayLogIndex !== -1 && (
                          <button
                            onClick={() => setReplayLogIndex(-1)}
                            className="text-[9px] text-amber-500 underline font-mono"
                          >
                            Reset Live
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 bg-black/60 rounded border border-white/5 p-3.5 font-mono text-xs text-white/80 overflow-y-auto space-y-1.5 max-h-[180px] min-h-[130px] custom-scrollbar text-left select-text">
                      {(replayLogIndex === -1 ? activeMission.logs : activeMission.logs.slice(0, replayLogIndex + 1)).map((log, i) => (
                        <div key={i} className="flex gap-2 items-start leading-relaxed text-white/70">
                          <span className="text-white/20 select-none">{i + 1}</span>
                          <span className="text-cyan-500 select-none">➔</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {replayLogIndex !== -1 && (
                        <div className="text-[10px] text-amber-500/80 bg-amber-500/5 px-2 py-1 rounded-sm mt-2 flex items-center gap-1 select-none">
                          <Terminal className="w-3 h-3" />
                          <span>Replay mode active (Step {replayLogIndex + 1} of {activeMission.logs.length}). Real-time telemetry paused.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* COGNITIVE REASONING ENGINE SUB-TAB */}
              {activeSubTab === 'cognitive' && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="cognitive-reasoning-tab">
                  {/* Part 1: Continuous Cognitive Reasoning Loop */}
                  <div className="border border-white/5 bg-black/40 rounded-lg p-4 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-2 left-2 flex items-center gap-1.5 select-none">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[10px] font-mono text-white/55 uppercase tracking-wider font-bold">Cortex Cognitive Operating System (Active Loop)</span>
                    </div>

                    <div className="absolute top-2 right-2 text-[10px] font-mono text-white/30">
                      Telemetry Node: ON-LOOP
                    </div>

                    {/* Continuous Interconnected Node Train */}
                    <div className="flex flex-wrap items-center justify-between gap-1 pt-8 pb-3 border-b border-white/[0.03]">
                      {[
                        { name: 'Observe', desc: 'Polling event bus & telemetry logs...' },
                        { name: 'Context', desc: 'Indexing knowledge graph and parsing local buffers...' },
                        { name: 'Memory', desc: 'Retrieving working & long term memories...' },
                        { name: 'Intent', desc: 'Synthesizing abductive goals...' },
                        { name: 'Plan', desc: 'Decomposing goals into execution DAG...' },
                        { name: 'Delegate', desc: 'Allocating tasks across specialists...' },
                        { name: 'Execute', desc: 'Dispatching tasks into sandboxed containers...' },
                        { name: 'Validate', desc: 'Evaluating AST and checking policy controls...' },
                        { name: 'Reflect', desc: 'Evaluating Quality, Token cost, and Latency...' },
                        { name: 'Learn', desc: 'Extracting patterns and adjusting confidence weights...' },
                        { name: 'Improve', desc: 'Optimizing circuit breakers & writing rules...' }
                      ].map((step, idx) => {
                        const isActive = activeCognitiveStep === idx;
                        const isPast = activeCognitiveStep > idx;

                        return (
                          <React.Fragment key={step.name}>
                            {idx > 0 && <ArrowRight className={`w-3.5 h-3.5 shrink-0 select-none ${isPast ? 'text-amber-500/50' : 'text-white/10'}`} />}
                            <div className="flex flex-col items-center">
                              <span
                                className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border transition-all duration-300 ${
                                  isActive
                                    ? 'bg-amber-500 text-black border-amber-500 font-extrabold shadow-md shadow-amber-500/20 scale-105'
                                    : isPast
                                    ? 'bg-white/[0.02] border-amber-500/20 text-amber-500/70'
                                    : 'bg-transparent border-transparent text-white/30'
                                }`}
                              >
                                {step.name.toUpperCase()}
                              </span>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>

                    {/* Active Step Description */}
                    <div className="flex items-center gap-2 mt-3 p-2 bg-amber-500/[0.02] border border-amber-500/10 rounded-sm">
                      <Cpu className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span className="text-xs text-white/40 font-mono">Current Activity:</span>
                      <strong className="text-xs text-amber-400 font-mono">
                        {[
                          'Polling multi-agent event bus & telemetry logs...',
                          'Re-indexing semantic knowledge graph and parsing local buffers...',
                          'Retrieving working & episodic memory segments with importance > 5...',
                          'Synthesizing abductive goals based on organizational triggers...',
                          'Decomposing high-level mission into parallel/sequential execution DAG...',
                          'Allocating tasks across specialists (Overlord, Coder, Sentinel)...',
                          'Dispatching tasks into sandboxed virtualization containers...',
                          'Evaluating AST and checking deductive compliance policies...',
                          'Calculating Quality Index, Hallucination risk, and latency footprint...',
                          'Extracting repetitive usage patterns and saving to Cortex memories...',
                          'Optimizing circuit breaker trip-points and saving rules to storage...'
                        ][activeCognitiveStep]}
                      </strong>
                    </div>
                  </div>

                  {/* Dual Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-left">
                    {/* Left: Explainable Decisions (Cognitive Trace) */}
                    <div className="lg:col-span-6 border border-white/5 bg-[#0a0a0c]/60 rounded-lg p-4 space-y-4 max-h-[460px] overflow-y-auto custom-scrollbar">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                          <Fingerprint className="w-4 h-4 text-cyan-400" />
                          Explainable Reasoning Audit Trail
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/15 px-2 py-0.5 rounded-full">
                          {cognitiveDecisions.length} Decisions Locked
                        </span>
                      </div>

                      {cognitiveDecisions.length === 0 ? (
                        <div className="text-xs text-white/30 text-center py-12">
                          No cognitive decisions recorded yet. Run a mission to trigger autonomous reasoning.
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {cognitiveDecisions.map((dec) => (
                            <div key={dec.id} className="p-3 bg-[#0c0c0e] border border-white/5 rounded-sm space-y-2.5">
                              <div className="flex justify-between items-start">
                                <div className="truncate pr-2">
                                  <span className="text-xs font-bold text-white block truncate">{dec.choice}</span>
                                  <span className="text-[9px] font-mono text-cyan-400 uppercase mt-0.5 inline-block bg-cyan-500/5 border border-cyan-500/15 px-1.5 py-0.5 rounded-sm">
                                    {dec.decisionType}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono text-white/30 shrink-0">{new Date(dec.timestamp).toLocaleTimeString()}</span>
                              </div>

                              <p className="text-xs text-white/60 leading-relaxed bg-black/40 p-2 border border-white/[0.02] rounded-sm">
                                {dec.explanation}
                              </p>

                              <div className="pt-2 border-t border-white/[0.03] space-y-1.5">
                                <span className="text-[9px] font-mono text-white/30 uppercase block">Alternative Approaches Evaluated:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {dec.alternatives?.map((alt: string, i: number) => (
                                    <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/[0.03]">
                                      {alt}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Self-Reflection & Proactive Radar */}
                    <div className="lg:col-span-6 flex flex-col gap-4 max-h-[460px] overflow-y-auto custom-scrollbar">
                      {/* Row 1: Self-Reflection Engine Diagnostics */}
                      <div className="border border-white/5 rounded-lg p-4 space-y-3 bg-[#0a0a0c]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            Self-Reflection Engine Diagnostics
                          </span>
                          {activeReflection && (
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-sm">
                              Score: {activeReflection.qualityScore}/100
                            </span>
                          )}
                        </div>

                        {activeReflection ? (
                          <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3 text-left">
                              <div className="p-2.5 bg-black/30 border border-white/[0.02] rounded-sm space-y-1">
                                <span className="text-white/30 text-[9px] uppercase font-mono block">Knowledge Quality</span>
                                <strong className="text-white text-sm font-mono">{activeReflection.knowledgeQuality}%</strong>
                              </div>
                              <div className="p-2.5 bg-black/30 border border-white/[0.02] rounded-sm space-y-1">
                                <span className="text-white/30 text-[9px] uppercase font-mono block">Memory Utilization</span>
                                <strong className="text-white text-sm font-mono">{activeReflection.memoryUtilization}%</strong>
                              </div>
                              <div className="p-2.5 bg-black/30 border border-white/[0.02] rounded-sm space-y-1">
                                <span className="text-white/30 text-[9px] uppercase font-mono block">Research Accuracy</span>
                                <strong className="text-white text-sm font-mono">{activeReflection.researchAccuracy}%</strong>
                              </div>
                              <div className="p-2.5 bg-black/30 border border-white/[0.02] rounded-sm space-y-1">
                                <span className="text-white/30 text-[9px] uppercase font-mono block">Execution Efficiency</span>
                                <strong className="text-white text-sm font-mono">{activeReflection.executionEfficiency}%</strong>
                              </div>
                            </div>

                            {/* Suggestions */}
                            <div className="space-y-1.5 border-t border-white/[0.03] pt-2 text-left">
                              <span className="text-[9px] font-mono text-white/30 uppercase block">Optimization Suggestions:</span>
                              <ul className="space-y-1 list-disc list-inside text-white/60 text-[11px] leading-relaxed">
                                {activeReflection.optimizationSuggestions?.map((s: string, i: number) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-white/30 text-center py-6">
                            Waiting for reflection data...
                          </div>
                        )}
                      </div>

                      {/* Row 2: Proactive Opportunity & Safety Alerts */}
                      <div className="border border-white/5 rounded-lg p-4 space-y-3 bg-[#0a0a0c]">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Proactive Safety & Resiliency Center
                          </span>
                        </div>

                        <div className="space-y-3">
                          {/* Compliance alerts / policies */}
                          <div className="space-y-1.5 text-left">
                            <span className="text-[9px] font-mono text-white/30 uppercase block">Active Policies & Security Directives:</span>
                            <div className="space-y-1.5">
                              {cognitivePolicies.map((policy) => (
                                <div key={policy.id} className="flex justify-between items-center text-[11px] p-2 bg-white/[0.01] border border-white/[0.03] rounded-sm">
                                  <div>
                                    <span className="text-white block font-medium">{policy.name}</span>
                                    <code className="text-cyan-400/80 text-[10px] font-mono">{policy.expression}</code>
                                  </div>
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 uppercase">
                                    ACTIVE
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Circuit Breakers */}
                          <div className="space-y-1.5 border-t border-white/[0.03] pt-2 text-left">
                            <span className="text-[9px] font-mono text-white/30 uppercase block">Connector Circuit Breakers:</span>
                            <div className="grid grid-cols-2 gap-2">
                              {circuitBreakers.map((breaker) => (
                                <div key={breaker.serviceName} className="flex items-center justify-between p-2 bg-white/[0.01] border border-white/[0.03] rounded-sm">
                                  <span className="text-[10px] font-mono text-white/60 truncate" title={breaker.serviceName}>
                                    {breaker.serviceName}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${breaker.state === 'closed' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className="text-[9px] font-mono text-white/40 uppercase">{breaker.state}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cost Intelligence statement */}
                          {cognitiveCosts && (
                            <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-sm flex justify-between items-center text-xs text-left">
                              <div>
                                <span className="text-white/30 text-[9px] uppercase font-mono block">Cost Intelligence Budget Statement</span>
                                <span className="text-white font-medium block">Average Cost: ${cognitiveCosts.averageCost} / execution</span>
                              </div>
                              <span className="text-amber-500 font-mono font-bold">${(cognitiveCosts.tokenCost + cognitiveCosts.missionCost).toFixed(4)} Total</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ARTIFACTS SUB-TAB */}
              {activeSubTab === 'artifacts' && (
                <div className="space-y-4 flex-1 flex flex-col justify-between" id="artifact-vault-tab">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* List of artifacts */}
                    <div className="md:col-span-5 border border-white/5 rounded-md p-3 max-h-[280px] overflow-y-auto space-y-2">
                      <span className="text-[10px] font-mono text-white/40 uppercase block mb-2">Vault Storage Files</span>
                      {activeMission.artifacts.length === 0 ? (
                        <div className="text-xs text-white/30 text-center py-8">
                          No artifacts generated for this mission yet.
                        </div>
                      ) : (
                        activeMission.artifacts.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => setSelectedArtifactId(art.id)}
                            className={`p-2 rounded-sm border cursor-pointer flex items-center justify-between text-left transition-all ${
                              selectedArtifactId === art.id
                                ? 'bg-white/5 border-amber-500/40 text-white'
                                : 'bg-transparent border-white/5 text-white/50 hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {art.type === 'config' || art.type === 'source_code' ? (
                                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                              ) : (
                                <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                              )}
                              <span className="text-xs font-mono truncate">{art.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/30 shrink-0">{art.size}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Preview Artifact */}
                    <div className="md:col-span-7 border border-white/5 bg-[#070707] rounded-md p-3.5 flex flex-col min-h-[220px]">
                      {(() => {
                        const currentArt = activeMission.artifacts.find(a => a.id === selectedArtifactId) || activeMission.artifacts[0];
                        if (!currentArt) {
                          return (
                            <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-xs">
                              <Database className="w-6 h-6 stroke-1 mb-2" />
                              Select an artifact to examine integrity lineage
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-3 flex-1 flex flex-col justify-between text-left">
                            <div className="flex justify-between items-start border-b border-white/5 pb-2">
                              <div>
                                <span className="text-xs font-bold text-white block truncate">{currentArt.name}</span>
                                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5 inline-block bg-cyan-500/5 border border-cyan-500/15 px-1.5 py-0.5 rounded-sm">
                                  {currentArt.type}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] font-mono text-white/40 block">Integrity Sign</span>
                                <span className="text-[9px] font-mono text-amber-500/80 font-bold block">{currentArt.hash}</span>
                              </div>
                            </div>

                            <div className="text-[10px] font-mono text-white/40 space-y-1">
                              <div><span className="text-white/20">Generated:</span> {new Date(currentArt.createdAt).toLocaleString()}</div>
                              <div><span className="text-white/20">Lineage:</span> {currentArt.lineage.join(' ➔ ')}</div>
                            </div>

                            <div className="flex-1 bg-black/60 rounded border border-white/5 p-3 font-mono text-xs text-white/70 overflow-y-auto max-h-[130px] min-h-[90px] custom-scrollbar text-left">
                              {currentArt.content ? (
                                <pre className="whitespace-pre-wrap">{currentArt.content}</pre>
                              ) : (
                                <div className="text-white/30 text-center py-6">
                                  Binary document format (PDF/Docx). Content hashed & indexed to Semantic Vector database.
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="border border-[#10B981]/20 bg-[#10B981]/[0.02] p-3 rounded-lg text-left">
                    <span className="text-[10px] font-mono text-[#10B981] uppercase font-bold flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Dynamic Learning & Memory Recommendation
                    </span>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Cortex compiled execution telemetry from mission metrics. Recommendation: "Sentinel core model rotation during Stage 2 database audits improves total generation speed and token economy by <strong className="text-[#10B981]">14.2%</strong>. Optimization applied to standard templates."
                    </p>
                  </div>
                </div>
              )}

              {/* EVENT TRIGGERS SUB-TAB */}
              {activeSubTab === 'triggers' && (
                <div className="space-y-4 text-left flex-1 flex flex-col justify-between" id="event-triggers-tab">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left: Continuous Systems Watchers List */}
                    <div className="md:col-span-7 space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#10B981]" />
                          Continuous System Watchers
                        </span>
                        <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full font-bold">
                          {watchers.length} Active
                        </span>
                      </div>

                      <div className="space-y-2">
                        {watchers.map((w) => (
                          <div key={w.id} className="p-3 bg-black/40 border border-white/5 rounded-md flex justify-between items-center gap-3">
                            <div className="space-y-1 truncate">
                              <div className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${w.active ? 'bg-[#10B981] animate-pulse' : 'bg-white/20'}`} />
                                <span className="text-xs font-bold text-white font-mono">{w.id.toUpperCase()}</span>
                                <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded">
                                  {w.type.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[10px] text-white/50 truncate">
                                Target: <span className="font-mono text-white/70">{w.target}</span>
                              </p>
                              <p className="text-[9px] text-white/30 truncate">
                                Expression: <span className="font-mono text-white/40">{w.expression}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => handleToggleWatcher(w.id)}
                                className={`px-2 py-1 text-[9px] font-mono font-bold rounded-sm border transition-all ${
                                  w.active
                                    ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 hover:bg-[#10B981]/20'
                                    : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                }`}
                              >
                                {w.active ? 'ACTIVE' : 'IDLE'}
                              </button>
                              <button
                                onClick={() => handleTriggerWatcherEvent(w.type, w.target)}
                                disabled={!w.active}
                                title="Instantly trigger simulation event"
                                className="p-1 rounded-sm border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all"
                              >
                                <Send className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right: Extracted Learning Playbooks (Procedures) */}
                    <div className="md:col-span-5 space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pl-1 border-l border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-amber-500" />
                          Extracted Playbooks
                        </span>
                        <span className="text-[10px] font-mono text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full font-bold">
                          {playbooks.length} Saved
                        </span>
                      </div>

                      <div className="space-y-2">
                        {playbooks.map((p) => (
                          <div key={p.id} className="p-2.5 bg-[#0e0e11] border border-white/5 rounded-md space-y-1 text-left">
                            <div className="flex justify-between items-start gap-2">
                              <span className="text-xs font-bold text-white font-mono truncate">{p.name}</span>
                              <span className="text-[9px] font-mono text-white/30 shrink-0">{p.confidenceScore}% conf</span>
                            </div>
                            <p className="text-[10px] text-white/60 line-clamp-2">
                              {p.triggerCondition}
                            </p>
                            <div className="flex justify-between items-center pt-1.5 border-t border-white/[0.03] mt-1">
                              <span className="text-[9px] font-mono text-white/30 uppercase">
                                {p.steps.length} procedural nodes
                              </span>
                              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 px-1.5 py-0.2 rounded-sm uppercase">
                                {p.sourceTemplate}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Manual event mock trigger deck */}
                  <div className="border border-white/5 bg-[#070709] p-3.5 rounded-lg space-y-3 text-left">
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display block">
                      Rapid Event-Mock Simulator Deck
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        onClick={() => handleTriggerWatcherEvent('git', 'git-push:main')}
                        className="p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 rounded-md transition-all text-left flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">git push</span>
                        <span className="text-[10px] text-white/60 mt-0.5">Repo main hook</span>
                      </button>

                      <button
                        onClick={() => handleTriggerWatcherEvent('webhook', 'post-webhook')}
                        className="p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 rounded-md transition-all text-left flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest font-bold">webhook POST</span>
                        <span className="text-[10px] text-white/60 mt-0.5">Infra web alert</span>
                      </button>

                      <button
                        onClick={() => handleTriggerWatcherEvent('cron', 'cron-schedule')}
                        className="p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 rounded-md transition-all text-left flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold">cron schedule</span>
                        <span className="text-[10px] text-white/60 mt-0.5">Competitor loop</span>
                      </button>

                      <button
                        onClick={() => handleTriggerWatcherEvent('upload', 'file-upload')}
                        className="p-2.5 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 rounded-md transition-all text-left flex flex-col justify-between"
                      >
                        <span className="text-[10px] font-mono text-[#10B981] uppercase tracking-widest font-bold">file upload</span>
                        <span className="text-[10px] text-white/60 mt-0.5">Contract PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TESTING SUB-TAB */}
              {activeSubTab === 'testing' && (
                <div className="space-y-4 text-left flex-1 flex flex-col justify-between" id="qa-suite-tab">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider font-display block mb-1">
                      Cortex Verification & QA Suite
                    </span>
                    <p className="text-[11px] text-white/55 leading-relaxed mb-3">
                      Conduct on-demand system auditing, stress validation, and zero-trust sandbox containment verification across Phase 5 structures.
                    </p>

                    {/* Buttons to execute tests */}
                    <div className="flex flex-wrap gap-2 mb-4 select-none">
                      <button
                        onClick={() => runTestSuite('unit')}
                        disabled={testSuite.isRunning}
                        className="px-2.5 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono rounded text-white flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                        Unit Tests
                      </button>
                      <button
                        onClick={() => runTestSuite('integration')}
                        disabled={testSuite.isRunning}
                        className="px-2.5 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono rounded text-white flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <Network className="w-3.5 h-3.5 text-amber-500" />
                        Integration
                      </button>
                      <button
                        onClick={() => runTestSuite('e2e')}
                        disabled={testSuite.isRunning}
                        className="px-2.5 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono rounded text-white flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        E2E Walkthrough
                      </button>
                      <button
                        onClick={() => runTestSuite('security')}
                        disabled={testSuite.isRunning}
                        className="px-2.5 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono rounded text-white flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                        Security Audit
                      </button>
                      <button
                        onClick={() => runTestSuite('stress')}
                        disabled={testSuite.isRunning}
                        className="px-2.5 py-1.5 border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono rounded text-white flex items-center gap-1 transition-all disabled:opacity-50"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                        Stress Test (1K Jobs)
                      </button>
                    </div>

                    {/* Results console */}
                    <div className="bg-black/80 rounded border border-white/5 p-4 min-h-[150px] max-h-[180px] overflow-y-auto font-mono text-[11px] text-white/80 space-y-1.5 custom-scrollbar">
                      {testSuite.results.map((r, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-[#10B981] select-none">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}

                      {testSuite.isRunning && (
                        <div className="flex items-center gap-2 pt-2 text-cyan-400 select-none animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Executing verification sequence: {testSuite.progress}% complete...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rendering load graph on stress tests */}
                  {testSuite.type === 'stress' && testSuite.stressData.length > 0 && (
                    <div className="border border-white/5 bg-[#070707] p-3 rounded-lg animate-fade-in">
                      <span className="text-[10px] font-mono text-white/40 block mb-2 uppercase">Graceful Degradation curve telemetry</span>
                      {/* Interactive SVG graph */}
                      <svg className="w-full h-24 overflow-visible" viewBox="0 0 500 100">
                        {/* Grid lines */}
                        <line x1="0" y1="20" x2="500" y2="20" stroke="white" strokeOpacity="0.05" strokeDasharray="3" />
                        <line x1="0" y1="55" x2="500" y2="55" stroke="white" strokeOpacity="0.05" strokeDasharray="3" />
                        <line x1="0" y1="90" x2="500" y2="90" stroke="white" strokeOpacity="0.05" strokeDasharray="3" />
                        
                        {/* Curve Paths */}
                        <path
                          d={`M ${testSuite.stressData.map((d, i) => `${(i * 50)} ${100 - (d.throughput / 1.5)}`).join(' L ')}`}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="2"
                        />
                        <path
                          d={`M ${testSuite.stressData.map((d, i) => `${(i * 50)} ${100 - (d.latency / 5)}`).join(' L ')}`}
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeDasharray="4"
                        />

                        {/* Interactive dots */}
                        {testSuite.stressData.map((d, i) => (
                          <g key={i}>
                            <circle cx={i * 50} cy={100 - (d.throughput / 1.5)} r="3" fill="#10B981" />
                            <circle cx={i * 50} cy={100 - (d.latency / 5)} r="3" fill="#EF4444" />
                          </g>
                        ))}
                      </svg>
                      <div className="flex justify-between mt-2.5 font-mono text-[9px]">
                        <span className="text-[#10B981]">● Throughput (Jobs/s)</span>
                        <span className="text-red-500">● Latency (ms)</span>
                        <span className="text-white/30">Load: {testSuite.stressData[testSuite.stressData.length - 1]?.load} parallel missions</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* ------------------ LAUNCH PANEL SIDE-OVER SLIDE ------------------ */}
      <AnimatePresence>
        {showCreatePanel && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-end z-50">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setShowCreatePanel(false)} />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#141414] border-l border-white/5 h-full p-6 shadow-2xl flex flex-col justify-between select-none z-10"
              id="spawn-mission-panel"
            >
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <span className="text-sm font-bold uppercase tracking-wider text-white font-display flex items-center gap-1.5">
                    <Rocket className="w-4 h-4 text-amber-500" />
                    Deploy Autonomous Mission
                  </span>
                  <button
                    onClick={() => setShowCreatePanel(false)}
                    className="text-white/40 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateMission} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-white/40 uppercase block">Mission Objective</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Conduct daily system prompt security audit"
                      value={newMissionName}
                      onChange={e => setNewMissionName(e.target.value)}
                      className="w-full px-3 py-2 rounded-sm bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-white/40 uppercase block">Workflow Context & Instructions</label>
                    <textarea
                      placeholder="Specify customized goals, boundary rules, or target files..."
                      value={newMissionDesc}
                      onChange={e => setNewMissionDesc(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-sm bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-white/40 uppercase block">Priority Level</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewMissionPriority(p)}
                          className={`py-1.5 text-[10px] font-mono uppercase rounded-sm border transition-all ${
                            newMissionPriority === p
                              ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-bold'
                              : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-white/40 uppercase block">Base Template Graph</label>
                    <select
                      value={newMissionTemplate}
                      onChange={e => setNewMissionTemplate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-xs text-white px-3 py-2 rounded-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="saas">Autonomous SaaS Builder Lifecycle (6 Nodes)</option>
                      <option value="radar">Intellishield Research Pipeline (3 Nodes)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-white/95 py-2.5 rounded-sm text-xs font-bold uppercase mt-6 tracking-wide transition-all select-none"
                  >
                    Deploy to Queue
                  </button>
                </form>
              </div>

              <div className="border-t border-white/5 pt-4 text-left">
                <span className="text-[10px] font-mono text-white/30 block leading-relaxed">
                  NOTE: Launching a mission registers the task in the primary scheduling database, allocations are calculated synchronously, and execution begins immediately based on concurrency priorities.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
