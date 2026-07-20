import React, { useState, useEffect } from 'react';
import {
  Server,
  Shuffle,
  RefreshCw,
  Play,
  Pause,
  Lock,
  Plus,
  CheckCircle,
  Cpu,
  Layers,
  Globe,
  Sliders,
  TestTube,
  Zap,
  Boxes,
  FileCheck,
  Eye,
  Settings,
  Key,
  Compass,
  Search,
  Check,
  Copy,
  GitFork,
  History,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight,
  Database,
  BarChart4,
  AlertTriangle,
  Download,
  Flame,
  Power,
  RotateCcw,
  Network
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Mission, MissionState, LogEntry } from '../types';

interface OperationsCenterProps {
  isDark: boolean;
  onAddLog: (log: LogEntry) => void;
}

export default function OperationsCenter({ isDark, onAddLog }: OperationsCenterProps) {
  // Operational state tabs
  const [activeTab, setActiveTab] = useState<'engine' | 'workers' | 'checkpoints' | 'security' | 'plugins' | 'qa'>('engine');

  // Simulator/Engine running state
  const [isEngineActive, setIsEngineActive] = useState<boolean>(true);
  const [loadFactor, setLoadFactor] = useState<number>(74); // %
  const [activeLeader, setActiveLeader] = useState<string>('cortex-core-primary-us-east');
  const [regionRouting, setRegionRouting] = useState<'latency' | 'failover' | 'geo'>('latency');
  const [activeRegion, setActiveRegion] = useState<string>('us-east-1');
  const [replicationStatus, setReplicationStatus] = useState<'synced' | 'replicating' | 'paused'>('synced');

  // Search & Filters
  const [workerQuery, setWorkerQuery] = useState<string>('');
  const [securityQuery, setSecurityQuery] = useState<string>('');
  const [pluginFilter, setPluginFilter] = useState<'all' | 'installed' | 'available'>('all');

  // Sub-metrics and resource allocations
  const [metrics, setMetrics] = useState({
    cpu: 64,
    memory: 78,
    storage: 412, // GB
    bandwidth: 842, // KB/s
    latency: 34, // ms
    totalCosts: 184.22,
    budgetLimit: 500,
    apiRequests: 14522,
    failureCount: 4,
    selfHealedCount: 12
  });

  // Checkpoint & snapshot states
  const [activeMissions, setActiveMissions] = useState<any[]>([
    { id: 'm-101', name: 'Intellishield Threat Vector Scan', state: 'running', progress: 68, activeStep: 'Analyze zero-day payload', priority: 'critical' },
    { id: 'm-102', name: 'Competitor SaaS Price Synthesizer', state: 'paused', progress: 40, activeStep: 'Formulate price matrix API', priority: 'medium' },
    { id: 'm-103', name: 'Auto-Refactoring Core Microkernel', state: 'running', progress: 15, activeStep: 'Inject AST code parser nodes', priority: 'high' }
  ]);

  const [snapshots, setSnapshots] = useState<any[]>([
    { id: 'snap_1', name: 'Threat Scan Pre-Sandbox Execute', timestamp: '2026-07-19T06:40:00Z', missionId: 'm-101', step: 'Sandbox Isolation', hash: 'e3b0c442' },
    { id: 'snap_2', name: 'SaaS Synthesizer Initial Memory Build', timestamp: '2026-07-19T05:30:00Z', missionId: 'm-102', step: 'Scrape competent portals', hash: 'f8d129fa' },
    { id: 'snap_3', name: 'AST Code Node Ingress Base', timestamp: '2026-07-19T07:05:00Z', missionId: 'm-103', step: 'Load AST configurations', hash: 'a571f8ce' }
  ]);

  // Worker Registry
  const [workers, setWorkers] = useState<any[]>([
    { id: 'worker-us-01', name: 'Cortex Node USA 01', type: 'Engineering', activeMission: 'm-103', cpu: 78, mem: 62, latency: 28, successRate: 99.4, runTime: 12.4, status: 'healthy', capabilities: ['Code Gen', 'RAG', 'AST Parsing'] },
    { id: 'worker-us-02', name: 'Cortex Node USA 02', type: 'QA', activeMission: 'None (Idle)', cpu: 4, mem: 41, latency: 31, successRate: 98.7, runTime: 8.9, status: 'healthy', capabilities: ['E2E Testing', 'Load Injection'] },
    { id: 'worker-eu-01', name: 'Cortex Node EU 01', type: 'Research', activeMission: 'm-102', cpu: 94, mem: 88, latency: 45, successRate: 99.1, runTime: 24.1, status: 'healthy', capabilities: ['Web Crawl', 'SaaS Sync'] },
    { id: 'worker-eu-02', name: 'Cortex Node EU 02', type: 'Security', activeMission: 'm-101', cpu: 82, mem: 71, latency: 38, successRate: 100.0, runTime: 18.5, status: 'healthy', capabilities: ['Sandbox Exec', 'Threat Audit'] },
    { id: 'worker-ap-01', name: 'Cortex Node APAC 01', type: 'Security', activeMission: 'None (Idle)', cpu: 12, mem: 35, latency: 85, successRate: 95.2, runTime: 15.2, status: 'degraded', capabilities: ['Threat Audit'] }
  ]);

  const [workerLogs, setWorkerLogs] = useState<string[]>([
    '[SYSTEM] US-01 thread cluster spawned.',
    '[US-01] Received task block: Analyze zero-day payload.',
    '[EU-02] Conducting sandbox execution of virtual node artifact.',
    '[SYSTEM] Leader US-EAST node heartbeat verified. Offset: +2ms.',
    '[AP-01] Notice: Network routing latency exceeds 80ms threshold.',
    '[EU-01] Synthesizer parsed competitor price ledger successfully.'
  ]);

  // Queue pools metrics
  const [queues, setQueues] = useState<any[]>([
    { name: 'Execution Queue', size: 14, priority: 'Normal', active: true, throughput: '12.4 jobs/s' },
    { name: 'Priority Queue', size: 3, priority: 'Critical', active: true, throughput: '4.8 jobs/s' },
    { name: 'Background Queue', size: 45, priority: 'Low', active: true, throughput: '2.1 jobs/s' },
    { name: 'Retry Queue', size: 2, priority: 'High', active: true, throughput: '0.2 jobs/s' },
    { name: 'Delayed Queue', size: 8, priority: 'Normal', active: true, throughput: '1.5 jobs/s' },
    { name: 'Approval Queue', size: 1, priority: 'Critical', active: true, throughput: 'Manual Hold' },
    { name: 'Dead Letter Queue (DLQ)', size: 0, priority: 'Urgent', active: false, throughput: '0 failures/m' }
  ]);

  // Agent scaling settings
  const [agentPools, setAgentPools] = useState<any[]>([
    { role: 'Engineering Agents', count: 12, max: 50, priority: 'High', memorySync: 'Synced' },
    { role: 'Research Agents', count: 8, max: 30, priority: 'Medium', memorySync: 'Synced' },
    { role: 'Security Agents', count: 6, max: 20, priority: 'Urgent', memorySync: 'Real-time' },
    { role: 'QA & Stress Agents', count: 4, max: 15, priority: 'Low', memorySync: 'Periodic' }
  ]);

  // Distributed consensus actions log
  const [consensusLogs, setConsensusLogs] = useState<any[]>([
    { id: 'c-1', topic: 'Select US-East sandbox instance', voters: 4, outcome: 'Passed (92%)', timestamp: '2026-07-19T07:11:00Z' },
    { id: 'c-2', topic: 'Commit refactor payload to Main branch', voters: 4, outcome: 'Passed (100%)', timestamp: '2026-07-19T07:08:00Z' }
  ]);

  // Vault simulation
  const [vaultKeys, setVaultKeys] = useState<any[]>([
    { id: 'key_1', name: 'GEMINI_API_SECRET_NODE', rotatedAt: '2026-07-18T12:00:00Z', type: 'AES-256' },
    { id: 'key_2', name: 'WARBORN_CORE_DATABASE_URL', rotatedAt: '2026-07-15T08:30:00Z', type: 'AES-GCM' },
    { id: 'key_3', name: 'OAUTH_SLACK_CONNECTOR_CRED', rotatedAt: '2026-07-01T00:00:00Z', type: 'RSA-4096' }
  ]);

  // Security configuration parameters
  const [securityConfig, setSecurityConfig] = useState({
    encryptionAtRest: true,
    encryptionInTransit: true,
    ssoEnabled: true,
    mfaEnforced: true,
    tenantIsolation: 'Strict Cryptographic Partition',
    abacPolicy: 'Role:Developer & Project:Active'
  });

  // Extensibility & plugin marketplace
  const [plugins, setPlugins] = useState<any[]>([
    { id: 'plug_1', name: 'Slack MCP Broadcast Router', publisher: 'Warborn Core', status: 'installed', permissions: ['Network', 'OAuth'], version: '2.1.0' },
    { id: 'plug_2', name: 'Kubernetes Cluster Provisioner', publisher: 'CloudNative Ops', status: 'installed', permissions: ['Compute', 'Storage'], version: '1.4.2' },
    { id: 'plug_3', name: 'AES Artifact Vault Syncer', publisher: 'IntelliShield Tech', status: 'installed', permissions: ['Storage', 'Vault'], version: '1.0.1' },
    { id: 'plug_4', name: 'HuggingFace Custom Embedding Injector', publisher: 'AI Labs', status: 'available', permissions: ['Network'], version: '3.0.0' },
    { id: 'plug_5', name: 'Prometheus Telemetry Scraper', publisher: 'Systems Core', status: 'available', permissions: ['Metrics', 'Network'], version: '2.2.1' }
  ]);

  // Chaos Test suites
  const [chaosStatus, setChaosStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [chaosLog, setChaosLog] = useState<string[]>([]);

  // Simulation loop for dynamic telemetry variations
  useEffect(() => {
    if (!isEngineActive) return;
    const interval = setInterval(() => {
      // Small metric fluctuations
      setMetrics((prev) => {
        const cpuVar = Math.min(95, Math.max(30, prev.cpu + Math.floor(Math.random() * 9) - 4));
        const memVar = Math.min(95, Math.max(40, prev.memory + Math.floor(Math.random() * 5) - 2));
        const storageVar = prev.storage + (Math.random() > 0.9 ? 1 : 0);
        const bandVar = Math.min(2000, Math.max(200, prev.bandwidth + Math.floor(Math.random() * 41) - 20));
        const latencyVar = Math.min(120, Math.max(10, prev.latency + Math.floor(Math.random() * 7) - 3));
        const reqVar = prev.apiRequests + Math.floor(Math.random() * 5) + 1;
        const costsVar = prev.totalCosts + (Math.random() * 0.005);
        return {
          ...prev,
          cpu: cpuVar,
          memory: memVar,
          storage: storageVar,
          bandwidth: bandVar,
          latency: latencyVar,
          apiRequests: reqVar,
          totalCosts: parseFloat(costsVar.toFixed(4))
        };
      });

      // Fluctuate Worker metrics
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) => {
          if (w.status === 'degraded') {
            return {
              ...w,
              cpu: Math.min(90, Math.max(5, w.cpu + Math.floor(Math.random() * 5) - 2)),
              mem: Math.min(90, Math.max(20, w.mem + Math.floor(Math.random() * 3) - 1)),
              latency: Math.min(100, Math.max(70, w.latency + Math.floor(Math.random() * 11) - 5))
            };
          }
          return {
            ...w,
            cpu: Math.min(98, Math.max(5, w.cpu + Math.floor(Math.random() * 15) - 7)),
            mem: Math.min(95, Math.max(15, w.mem + Math.floor(Math.random() * 7) - 3)),
            latency: Math.min(50, Math.max(5, w.latency + Math.floor(Math.random() * 5) - 2))
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isEngineActive]);

  // Logging utility wrapper
  const handleActionLog = (module: string, message: string, level: 'info' | 'warn' | 'error' | 'trace' = 'info') => {
    onAddLog({
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    });
  };

  // Checkpoint actions
  const triggerCheckpoint = (missionId: string) => {
    const targetMission = activeMissions.find(m => m.id === missionId);
    if (!targetMission) return;

    const snapId = `snap_${Date.now().toString().substring(8)}`;
    const newSnapshot = {
      id: snapId,
      name: `${targetMission.name} Custom Snapshot`,
      timestamp: new Date().toISOString(),
      missionId: targetMission.id,
      step: targetMission.activeStep,
      hash: Math.random().toString(16).substring(2, 10)
    };

    setSnapshots([newSnapshot, ...snapshots]);
    handleActionLog('CHECKPOINT', `Incremental snapshot [${snapId}] successfully written for mission [${targetMission.name}]. Metadata catalogued.`, 'info');
  };

  const resumeFromCheckpoint = (snapshotId: string) => {
    const snap = snapshots.find(s => s.id === snapshotId);
    if (!snap) return;

    setActiveMissions(prev =>
      prev.map(m => m.id === snap.missionId ? { ...m, state: 'running', progress: Math.max(m.progress - 10, 10) } : m)
    );
    handleActionLog('CHECKPOINT', `Execution branched & rollbacked to checkpoint snapshot [${snapshotId}] (Hash: ${snap.hash}). Execution thread resumed.`, 'warn');
  };

  const branchExecution = (snapshotId: string) => {
    const snap = snapshots.find(s => s.id === snapshotId);
    if (!snap) return;

    const clonedId = `m-${Math.floor(100 + Math.random() * 900)}`;
    const clonedMission = {
      id: clonedId,
      name: `[BRANCH] ${snap.name}`,
      state: 'running',
      progress: 30,
      activeStep: `Branch of Step: ${snap.step}`,
      priority: 'medium'
    };

    setActiveMissions([...activeMissions, clonedMission]);
    handleActionLog('CHECKPOINT', `Branched execution state from checkpoint [${snapshotId}]. Created replica thread context [${clonedId}].`, 'info');
  };

  // Worker action trigger
  const scaleWorkerPool = () => {
    const workerId = `worker-node-${Math.floor(10 + Math.random() * 90)}`;
    const capabilities = ['Sandbox Exec', 'Vector Index', 'RAG Engine'];
    const newWorker = {
      id: workerId,
      name: `Autonomous Scaling Worker ${workers.length + 1}`,
      type: 'Engineering',
      activeMission: 'None (Idle)',
      cpu: 1,
      mem: 12,
      latency: 18,
      successRate: 100.0,
      runTime: 0.0,
      status: 'healthy',
      capabilities
    };

    setWorkers([...workers, newWorker]);
    setWorkerLogs([`[SYSTEM] Elastic horizontal scale trigger registered. Booting target container ${workerId}...`, ...workerLogs]);
    handleActionLog('ORCHESTRATOR', `Triggered automatic scaling for worker thread cluster. Provisioned workspace unit [${workerId}].`, 'info');
  };

  // Rotates a key in the Vault
  const handleRotateKey = (keyId: string) => {
    setVaultKeys(prev =>
      prev.map(k => k.id === keyId ? { ...k, rotatedAt: new Date().toISOString() } : k)
    );
    handleActionLog('SECURITY', `Vault credentials rotate request passed. Cryptographic block updated for Key ID [${keyId}].`, 'warn');
  };

  // Simulated consensus voting
  const triggerConsensusVote = () => {
    const topics = [
      'Upgrade local LLM context limit to 200k',
      'Migrate database lock ownership to us-west regional partition',
      'Approve code-node security vulnerability mitigation patch'
    ];
    const pickedTopic = topics[Math.floor(Math.random() * topics.length)];
    const id = `c-${consensusLogs.length + 1}`;
    const outcomes = ['Passed (100%)', 'Passed (85%)', 'Rejected (33%)'];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    const newVote = {
      id,
      topic: pickedTopic,
      voters: 4,
      outcome,
      timestamp: new Date().toISOString()
    };

    setConsensusLogs([newVote, ...consensusLogs]);
    handleActionLog('CONSENSUS', `Distributed voting finalized. Topic: "${pickedTopic}" -> Output outcome: ${outcome}.`, 'info');
  };

  // Chaos testing trigger
  const runChaosTest = (scenario: 'failover' | 'cpu_spike' | 'dlq_inject') => {
    setChaosStatus('running');
    setChaosLog([`Initiating Chaos Monkey Suite. Scenario: [${scenario.toUpperCase()}]`]);

    setTimeout(() => {
      if (scenario === 'failover') {
        setActiveLeader('cortex-core-replica-eu-west');
        setRegionRouting('failover');
        setActiveRegion('eu-west-1');
        setReplicationStatus('replicating');
        setChaosLog(prev => [
          ...prev,
          `[0.8s] Injecting fault: Host region 'us-east-1' network blackhole simulation.`,
          `[1.6s] Circuit breaker tripped. Evicting master lease from cortex-core-primary-us-east.`,
          `[2.4s] Leader election activated. Quorum reached across remaining 3 global nodes.`,
          `[3.2s] Promoted replica 'cortex-core-replica-eu-west' to platform primary leader.`,
          `[4.0s] Geo-routing automatically updated. Self-healed active execution queues securely.`
        ]);
        setMetrics(prev => ({ ...prev, latency: 110, selfHealedCount: prev.selfHealedCount + 1 }));
        handleActionLog('CHAOS', 'Chaos testing: Regional failover simulated. Master lease evicted and promoted replica gracefully.', 'error');
      } else if (scenario === 'cpu_spike') {
        setMetrics(prev => ({ ...prev, cpu: 99, memory: 92 }));
        setWorkers(prev =>
          prev.map(w => w.id === 'worker-us-01' ? { ...w, cpu: 99, mem: 95 } : w)
        );
        setChaosLog(prev => [
          ...prev,
          `[1.0s] Injecting heavy workload AST-parsing loop on Worker US-01.`,
          `[2.0s] CPU load exceeded 95% critical threshold limit.`,
          `[3.0s] Elastic task throttling initiated. Shifting background queues to idle workers.`,
          `[4.0s] Auto-throttler and load-balancer active. Gracefully decoupled non-critical loops.`
        ]);
        handleActionLog('CHAOS', 'Chaos testing: Massive CPU resource spike injected. Dynamic load balancing and tasks re-routing verified.', 'warn');
      } else {
        // DLQ inject
        setQueues(prev =>
          prev.map(q => q.name.includes('DLQ') ? { ...q, size: 2, active: true } : q)
        );
        setChaosLog(prev => [
          ...prev,
          `[1.2s] Simulating database connection failure event inside Sandbox mission.`,
          `[2.4s] Max exponential retry (3 attempts) reached for node 'm-101_step_4'.`,
          `[3.6s] Evicting bad transaction frame. Dispatching corrupted mission block to Dead Letter Queue.`,
          `[4.5s] Alerts raised on telemetry console. Failure isolated from primary workspace clusters.`
        ]);
        setMetrics(prev => ({ ...prev, failureCount: prev.failureCount + 2 }));
        handleActionLog('CHAOS', 'Chaos testing: Sandbox failure injected. Bad transaction evicted and quarantined in Dead Letter Queue (DLQ).', 'error');
      }
      setChaosStatus('success');
    }, 3000);
  };

  // Re-sync all regions and leaders
  const handleResetChaos = () => {
    setActiveLeader('cortex-core-primary-us-east');
    setRegionRouting('latency');
    setActiveRegion('us-east-1');
    setReplicationStatus('synced');
    setQueues(prev =>
      prev.map(q => q.name.includes('DLQ') ? { ...q, size: 0, active: false } : q)
    );
    setChaosStatus('idle');
    setChaosLog([]);
    handleActionLog('CHAOS', 'Chaos scenario evicted. Global cluster state returned to optimal baseline parameters.', 'info');
  };

  // Compliance simulation PDF download
  const downloadComplianceReport = (standard: string) => {
    handleActionLog('COMPLIANCE', `Formulated dynamic compliance report payload for standard [${standard}]. Snapshot secure archive generated.`, 'info');
    alert(`[COMPLIANCE VERIFIER] Archiving logs for standard: ${standard}\nGenerating certified PDF hash with SHA-256 block protection.\nAudit result: PASS (No vulnerabilities, cryptographic isolation active).`);
  };

  // Filtered lists
  const filteredWorkers = workers.filter(w =>
    w.name.toLowerCase().includes(workerQuery.toLowerCase()) ||
    w.type.toLowerCase().includes(workerQuery.toLowerCase()) ||
    w.capabilities.some((c: string) => c.toLowerCase().includes(workerQuery.toLowerCase()))
  );

  const filteredPlugins = plugins.filter(p => {
    if (pluginFilter === 'installed') return p.status === 'installed';
    if (pluginFilter === 'available') return p.status === 'available';
    return true;
  });

  return (
    <div className="space-y-6" id="ops-center-view-wrapper">
      {/* ------------------ TITLE BAR ------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-gradient-to-br from-[#10B981] to-cyan-500 text-white shadow-lg">
              <Server className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight uppercase font-display text-white">
              Enterprise Operations Center
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Warborn Runtime V7 — Distributed cloud queues, real-time worker pools, multi-agent consensus telemetry, and zero-trust SecOps vault.
          </p>
        </div>

        {/* Global Action Deck */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-white/80">
            <span className={`w-2 h-2 rounded-full ${isEngineActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span>SCHEDULER STATUS: {isEngineActive ? 'ON' : 'OFF'}</span>
          </div>
          <button
            onClick={() => {
              setIsEngineActive(!isEngineActive);
              handleActionLog('SCHEDULER', `Global execution scheduler turned ${!isEngineActive ? 'ON' : 'OFF'}.`, !isEngineActive ? 'info' : 'warn');
            }}
            className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              isEngineActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {isEngineActive ? 'Suspend Scheduler' : 'Activate Scheduler'}
          </button>
        </div>
      </div>

      {/* ------------------ LIVE STATUS TELEMETRY DENSE GRID ------------------ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="ops-telemetry-grid">
        <div className="border border-white/5 bg-[#0D0D0D] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Global Leader Node</span>
          <div className="text-sm font-mono font-bold text-white mt-1 truncate" title={activeLeader}>
            {activeLeader.split('-').pop()?.toUpperCase() || 'US-EAST'}
          </div>
          <span className="text-[9px] font-mono text-[#10B981] mt-2 flex items-center gap-1">
            <Globe className="w-2.5 h-2.5" /> Region: {activeRegion}
          </span>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Throughput / Latency</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-md font-mono font-bold text-white">{(metrics.bandwidth / 10).toFixed(1)} / {metrics.latency}</span>
            <span className="text-[10px] text-white/40 font-mono">ms</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 mt-2 flex items-center gap-1">
            <Network className="w-2.5 h-2.5" /> Routing: {regionRouting.toUpperCase()}
          </span>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Elastic Cluster Load</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-md font-mono font-bold text-white">{metrics.cpu}% CPU</span>
            <span className="text-[10px] text-white/40 font-mono ml-1.5">| {metrics.memory}% RAM</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${metrics.cpu}%` }} />
          </div>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-3.5 rounded-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Accrued Operational Cost</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-md font-mono font-bold text-emerald-400">${metrics.totalCosts.toFixed(4)}</span>
          </div>
          <span className="text-[9px] font-mono text-white/40 mt-2">
            Budget limit: ${metrics.budgetLimit}
          </span>
        </div>

        <div className="border border-white/5 bg-[#0D0D0D] p-3.5 rounded-lg flex flex-col justify-between col-span-2 md:col-span-1">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Self-Healed Errors</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-md font-mono font-bold text-[#10B981]">{metrics.selfHealedCount}</span>
            <span className="text-[10px] text-red-500 font-mono">({metrics.failureCount} Isolated)</span>
          </div>
          <span className="text-[9px] font-mono text-[#10B981] mt-2 flex items-center gap-1">
            <CheckCircle className="w-2.5 h-2.5" /> Replication: {replicationStatus.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ------------------ INNER NAVIGATION TABS ------------------ */}
      <div className="flex border-b border-white/5 gap-1 overflow-x-auto select-none custom-scrollbar pb-1">
        {[
          { id: 'engine', label: 'Queues & Scheduler', icon: Shuffle },
          { id: 'workers', label: 'Worker Clusters', icon: Cpu },
          { id: 'checkpoints', label: 'State Checkpoints', icon: History },
          { id: 'security', label: 'SSO & Vault Security', icon: Shield },
          { id: 'plugins', label: 'Plugin Marketplace', icon: Boxes },
          { id: 'qa', label: 'QA Chaos Lab', icon: TestTube }
        ].map((btn) => {
          const BtnIcon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`px-4 py-2 border-b-2 font-display text-xs font-bold tracking-tight uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === btn.id
                  ? 'border-[#10B981] text-white bg-white/[0.02]'
                  : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
              }`}
            >
              <BtnIcon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* ------------------ ACTIVE PANEL VIEWPORT ------------------ */}
      <div className="min-h-[480px]">
        {/* TAB 1: DISTRIBUTED ENGINE & QUEUE STATUS */}
        {activeTab === 'engine' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Queues Table */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white">Distributed Execution Queues</span>
                    <p className="text-[10px] text-white/50">Simultaneous ingestion and prioritizing of autonomous pipeline jobs.</p>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded font-bold">
                    ACTIVE POOL
                  </span>
                </div>

                <div className="space-y-2.5">
                  {queues.map((q, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-md flex justify-between items-center gap-4 hover:border-white/10 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${q.active ? 'bg-[#10B981] animate-pulse' : 'bg-white/10'}`} />
                          <span className="text-xs font-bold text-white font-mono">{q.name}</span>
                          <span className={`text-[8px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded font-mono ${
                            q.priority === 'Critical' || q.priority === 'Urgent'
                              ? 'bg-red-500/10 text-red-400'
                              : q.priority === 'High'
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-white/5 text-white/40'
                          }`}>
                            {q.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50">Current pipeline buffer: <span className="text-white font-semibold font-mono">{q.size} pending</span></p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded">
                          {q.throughput}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Engine Rules & Locks */}
              <div className="lg:col-span-5 space-y-6">
                {/* Distributed Lock Manager */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                  <div className="pb-3 border-b border-white/5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-500" />
                      Distributed Lock Manager
                    </span>
                    <p className="text-[10px] text-white/50 mt-0.5">Avoids race-conditions across isolated database partitions.</p>
                  </div>

                  <div className="space-y-2 font-mono text-[10px]">
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded flex justify-between">
                      <span className="text-white/60">LOCK_KEY: ast-refactor-ast</span>
                      <span className="text-[#10B981]">HELD (US-01)</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded flex justify-between">
                      <span className="text-white/60">LOCK_KEY: saas-crawlers-db</span>
                      <span className="text-amber-500">REPLICATING (EU-01)</span>
                    </div>
                    <div className="p-2.5 bg-black/30 border border-white/5 rounded flex justify-between">
                      <span className="text-white/60">LOCK_KEY: security-sandbox-vault</span>
                      <span className="text-gray-500">FREE</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleActionLog('ORCHESTRATOR', 'Manually cleared all system-level stale distributed thread locks.', 'warn')}
                      className="w-full text-center border border-white/10 hover:bg-white/5 text-white/80 py-1.5 rounded text-[10px] font-mono font-bold transition-all"
                    >
                      CLEAR LOCK REGISTRIES
                    </button>
                  </div>
                </div>

                {/* Leader Election Details */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">
                    Leader Election Status
                  </span>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="opacity-50">Term ID</span>
                      <span className="text-white font-bold">TERM-24951</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1.5">
                      <span className="opacity-50">Quorum Nodes</span>
                      <span className="text-[#10B981] font-bold">4 of 5 online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-50">Heartbeat Interval</span>
                      <span className="text-white">500ms</span>
                    </div>
                  </div>
                  <div className="p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded mt-2">
                    <p className="text-[10px] text-[#10B981] leading-relaxed">
                      ✓ Consensus verified. Cortex Engine successfully deployed regional locks via distributed raft protocol. Term is stable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WORKERS & HEARTBEATS */}
        {activeTab === 'workers' && (
          <div className="space-y-6 animate-fade-in text-left">
            {/* Search and elasticity controller bar */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-white/30" />
                <input
                  type="text"
                  placeholder="Filter workers by name/type/capability..."
                  value={workerQuery}
                  onChange={e => setWorkerQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#10B981]/50"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={scaleWorkerPool}
                  className="px-3 py-1.5 rounded bg-white hover:bg-white/90 text-black text-xs font-bold uppercase flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Horizontal Scale Worker
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Workers Grid */}
              <div className="lg:col-span-8 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredWorkers.map((w) => (
                    <div key={w.id} className="p-4 bg-[#0D0D0D] border border-white/5 rounded-lg space-y-3 hover:border-white/15 transition-all">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${w.status === 'healthy' ? 'bg-[#10B981] animate-pulse' : 'bg-amber-500'}`} />
                            <span className="text-xs font-bold text-white font-mono">{w.name}</span>
                          </div>
                          <span className="text-[10px] font-mono text-white/40 block">ID: {w.id} | Type: {w.type}</span>
                        </div>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                          w.status === 'healthy' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {w.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center bg-black/40 p-2 rounded text-[10px] font-mono">
                        <div>
                          <span className="opacity-40 block text-[9px]">CPU</span>
                          <span className="text-white font-bold">{w.cpu}%</span>
                        </div>
                        <div>
                          <span className="opacity-40 block text-[9px]">MEM</span>
                          <span className="text-white font-bold">{w.mem}%</span>
                        </div>
                        <div>
                          <span className="opacity-40 block text-[9px]">LATENCY</span>
                          <span className="text-cyan-400 font-bold">{w.latency}ms</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px]">
                        <p className="truncate text-white/70">
                          Active Job: <span className="text-indigo-400 font-mono">{w.activeMission}</span>
                        </p>
                        <p className="text-white/40 flex flex-wrap gap-1 mt-1.5">
                          {w.capabilities.map((cap: string, i: number) => (
                            <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.2 rounded text-white/60">
                              {cap}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workers Logs Console & Agent Pool Scale */}
              <div className="lg:col-span-4 space-y-6">
                {/* Agent Pools & Multi-Agent Planning Scale */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                  <div className="pb-3 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Multi-Agent Pools</span>
                      <p className="text-[9px] text-white/50">Cross-agent synapses memory synchronization.</p>
                    </div>
                    <button
                      onClick={triggerConsensusVote}
                      className="p-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white/80"
                      title="Trigger distributed consensus voting on plan"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3 text-[10px]">
                    {agentPools.map((pool, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-white/80">{pool.role}</span>
                          <span className="font-mono text-cyan-400 bg-cyan-400/5 px-1.5 py-0.2 rounded">{pool.count} / {pool.max}</span>
                        </div>
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-[#10B981] h-full" style={{ width: `${(pool.count / pool.max) * 100}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-white/40 font-mono">
                          <span>Sync: {pool.memorySync}</span>
                          <span>Priority: {pool.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic consensus vote panel */}
                  <div className="p-3 bg-black/40 border border-white/5 rounded space-y-2 mt-4 text-[10px]">
                    <span className="font-bold text-white/60 uppercase tracking-widest font-mono text-[9px] block">Live Consensus Ledger</span>
                    <div className="space-y-1.5 max-h-[100px] overflow-y-auto custom-scrollbar pr-1">
                      {consensusLogs.map((log) => (
                        <div key={log.id} className="flex justify-between items-center border-b border-white/[0.03] pb-1 font-mono">
                          <span className="text-white/50 truncate max-w-[140px]" title={log.topic}>{log.topic}</span>
                          <span className={log.outcome.includes('Passed') ? 'text-[#10B981]' : 'text-red-400'}>{log.outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Worker Live Logs Terminal */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white">Live Cluster Terminals</span>
                    <span className="text-[9px] text-[#10B981] animate-pulse">● FEED ONLINE</span>
                  </div>

                  <div className="bg-black/80 border border-white/5 p-3 rounded-lg font-mono text-[9px] space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar text-left text-cyan-400">
                    {workerLogs.map((log, i) => (
                      <div key={i} className="truncate">
                        <span className="text-white/30 mr-1.5">&gt;</span>{log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STATE CHECKPOINTS & CLONES */}
        {activeTab === 'checkpoints' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Active Missions to take checkpoint of */}
              <div className="lg:col-span-6 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Active Persistent Missions</span>
                  <p className="text-[10px] text-white/50 mt-0.5">Capture real-time snapshots, branch executions, or clone workflows.</p>
                </div>

                <div className="space-y-3">
                  {activeMissions.map((m) => (
                    <div key={m.id} className="p-3 bg-black/40 border border-white/5 rounded-md space-y-3 hover:border-white/10 transition-all">
                      <div className="flex justify-between items-center">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white font-mono">{m.name}</span>
                          <span className="text-[9px] text-white/40 block">Step: {m.activeStep}</span>
                        </div>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          m.priority === 'critical' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {m.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-white/60">Execution progress:</span>
                        <span className="font-mono text-cyan-400 font-bold">{m.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-500 h-full transition-all duration-500" style={{ width: `${m.progress}%` }} />
                      </div>

                      <div className="flex justify-end gap-1.5 pt-1.5 border-t border-white/[0.03]">
                        <button
                          onClick={() => triggerCheckpoint(m.id)}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-mono font-bold transition-all"
                        >
                          CREATE SNAPSHOT
                        </button>
                        <button
                          onClick={() => {
                            const newMissions = activeMissions.map(prevM =>
                              prevM.id === m.id ? { ...prevM, name: `[CLONED] ${prevM.name}`, id: `m-${Math.floor(200 + Math.random() * 800)}` } : prevM
                            );
                            setActiveMissions([...activeMissions, ...newMissions.filter(nm => nm.name.startsWith('[CLONED]'))]);
                            handleActionLog('CHECKPOINT', `Cloned active mission thread [${m.id}] successfully. Parallel replication initialized.`, 'info');
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-mono font-bold transition-all"
                        >
                          CLONE
                        </button>
                        <button
                          onClick={() => {
                            setActiveMissions(prev =>
                              prev.map(prevM => prevM.id === m.id ? { ...prevM, progress: 100, state: 'completed' } : prevM)
                            );
                            handleActionLog('CHECKPOINT', `Executed state rollback validation and merged thread [${m.id}] safely back to stable master.`, 'info');
                          }}
                          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-mono font-bold transition-all"
                        >
                          MERGE BACK
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Snapshots Recovery Vault */}
              <div className="lg:col-span-6 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Snapshots Recovery Vault</span>
                  <p className="text-[10px] text-white/50 mt-0.5">Durable storage snapshots. Instantly rollback execution or branch pipelines.</p>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                  {snapshots.map((s) => (
                    <div key={s.id} className="p-3 bg-black/40 border border-white/5 rounded flex flex-col justify-between md:flex-row md:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{s.id.toUpperCase()}</span>
                          <span className="text-[9px] text-white/30 font-mono">Hash: {s.hash}</span>
                        </div>
                        <p className="text-[10px] text-white/70">{s.name}</p>
                        <p className="text-[9px] text-white/40 font-mono">Step: {s.step} | Captured: {new Date(s.timestamp).toLocaleTimeString()}</p>
                      </div>

                      <div className="flex gap-1.5 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => resumeFromCheckpoint(s.id)}
                          className="p-1 px-2 border border-[#10B981]/20 bg-[#10B981]/10 text-[#10B981] text-[9px] font-mono font-bold rounded hover:bg-[#10B981]/20 transition-all"
                          title="Rollback active state and resume"
                        >
                          RESUME
                        </button>
                        <button
                          onClick={() => branchExecution(s.id)}
                          className="p-1 px-2 border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 text-[9px] font-mono font-bold rounded hover:bg-cyan-500/20 transition-all"
                          title="Spawn cloned branch workflow"
                        >
                          BRANCH
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SSO, SAML, SECURITY & VAULT */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Secrets Vault Key Rotation */}
              <div className="lg:col-span-6 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block flex items-center gap-1.5">
                    <Key className="text-amber-500 w-3.5 h-3.5" />
                    Zero-Trust Secrets Vault
                  </span>
                  <p className="text-[10px] text-white/50 mt-0.5">Secure symmetric/asymmetric keystore. Auto-rotates sensitive pipeline API credentials.</p>
                </div>

                <div className="space-y-2">
                  {vaultKeys.map((key) => (
                    <div key={key.id} className="p-3 bg-black/40 border border-white/5 rounded-md flex justify-between items-center gap-3 hover:border-white/10 transition-all">
                      <div className="space-y-1 truncate">
                        <span className="text-xs font-bold text-white font-mono block truncate">{key.name}</span>
                        <p className="text-[9px] text-white/40 font-mono">Cipher: {key.type} | Last Rotated: {new Date(key.rotatedAt).toLocaleString()}</p>
                      </div>

                      <button
                        onClick={() => handleRotateKey(key.id)}
                        className="p-1 px-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white text-[9px] font-mono font-bold rounded transition-all shrink-0"
                      >
                        ROTATE KEY
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 bg-black/30 p-3.5 rounded border border-white/5 space-y-2">
                  <span className="text-[9px] font-mono text-cyan-400 block uppercase tracking-widest">Platform Cryptographic Policy</span>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    All environment variables catalogued in <span className="font-mono text-white/80">.env.example</span> are securely mapped and parsed into our AES-256 block memory partition, completely invisible to public client-side browser traces.
                  </p>
                </div>
              </div>

              {/* Right Column: SAML/SSO & Compliance Checklists */}
              <div className="lg:col-span-6 space-y-6">
                {/* Identity & SSO Configuration */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">SSO, SAML & Tenant Security policies</span>
                  
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="opacity-50">SAML SSO Integration</span>
                      <span className="text-[#10B981] font-bold">CONFIGURED (OKTA)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="opacity-50">OIDC Auth Provider</span>
                      <span className="text-[#10B981] font-bold">ACTIVE (GOOGLE)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="opacity-50">Tenant Isolation Enforce</span>
                      <span className="text-cyan-400 font-bold">{securityConfig.tenantIsolation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-50">ABAC Policy Constraints</span>
                      <span className="text-white bg-white/5 px-2 py-0.5 rounded text-[10px]">{securityConfig.abacPolicy}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => handleActionLog('SECURITY', 'Evicted SAML SSO authentication session cache. Forcing global logout.', 'warn')}
                      className="flex-1 text-center border border-white/10 hover:bg-white/5 text-white/80 py-1.5 rounded text-[10px] font-mono font-bold transition-all"
                    >
                      EVICT CACHE
                    </button>
                    <button
                      onClick={() => handleActionLog('SECURITY', 'Re-verified tenant cryptographic boundaries safely.', 'info')}
                      className="flex-1 text-center bg-white text-black hover:bg-neutral-200 py-1.5 rounded text-[10px] font-mono font-bold transition-all"
                    >
                      VERIFY ISOLATION
                    </button>
                  </div>
                </div>

                {/* Compliance Audits */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Enterprise Compliance Report Generator</span>
                  <p className="text-[10px] text-white/50">Export ready audit compliance certifications and legal-hold indexes.</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono font-bold pt-1.5">
                    <button
                      onClick={() => downloadComplianceReport('SOC2 Type II')}
                      className="p-2.5 bg-black/40 border border-white/5 rounded hover:bg-white/5 hover:border-white/10 text-white flex items-center justify-between"
                    >
                      <span>SOC2 TYPE II</span>
                      <Download className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => downloadComplianceReport('GDPR Privacy')}
                      className="p-2.5 bg-black/40 border border-white/5 rounded hover:bg-white/5 hover:border-white/10 text-white flex items-center justify-between"
                    >
                      <span>GDPR CONTROLS</span>
                      <Download className="w-3 h-3 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => downloadComplianceReport('HIPAA Ready Audit')}
                      className="p-2.5 bg-black/40 border border-white/5 rounded hover:bg-white/5 hover:border-white/10 text-white flex items-center justify-between col-span-2"
                    >
                      <span>HIPAA READINESS ASSURANCES</span>
                      <Download className="w-3 h-3 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLUGINS & EXTENSIONS */}
        {activeTab === 'plugins' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-white/5 pb-4">
              <div className="flex gap-1 border border-white/5 p-1 rounded bg-black/30">
                <button
                  onClick={() => setPluginFilter('all')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all ${pluginFilter === 'all' ? 'bg-[#10B981] text-white' : 'text-white/40'}`}
                >
                  ALL PLUGINS
                </button>
                <button
                  onClick={() => setPluginFilter('installed')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all ${pluginFilter === 'installed' ? 'bg-[#10B981] text-white' : 'text-white/40'}`}
                >
                  INSTALLED
                </button>
                <button
                  onClick={() => setPluginFilter('available')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-sm transition-all ${pluginFilter === 'available' ? 'bg-[#10B981] text-white' : 'text-white/40'}`}
                >
                  AVAILABLE MARKETPLACE
                </button>
              </div>

              <span className="text-[10px] font-mono text-white/50">{filteredPlugins.length} extension manifests loaded</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlugins.map((plugin) => (
                <div key={plugin.id} className="p-4 bg-[#0D0D0D] border border-white/5 rounded-lg flex flex-col justify-between space-y-3 hover:border-white/10 transition-all text-left">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white font-mono truncate">{plugin.name}</span>
                      <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/5 border border-cyan-400/10 px-1.5 rounded">
                        v{plugin.version}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/50">Publisher: <span className="font-semibold text-white/70">{plugin.publisher}</span></p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {plugin.permissions.map((perm: string, i: number) => (
                        <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.2 rounded text-white/60">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/[0.03]">
                    <span className={`text-[9px] font-mono font-bold ${plugin.status === 'installed' ? 'text-[#10B981]' : 'text-white/40'}`}>
                      {plugin.status === 'installed' ? '✓ SYSTEM ACTIVE' : '● IDLE AVAILABLE'}
                    </span>

                    {plugin.status === 'installed' ? (
                      <button
                        onClick={() => {
                          setPlugins(prev =>
                            prev.map(p => p.id === plugin.id ? { ...p, status: 'available' } : p)
                          );
                          handleActionLog('PLUGINS', `Deactivated and sandboxed plugin extension: [${plugin.name}].`, 'warn');
                        }}
                        className="px-2 py-1 bg-white/5 hover:bg-red-900/15 text-red-400 hover:text-red-300 border border-white/10 text-[9px] font-mono font-bold rounded transition-all"
                      >
                        DEACTIVATE
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPlugins(prev =>
                            prev.map(p => p.id === plugin.id ? { ...p, status: 'installed' } : p)
                          );
                          handleActionLog('PLUGINS', `Provisioned and activated custom marketplace plugin: [${plugin.name}]. Sandbox boundary cleared.`, 'info');
                        }}
                        className="px-2 py-1 bg-white text-black hover:bg-neutral-200 text-[9px] font-mono font-bold rounded transition-all"
                      >
                        ACTIVATE
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CHAOS LAB & DEVELOPER TESTING */}
        {activeTab === 'qa' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Chaos triggers */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Chaos & Stress Injection Deck</span>
                  <p className="text-[10px] text-white/50 mt-0.5">Test resiliency, self-healing thresholds, failover, and rate limits.</p>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => runChaosTest('failover')}
                    disabled={chaosStatus === 'running'}
                    className="w-full text-left p-3 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 rounded flex justify-between items-center transition-all disabled:opacity-40"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-red-400 font-mono block">TRIGGER REGIONAL FAILOVER</span>
                      <p className="text-[9px] text-white/50">Evict primary master lease in us-east-1 and test replication.</p>
                    </div>
                    <Flame className="w-4 h-4 text-red-500" />
                  </button>

                  <button
                    onClick={() => runChaosTest('cpu_spike')}
                    disabled={chaosStatus === 'running'}
                    className="w-full text-left p-3 border border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10 rounded flex justify-between items-center transition-all disabled:opacity-40"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-amber-400 font-mono block">INJECT CRITICAL CPU WORKLOAD</span>
                      <p className="text-[9px] text-white/50">Force US-01 thread load spike and check auto tasks rescheduling.</p>
                    </div>
                    <Sliders className="w-4 h-4 text-amber-500" />
                  </button>

                  <button
                    onClick={() => runChaosTest('dlq_inject')}
                    disabled={chaosStatus === 'running'}
                    className="w-full text-left p-3 border border-purple-500/10 bg-purple-500/5 hover:bg-purple-500/10 rounded flex justify-between items-center transition-all disabled:opacity-40"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-purple-400 font-mono block">INJECT SANDBOX TRANSACTION FAULT</span>
                      <p className="text-[9px] text-white/50">Simulate database crash, retry limits, and quarantine bad blocks to DLQ.</p>
                    </div>
                    <AlertTriangle className="w-4 h-4 text-purple-500" />
                  </button>
                </div>

                {chaosStatus !== 'idle' && (
                  <div className="pt-2">
                    <button
                      onClick={handleResetChaos}
                      className="w-full text-center bg-white text-black hover:bg-neutral-200 py-1.5 rounded text-xs font-mono font-bold transition-all"
                    >
                      RESET CLUSTER SCENARIO
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Chaos Terminal Traces */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white">Chaos Execution Traces</span>
                  <span className={`text-[9px] font-mono font-bold ${
                    chaosStatus === 'running' ? 'text-amber-400 animate-pulse' : chaosStatus === 'success' ? 'text-[#10B981]' : 'text-white/30'
                  }`}>
                    {chaosStatus === 'running' ? 'SIMULATOR ACTIVE...' : chaosStatus === 'success' ? 'SCENARIO COMPLETED' : 'AWAITING TRIGGER'}
                  </span>
                </div>

                <div className="bg-black/80 border border-white/5 p-4 rounded-lg font-mono text-[9px] space-y-2 min-h-[180px] text-left text-red-400">
                  {chaosLog.length === 0 ? (
                    <div className="text-white/30 text-center pt-16">
                      Awaiting Chaos trigger input to trace system-level resilience policies.
                    </div>
                  ) : (
                    chaosLog.map((log, i) => (
                      <div key={i} className="leading-relaxed">
                        <span className="text-white/30 mr-2">&gt;</span>{log}
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-[#10B981]/5 border border-[#10B981]/15 rounded text-[10px] text-white/70 leading-relaxed space-y-1">
                  <span className="font-bold text-[#10B981] font-mono block uppercase text-[9px]">Developer SDK Code Generation Snip</span>
                  <p className="text-[9px] text-white/50">To programmatically inject resilient self-healing policies inside pipelines:</p>
                  <pre className="p-2 bg-black rounded font-mono text-[8.5px] text-cyan-400 overflow-x-auto">
                    {`import { WarbornResilience } from '@warborn/sdk';
WarbornResilience.createCircuitBreaker({
  target: 'cortex-api',
  maxRetries: 3,
  backoff: 'exponential',
  fallback: 'failover-region-eu'
});`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
