import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Cpu,
  Layers,
  Database,
  BarChart3,
  Settings,
  Shield,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Network,
  UploadCloud,
  Search,
  Check,
  Copy,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Clock,
  HelpCircle,
  FileCode,
  DollarSign,
  Fingerprint,
  Activity,
  Code,
  Flame,
  ArrowRight,
  Workflow,
  Wrench,
  Gauge,
  Terminal,
  FileSearch,
  Eye,
  Lock,
  Compass,
  FileCheck,
  Award,
  ChevronRight,
  TrendingUp,
  Sliders
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { LogEntry } from '../types';

interface SelfOptimizingHubProps {
  isDark: boolean;
  onAddLog: (log: LogEntry) => void;
}

export default function SelfOptimizingHub({ isDark, onAddLog }: SelfOptimizingHubProps) {
  // Inner Sub-Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'missions' | 'memory' | 'connectors' | 'release' | 'selfhealing'>('overview');

  // helper logger
  const logAction = (module: string, message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    onAddLog({
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    });
  };

  // ===============================================================================================
  // STATE & DATA: QUALITY SCORE & EXEC INSIGHTS
  // ===============================================================================================
  const [qualityScore, setQualityScore] = useState<number>(94);
  const [subScores, setSubScores] = useState({
    performance: 92,
    security: 97,
    reliability: 91,
    accessibility: 89,
    developerExperience: 95,
    userExperience: 93,
    aiQuality: 96,
    documentation: 88,
    testing: 85
  });

  const historicalTrends = [
    { name: 'Cycle 1', score: 82, cost: 420, missions: 80, latency: 450 },
    { name: 'Cycle 2', score: 85, cost: 380, missions: 120, latency: 390 },
    { name: 'Cycle 3', score: 88, cost: 310, missions: 190, latency: 310 },
    { name: 'Cycle 4', score: 91, cost: 240, missions: 280, latency: 260 },
    { name: 'Cycle 5', score: 93, cost: 190, missions: 410, latency: 190 },
    { name: 'Cycle 6', score: 94, cost: 165, missions: 520, latency: 142 }
  ];

  const [strategicRecommendations, setStrategicRecommendations] = useState([
    { id: 'rec-1', text: 'Consolidate 3 duplicate utility functions in WorkspaceStudios component', category: 'Architecture', impact: 'High', effort: 'Low', status: 'pending' },
    { id: 'rec-2', text: 'Optimize vector search routing: downgrade 40% simple queries to Gemini 2.5 Flash', category: 'Cost', impact: 'High', effort: 'Medium', status: 'pending' },
    { id: 'rec-3', text: 'Archive 52 stale memory nodes that have zero reference weight in 90 days', category: 'Memory', impact: 'Medium', effort: 'Low', status: 'pending' },
    { id: 'rec-4', text: 'Index 4 high-frequency SQL query paths inside ledger auditing schemas', category: 'Performance', impact: 'High', effort: 'Medium', status: 'pending' },
    { id: 'rec-5', text: 'Resolve semantic contradiction between meeting notes model and calendar date formats', category: 'Knowledge', impact: 'Medium', effort: 'High', status: 'pending' }
  ]);

  const handleResolveRecommendation = (id: string, text: string) => {
    setStrategicRecommendations(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'resolved' } : r)
    );
    // Dynamically increase quality score!
    setQualityScore(prev => Math.min(prev + 1, 100));
    setSubScores(prev => ({
      ...prev,
      performance: Math.min(prev.performance + 1, 100),
      developerExperience: Math.min(prev.developerExperience + 1, 100)
    }));
    logAction('PLATFORM_INTELLIGENCE', `Manually triggered optimization for: "${text}". Action dispatched successfully.`, 'info');
  };

  // ===============================================================================================
  // STATE & DATA: AUTONOMOUS ARCHITECTURE & AI CODE REVIEW
  // ===============================================================================================
  const [archIssues, setArchIssues] = useState([
    { id: 'arch-1', module: 'WorkspaceStudios.tsx', issue: 'Duplicate CSS/Tailwind complex classes', severity: 'Low', status: 'pending', codeSize: '2.8K LOC' },
    { id: 'arch-2', module: 'OperationsCenter.tsx', issue: 'Potential circular reference to TraceLogs hooks', severity: 'High', status: 'pending', codeSize: '1.2K LOC' },
    { id: 'arch-3', module: 'ContextMemoryEngine.tsx', issue: 'Unused exports (fetchStaleIndexRecords, updateSynapseConfidence)', severity: 'Medium', status: 'pending', codeSize: '950 LOC' },
    { id: 'arch-4', module: 'App.tsx', issue: 'Heavy component bundle footprint (exceeds recommended 20KB limit)', severity: 'Medium', status: 'pending', codeSize: '15.6K LOC' }
  ]);

  const [selectedFileForReview, setSelectedFileForReview] = useState('WorkspaceStudios.tsx');
  const [isReviewingCode, setIsReviewingCode] = useState(false);
  const [codeReviewResult, setCodeReviewResult] = useState<any | null>({
    fileName: 'WorkspaceStudios.tsx',
    complexity: 'High (O(N^2) in search filtering)',
    namingScore: '89/100',
    missingDocs: 'Yes (3 components have undocumented render props)',
    missingTests: 'Yes (0 test coverage on local drag-drop handlers)',
    vulnerabilities: 'None detected',
    optimizations: [
      { id: 'opt-1', title: 'Memoize filtered listing loops with useMemo', confidence: 96, impact: '+80ms rendering speedup' },
      { id: 'opt-2', title: 'Extract Marketplace component to standalone file to trim 400 LOC', confidence: 91, impact: '-15% memory footprint' }
    ]
  });

  const handleRunArchitecturePrune = (id: string, module: string, issue: string) => {
    setArchIssues(prev => prev.filter(item => item.id !== id));
    setQualityScore(prev => Math.min(prev + 1, 100));
    logAction('AUTONOMOUS_REVIEW', `Successfully pruned redundant code paths and optimized dependencies in [${module}] to resolve: ${issue}.`, 'info');
  };

  const handleRunCodeReview = () => {
    setIsReviewingCode(true);
    setTimeout(() => {
      if (selectedFileForReview === 'App.tsx') {
        setCodeReviewResult({
          fileName: 'App.tsx',
          complexity: 'Very High (1.5K LOC core router, too many inline state definitions)',
          namingScore: '92/100',
          missingDocs: 'Yes (Missing class component documentation)',
          missingTests: 'Yes (Needs end-to-end user navigation state simulations)',
          vulnerabilities: '1 potential warning (Client key storage reference in comments)',
          optimizations: [
            { id: 'opt-app-1', title: 'Extract state providers to custom hooks contexts', confidence: 98, impact: '-400 LOC from App.tsx' },
            { id: 'opt-app-2', title: 'Implement lazy routing for sub-studios tab components', confidence: 95, impact: '-32% initial bundle weight' }
          ]
        });
      } else if (selectedFileForReview === 'CortexAgentConsole.tsx') {
        setCodeReviewResult({
          fileName: 'CortexAgentConsole.tsx',
          complexity: 'Medium',
          namingScore: '94/100',
          missingDocs: 'No',
          missingTests: 'Partial (Basic mocks exist)',
          vulnerabilities: 'None',
          optimizations: [
            { id: 'opt-ag-1', title: 'Throttle agent activity log streams to 200ms interval', confidence: 94, impact: 'Substantial main-thread relief' }
          ]
        });
      } else {
        setCodeReviewResult({
          fileName: selectedFileForReview,
          complexity: 'Normal',
          namingScore: '96/100',
          missingDocs: 'None',
          missingTests: 'Fully verified',
          vulnerabilities: 'None',
          optimizations: [
            { id: 'opt-gen-1', title: 'Apply standard component memoization checks', confidence: 90, impact: 'Negligible render gain' }
          ]
        });
      }
      setIsReviewingCode(false);
      logAction('AI_CODE_REVIEWER', `Completed automated deep-static code review on [${selectedFileForReview}] module.`, 'info');
    }, 1200);
  };

  // ===============================================================================================
  // STATE & DATA: MISSION & AGENT PERFORMANCE CENTER
  // ===============================================================================================
  const agentPerformanceData = [
    { name: 'Code Architect', quality: 98, completion: 97, latency: 310, consensus: 99 },
    { name: 'FinTech Auditor', quality: 94, completion: 91, latency: 420, consensus: 96 },
    { name: 'UX Optimizer', quality: 91, completion: 88, latency: 280, consensus: 94 },
    { name: 'Sync Orchestrator', quality: 95, completion: 94, latency: 190, consensus: 98 }
  ];

  const [consensusQuality, setConsensusQuality] = useState(98.7);
  const [isCalibratingAgents, setIsCalibratingAgents] = useState(false);

  const handleCalibrateConsensus = () => {
    setIsCalibratingAgents(true);
    setTimeout(() => {
      setConsensusQuality(99.4);
      setIsCalibratingAgents(false);
      logAction('AGENT_PERFORMANCE', 'Re-balanced agent workloads dynamically and recalibrated consensus model thresholds.', 'info');
    }, 1500);
  };

  // ===============================================================================================
  // STATE & DATA: MEMORY & KNOWLEDGE EVOLUTION
  // ===============================================================================================
  const [knowledgeStats, setKnowledgeStats] = useState({
    totalNodes: 1420,
    isolatedNodes: 14,
    duplicateVectors: 23,
    contradictions: 2,
    staleVectors: 52
  });

  const [isEvolvingMemory, setIsEvolvingMemory] = useState(false);

  const handleEvolveMemory = () => {
    setIsEvolvingMemory(true);
    setTimeout(() => {
      setKnowledgeStats({
        totalNodes: 1445, // discovered hidden nodes
        isolatedNodes: 2, // reduced dramatically
        duplicateVectors: 0, // merged
        contradictions: 0, // resolved
        staleVectors: 0 // archived
      });
      setIsEvolvingMemory(false);
      setSubScores(prev => ({ ...prev, aiQuality: 99 }));
      logAction('MEMORY_EVOLUTION', 'Autonomous memory cleaner successfully completed: Merged duplicate vectors, archived stale knowledge, and corrected 2 contradictory nodes.', 'info');
    }, 2000);
  };

  // ===============================================================================================
  // STATE & DATA: CONNECTOR HEALTH & COST OPTIMIZER
  // ===============================================================================================
  const [connectorStatus, setConnectorStatus] = useState([
    { name: 'IntelliLedger SAP Bridge', syncDelay: '12ms', rateLimitMargin: '84%', webhooks: 'Healthy', status: 'Online', tokenExpiry: '42 hrs' },
    { name: 'Salesforce CRM Extender', syncDelay: '420ms', rateLimitMargin: '38%', webhooks: '3 slow responses', status: 'Warning', tokenExpiry: '1.2 hrs' },
    { name: 'Slack MCP Messenger', syncDelay: '8ms', rateLimitMargin: '99%', webhooks: 'Healthy', status: 'Online', tokenExpiry: '940 hrs' },
    { name: 'Workspace Gmail API Proxy', syncDelay: '1.2s', rateLimitMargin: '12%', webhooks: '4 failed attempts', status: 'Critical', tokenExpiry: 'Expired' }
  ]);

  const [isRepairingConnectors, setIsRepairingConnectors] = useState(false);

  const handleRepairConnectors = () => {
    setIsRepairingConnectors(true);
    setTimeout(() => {
      setConnectorStatus(prev =>
        prev.map(c => ({
          ...c,
          syncDelay: c.name.includes('Gmail') ? '18ms' : c.syncDelay,
          rateLimitMargin: '90%',
          webhooks: 'Healthy',
          status: 'Online',
          tokenExpiry: '24 hrs'
        }))
      );
      setIsRepairingConnectors(false);
      logAction('CONNECTOR_HEALTH', 'Refreshed access tokens, cleared webhook retries, and optimized multi-region endpoints.', 'info');
    }, 1800);
  };

  const [dynamicRoutingEnabled, setDynamicRoutingEnabled] = useState(false);

  // ===============================================================================================
  // STATE & DATA: RELEASE READINESS
  // ===============================================================================================
  const [releaseAudits, setReleaseAudits] = useState([
    { name: 'Architecture Audit', status: 'PASS', score: '98%', details: 'Zero circular dependencies remaining' },
    { name: 'Security Vulnerability Audit', status: 'PASS', score: '100%', details: 'All API routes proxy through Express backend secrets' },
    { name: 'Performance Bottleneck Audit', status: 'PASS', score: '94%', details: 'Core load latency is 142ms' },
    { name: 'Accessibility Audit (WCAG 2.1)', status: 'PASS', score: '92%', details: 'Contrast levels and Aria elements matched' },
    { name: 'Regression Analysis Simulator', status: 'PASS', score: '99%', details: 'Passed 14 simulated task workloads' },
    { name: 'Plugin Compatibility Checks', status: 'PASS', score: '100%', details: 'All 6 Marketplace packages verified' }
  ]);

  const [releaseCertificate, setReleaseCertificate] = useState<string | null>(null);
  const [isAuditingRelease, setIsAuditingRelease] = useState(false);

  const handleRunReleaseAudit = () => {
    setIsAuditingRelease(true);
    setReleaseCertificate(null);
    setTimeout(() => {
      setIsAuditingRelease(false);
      setReleaseCertificate(`CERTIFICATE OF COMPLIANCE
----------------------------------------
UUID: CERT-89FA-4412-BB2D
Timestamp: ${new Date().toISOString()}
Target: Warborn Enterprise Node (Stable Release 9.0)
Verified Quality Score: ${qualityScore}/100
Uptime Guarantee: 99.998%

Audit Summary:
- Security Standard: Enterprise Sec+ High-Level Proxy Shield
- Microservices: 18 Modules fully sandboxed
- Automated Self-Healing: Operational & Active

SIGNED BY CORTEX-Consensus-Cluster`);
      logAction('RELEASE_AUDITOR', 'Generated official Platform Release Readiness Certificate with 100% compliance checks.', 'info');
    }, 2000);
  };

  // ===============================================================================================
  // STATE & DATA: SELF-HEALING & CLI TERMINAL
  // ===============================================================================================
  const [healingLogs, setHealingLogs] = useState<string[]>([
    '[SYSTEM HEALTHCHECK] 07:01:14 - All 4 worker nodes verified as active.',
    '[SELF-HEALING] 07:12:02 - Stale memory block archived: "meeting-agenda-draft-v1" (v_88f9). Freed 4.2 MB indexing cache.',
    '[SELF-HEALING] 07:18:44 - Token rotation executed for Salesforce Gateway Connector. Auth restored to 100%.',
    '[SELF-HEALING] 07:22:11 - Automated recovery: Restarted worker node [EU-WEST-04] due to momentary network spike. Uptime maintained.',
    '[SYSTEM MONITOR] 07:29:01 - Platform Consensus level solid at 98.7%.'
  ]);

  const [terminalInput, setTerminalInput] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [healingLogs]);

  const handleRunHealingRoutine = (commandText: string) => {
    const raw = commandText.trim();
    if (!raw) return;

    let results = [`$ ${raw}`];
    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const subCmd = parts[1]?.toLowerCase();

    switch (cmd) {
      case 'help':
        results.push(
          'Available Commands:',
          '  heal restart --node <name>   - Hard restart an isolated cluster worker node safely',
          '  heal balance --queue <name>   - Balance mission execution queues',
          '  heal clear --cache <name>     - Purge cached memory/vectors/APIs safely',
          '  heal repair --index <name>    - Recompile search mappings & indices',
          '  heal rotate --keys <connector>- Rotate secret credential tokens safely',
          '  heal optimize --db queries    - Formulate fast SQL indexes dynamically',
          '  clear                         - Clear this healing monitor log'
        );
        break;
      case 'clear':
        setHealingLogs([]);
        setTerminalInput('');
        return;
      case 'heal':
        if (subCmd === 'restart') {
          const node = parts[3] || 'US-EAST-02';
          results.push(
            `Initiating self-healing restart sequence for worker [${node}]...`,
            `[✔] Safely drained outstanding connection queues from [${node}].`,
            `[✔] Re-routed incoming transactions to sister node [US-EAST-01].`,
            `[✔] Process exited and restarted successfully. Uptime preserved.`
          );
          logAction('SELF_HEALING_ENGINE', `Hard restarted unhealthy node: [${node}]. Connection re-routing passed.`, 'info');
        } else if (subCmd === 'balance') {
          results.push(
            `Scanning active mission queues...`,
            `[✔] Re-balanced 4 core queues. Memory pool optimal.`
          );
          logAction('SELF_HEALING_ENGINE', 'Re-balanced mission worker queues autonomously.', 'info');
        } else if (subCmd === 'clear') {
          results.push(
            `Flushing temporary index caches...`,
            `[✔] Cleared 1.4 GB stagnant search cache.`
          );
          logAction('SELF_HEALING_ENGINE', 'Cleared stale caches from distributed nodes.', 'info');
        } else if (subCmd === 'repair') {
          results.push(
            `Scanning indices structure for corruption...`,
            `[✔] Re-compiled search engine indexes mapping structure. Zero errors detected.`
          );
          logAction('SELF_HEALING_ENGINE', 'Repaired Vector search indices structural schema.', 'info');
        } else if (subCmd === 'rotate') {
          results.push(
            `Triggering secured credentials key rotation...`,
            `[✔] Successfully generated, encrypted, and saved active gateway keys.`
          );
          logAction('SELF_HEALING_ENGINE', 'Rotated database secret authorization credentials.', 'info');
        } else if (subCmd === 'optimize') {
          results.push(
            `Running query diagnostic analyzer...`,
            `[✔] Implemented 4 high-frequency query indices dynamically in relational database.`
          );
          logAction('SELF_HEALING_ENGINE', 'Optimized database query response indexes.', 'info');
        } else {
          results.push('Unknown healing routine. Type "help" to list options.');
        }
        break;
      default:
        results.push(`Unrecognized script. Type "help" to list valid options.`);
    }

    setHealingLogs(prev => [...prev, ...results]);
    setTerminalInput('');
  };

  return (
    <div className="space-y-6 text-left" id="self-optimizing-platform-root">
      {/* ------------------ TITLE BAR ------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-500 text-white shadow-lg animate-pulse">
              <Brain className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight uppercase font-display text-white">
              Cortex Autonomous Intelligence & Self-Healing Hub
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Warborn Platform Phase 9 — Self-Optimizing Operating System monitoring architecture, code quality, memory graph evolution, and automatic healing.
          </p>
        </div>

        {/* Global Security Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded">
            SELF_AWARE: ACTIVE (99.998% SLA)
          </span>
        </div>
      </div>

      {/* ------------------ INNER NAVIGATION TABS ------------------ */}
      <div className="flex border-b border-white/5 gap-1 overflow-x-auto select-none custom-scrollbar pb-1">
        {[
          { id: 'overview', label: 'Executive Dashboard', icon: Gauge },
          { id: 'architecture', label: 'Architecture & Code Review', icon: FileSearch },
          { id: 'missions', label: 'Mission & Agent Analytics', icon: BarChart3 },
          { id: 'memory', label: 'Memory & Knowledge Evolution', icon: Network },
          { id: 'connectors', label: 'Connector Health & Cost', icon: Sliders },
          { id: 'release', label: 'Release Readiness', icon: FileCheck },
          { id: 'selfhealing', label: 'Self-Healing Terminal', icon: Wrench }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 border-b-2 font-display text-xs font-bold tracking-tight uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-white bg-white/[0.02]'
                  : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ------------------ ACTIVE VIEW CONTENT ------------------ */}
      <div className="min-h-[500px]">

        {/* VIEW 1: EXECUTIVE DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Visual Quality Score Header Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Big visual score and gauge */}
              <div className="lg:col-span-4 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Platform-Wide Quality Index</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-5xl font-black tracking-tighter text-white font-display">
                      {qualityScore}
                    </span>
                    <span className="text-xl text-white/40 font-bold">/100</span>
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-0.5 ml-2">
                      <TrendingUp className="w-3 h-3" /> +2.1% this cycle
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
                    Composite telemetry weighting performance, database integrity, credential hygiene, and user flow friction index.
                  </p>
                </div>

                {/* Subscores sliders/meters */}
                <div className="space-y-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                  {[
                    { label: 'Security & Auth Posture', val: subScores.security, color: 'bg-indigo-500' },
                    { label: 'Distributed Performance', val: subScores.performance, color: 'bg-teal-500' },
                    { label: 'Uptime & Reliability', val: subScores.reliability, color: 'bg-rose-500' },
                    { label: 'Workspace AI Quality', val: subScores.aiQuality, color: 'bg-amber-500' },
                    { label: 'Developer Experience', val: subScores.developerExperience, color: 'bg-emerald-500' }
                  ].map((sub, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-white/60 text-[9px]">
                        <span>{sub.label.toUpperCase()}</span>
                        <span className="text-white font-bold">{sub.val}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${sub.color}`} style={{ width: `${sub.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Historical trends area chart */}
              <div className="lg:col-span-8 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Platform Growth Trends</span>
                    <p className="text-[10px] text-white/50">Historical score progress vs computing cost overheads.</p>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">CYCLE-WISE TELEMETRY</span>
                </div>

                <div className="h-[180px] w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historicalTrends}>
                      <defs>
                        <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#ffffff" opacity={0.3} fontSize={10} tickLine={false} />
                      <YAxis stroke="#ffffff" opacity={0.3} fontSize={10} tickLine={false} domain={[60, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D0D0D', borderColor: 'rgba(255,255,255,0.1)' }}
                        labelStyle={{ color: '#9CA3AF', fontSize: 10, fontFamily: 'monospace' }}
                        itemStyle={{ color: '#fff', fontSize: 11 }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" name="Quality Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Platform Metrics Hub */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Active Self-Healing Workers', val: '4 / 4', detail: 'Consensus online', icon: Cpu, color: 'text-indigo-400' },
                { label: 'Saved Monthly AI Cost', val: '$1,240.50', detail: 'Token optimizations active', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'Contradiction Resolvers', val: '12', detail: 'In Vector memory graph', icon: Network, color: 'text-cyan-400' },
                { label: 'Uptime Reliability Rate', val: '99.998%', detail: 'Zero core crashes', icon: Activity, color: 'text-rose-400' }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="border border-white/5 bg-[#0D0D0D] p-4 rounded-lg flex items-center gap-3">
                    <span className={`p-2 rounded bg-white/5 ${m.color}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="space-y-0.5 truncate">
                      <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">{m.label}</span>
                      <span className="text-lg font-bold text-white block">{m.val}</span>
                      <span className="text-[9px] text-white/50 block font-mono">{m.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strategic recommendations & optimization priorities */}
            <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Strategic Recommendations Pipeline</span>
                  <p className="text-[10px] text-white/50">Prioritized system evolution checklist curated by the Central Reasoning consensus.</p>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded font-bold">
                  {strategicRecommendations.filter(r => r.status === 'pending').length} ACTIONABLE ITEMS
                </span>
              </div>

              <div className="space-y-2.5">
                {strategicRecommendations.map((rec) => (
                  <div key={rec.id} className="p-3 bg-black/40 border border-white/5 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          rec.impact === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          IMPACT: {rec.impact}
                        </span>
                        <span className="text-[9px] font-mono text-white/30">Category: {rec.category}</span>
                      </div>
                      <p className="text-xs text-white/80">{rec.text}</p>
                    </div>

                    <button
                      onClick={() => handleResolveRecommendation(rec.id, rec.text)}
                      disabled={rec.status === 'resolved'}
                      className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                        rec.status === 'resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10'
                      }`}
                    >
                      {rec.status === 'resolved' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> RECTIFIED
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" /> RUN AUTO-HEAL
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ARCHITECTURE & CODE REVIEW */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left column: Module architecture health */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-2 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Autonomous Architecture Scan</span>
                  <p className="text-[10px] text-white/50">Tracking duplications, dead code, circular imports, and bundle sizes.</p>
                </div>

                <div className="space-y-3">
                  {archIssues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-black/40 border border-white/5 rounded space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5 truncate">
                          <span className="text-xs font-bold font-mono text-indigo-400 block truncate">{issue.module}</span>
                          <span className="text-[9px] text-white/30 block">Module Size: {issue.codeSize}</span>
                        </div>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          issue.severity === 'High' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {issue.severity} RISK
                        </span>
                      </div>

                      <p className="text-[11px] text-white/70 leading-relaxed">{issue.issue}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-white/[0.03]">
                        <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Auto-healing script ready
                        </span>
                        <button
                          onClick={() => handleRunArchitecturePrune(issue.id, issue.module, issue.issue)}
                          className="px-2 py-0.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[9px] text-white uppercase"
                        >
                          Prune Exports
                        </button>
                      </div>
                    </div>
                  ))}

                  {archIssues.length === 0 && (
                    <div className="text-center p-6 bg-black/40 border border-dashed border-white/10 rounded-lg text-white/30 font-mono text-xs">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      All dynamic module circularities and redundancies successfully pruned.
                    </div>
                  )}
                </div>
              </div>

              {/* Right column: AI Code review scanner */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">AI Static Code Review Engine</span>
                    <p className="text-[10px] text-white/50">Analyze source files for complexity, poor naming, and missing tests.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedFileForReview}
                      onChange={(e) => setSelectedFileForReview(e.target.value)}
                      className="bg-white/5 border border-white/10 text-xs text-white px-2 py-1.5 rounded focus:outline-none"
                    >
                      <option value="WorkspaceStudios.tsx">WorkspaceStudios.tsx</option>
                      <option value="App.tsx">App.tsx</option>
                      <option value="CortexAgentConsole.tsx">CortexAgentConsole.tsx</option>
                      <option value="DeveloperPortal.tsx">DeveloperPortal.tsx</option>
                    </select>

                    <button
                      onClick={handleRunCodeReview}
                      disabled={isReviewingCode}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded text-xs font-mono font-bold uppercase flex items-center gap-1"
                    >
                      {isReviewingCode ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      ANALYZE
                    </button>
                  </div>
                </div>

                {codeReviewResult && (
                  <div className="space-y-4 animate-fade-in text-xs">
                    <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 rounded border border-white/5 font-mono text-[10px]">
                      <div>
                        <span className="text-white/40">COMPLEXITY ANALYSIS:</span>
                        <span className="text-white font-bold block mt-0.5">{codeReviewResult.complexity}</span>
                      </div>
                      <div>
                        <span className="text-white/40">NAMING & FORMATTING SCORE:</span>
                        <span className="text-indigo-400 font-bold block mt-0.5">{codeReviewResult.namingScore}</span>
                      </div>
                      <div>
                        <span className="text-white/40">MISSING DOCUMENTATION:</span>
                        <span className="text-amber-400 font-bold block mt-0.5">{codeReviewResult.missingDocs}</span>
                      </div>
                      <div>
                        <span className="text-white/40">UNIT TEST COVERAGE:</span>
                        <span className="text-rose-400 font-bold block mt-0.5">{codeReviewResult.missingTests}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-left">
                      <span className="text-[10px] font-mono text-white/40 block">Suggested Static Optimizations</span>
                      <div className="space-y-2">
                        {codeReviewResult.optimizations.map((opt: any, i: number) => (
                          <div key={i} className="p-3 bg-black/50 border border-indigo-500/10 rounded flex justify-between items-center gap-3">
                            <div className="space-y-0.5">
                              <span className="text-white font-semibold font-mono block">{opt.title}</span>
                              <span className="text-[10px] text-white/50 block">Target Impact: {opt.impact}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono text-indigo-400 font-bold px-1.5 py-0.5 bg-indigo-500/10 rounded">
                                {opt.confidence}% CONFIDENCE
                              </span>
                              <button
                                onClick={() => {
                                  logAction('AI_CODE_REVIEWER', `Applied code optimization patch: "${opt.title}" on file [${selectedFileForReview}].`, 'info');
                                  setQualityScore(prev => Math.min(prev + 1, 100));
                                  // remove optimization after click
                                  setCodeReviewResult((prev: any) => prev ? {
                                    ...prev,
                                    optimizations: prev.optimizations.filter((o: any) => o.id !== opt.id)
                                  } : null);
                                }}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-mono text-[10px] font-bold uppercase"
                              >
                                APPLY PATCH
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: MISSION & AGENT ANALYTICS */}
        {activeTab === 'missions' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Mission analytics report */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Mission Execution Analytics</span>
                <p className="text-[10px] text-white/50 leading-relaxed mb-4">
                  Autonomous diagnostic metrics compiling completion success rates, retries, cost, and approval latencies.
                </p>

                <div className="grid grid-cols-3 gap-4 bg-black/40 p-4 border border-white/5 rounded-lg text-center">
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Mission Success Rate</span>
                    <span className="text-2xl font-bold text-emerald-400 block mt-1">94.2%</span>
                    <span className="text-[8px] text-white/30 font-mono">1.2% retry frequency</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Average Runtime</span>
                    <span className="text-2xl font-bold text-white block mt-1">3.2s</span>
                    <span className="text-[8px] text-white/30 font-mono">310ms engine delay</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-white/40 block uppercase tracking-wider">Approval Timeout Delay</span>
                    <span className="text-2xl font-bold text-indigo-400 block mt-1">14s</span>
                    <span className="text-[8px] text-white/30 font-mono">Reduced by 4.2s this week</span>
                  </div>
                </div>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-white/40">INTELLIGENT RUNTIME RECOMMENDATION</span>
                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded">
                      ACTIVE ADVISOR
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    "Group low-priority, high-token Workspace drive synchronization runs into batch schedules (04:00 UTC) to minimize cloud embedding load. This reduces concurrent gateway rate limiting."
                  </p>
                  <button
                    onClick={() => logAction('MISSION_ANALYTICS', 'Dispatched batch cron schedule routing algorithm for low-priority missions.', 'info')}
                    className="mt-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-mono font-bold uppercase transition-all"
                  >
                    Deploy Strategy
                  </button>
                </div>
              </div>

              {/* Right Column: Agent Performance Center */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Agent Performance Monitor</span>
                    <p className="text-[10px] text-white/50">Tracking reasoning quality, tool latency, and consensus loops.</p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded font-bold">
                    {consensusQuality}% CONSENSUS
                  </span>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  {agentPerformanceData.map((agent, i) => (
                    <div key={i} className="p-2.5 bg-black/40 border border-white/5 rounded space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-bold">{agent.name.toUpperCase()}</span>
                        <span className="text-indigo-400">{agent.latency}ms latency</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[9px] text-white/50">
                        <div>
                          <span>Reasoning Quality</span>
                          <span className="text-emerald-400 block font-bold">{agent.quality}/100</span>
                        </div>
                        <div>
                          <span>Task Completion</span>
                          <span className="text-white block font-bold">{agent.completion}%</span>
                        </div>
                        <div>
                          <span>Consensus Weight</span>
                          <span className="text-indigo-400 block font-bold">{agent.consensus}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/[0.03]">
                  <button
                    onClick={handleCalibrateConsensus}
                    disabled={isCalibratingAgents}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wider transition-all"
                  >
                    {isCalibratingAgents ? 'RE-CALIBRATING POOL...' : 'CALIBRATE CONSENSUS THRESHOLDS'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MEMORY & KNOWLEDGE EVOLUTION */}
        {activeTab === 'memory' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Memory cleaner panel */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Neural Memory Evolution</span>
                <p className="text-[10px] text-white/50 leading-relaxed mb-3">
                  Identify and clean vector duplicates, archive stagnant context history and resolve contradicting knowledge vectors autonomously.
                </p>

                <div className="space-y-3 font-mono text-[10px] bg-black/40 p-4 border border-white/5 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-white/50">Vector Graph Index:</span>
                    <span className="text-white font-bold">{knowledgeStats.totalNodes} Nodes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Duplicate Vectors Spotted:</span>
                    <span className={knowledgeStats.duplicateVectors > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                      {knowledgeStats.duplicateVectors}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Semantic Contradictions:</span>
                    <span className={knowledgeStats.contradictions > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {knowledgeStats.contradictions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Stale Memories (90d unused):</span>
                    <span className="text-white/80">{knowledgeStats.staleVectors}</span>
                  </div>
                </div>

                <button
                  onClick={handleEvolveMemory}
                  disabled={isEvolvingMemory || (knowledgeStats.duplicateVectors === 0 && knowledgeStats.contradictions === 0)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wider transition-all flex items-center justify-center gap-1.5"
                >
                  {isEvolvingMemory ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> RUNNING EVOLUTION COMPACTOR...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" /> MERGE DUPLICATES & ARCHIVE STALE DATA
                    </>
                  )}
                </button>
              </div>

              {/* Knowledge hidden link finder */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Semantic Knowledge Edge Graph</span>
                    <p className="text-[10px] text-white/50">Discovering hidden relationships between independent document nodes.</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded">
                    {knowledgeStats.isolatedNodes} Isolated Nodes
                  </span>
                </div>

                {/* Display relations as custom mini nodes */}
                <div className="p-4 bg-black/50 border border-white/5 rounded-lg min-h-[200px] flex flex-col justify-between">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { node: 'SAP Core Ledger', tag: 'ERP Database', link: 'Invoices DB', strength: 'Strong (0.94)' },
                      { node: 'Legal Contract Parser', tag: 'OCR Analyzer', link: 'Corporate Guidelines', strength: 'Medium (0.81)' },
                      { node: 'Meeting Summary AI', tag: 'Speech-to-Text', link: 'Project Tasks Tracker', strength: 'Suggested Edge (0.78)' },
                      { node: 'Outlook Sync Router', tag: 'SMTP Gateway', link: 'Team Calendar', strength: 'Strong (0.91)' },
                      { node: 'Customer Ticket Stream', tag: 'API Webhook', link: 'Warborn CRM Extender', strength: 'Suggested Edge (0.84)' }
                    ].map((item, i) => (
                      <div key={i} className="p-2.5 bg-white/[0.02] border border-white/5 rounded text-[10px]">
                        <span className="font-mono font-bold text-white block truncate">{item.node}</span>
                        <span className="text-[8px] text-white/30 block mb-1">{item.tag}</span>
                        <div className="pt-1.5 border-t border-white/[0.04] space-y-0.5 font-mono text-[9px]">
                          <span className="text-indigo-400 truncate block">→ {item.link}</span>
                          <span className="text-white/40 block text-[8px]">Weight: {item.strength}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/[0.03] flex justify-between items-center">
                    <span className="text-[9px] text-white/40 font-mono">Consensus weights refreshed autonomously every 60s.</span>
                    <button
                      onClick={() => {
                        logAction('KNOWLEDGE_ENGINE', 'Initiated full graph re-indexing. Discovered 12 new relation links.', 'info');
                        setKnowledgeStats(prev => ({
                          ...prev,
                          isolatedNodes: Math.max(prev.isolatedNodes - 4, 0),
                          totalNodes: prev.totalNodes + 12
                        }));
                      }}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[9px] text-white uppercase"
                    >
                      Search Edge Links
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: CONNECTOR HEALTH & COST */}
        {activeTab === 'connectors' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Connector Health Monitor list */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Connector Reliability Monitor</span>
                    <p className="text-[10px] text-white/50">Monitor auth key expirations, rate limits, sync speeds and webhooks.</p>
                  </div>
                  <button
                    onClick={handleRepairConnectors}
                    disabled={isRepairingConnectors}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-mono font-bold uppercase flex items-center gap-1"
                  >
                    {isRepairingConnectors ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Wrench className="w-3.5 h-3.5" />
                    )}
                    REPAIR & REFRESH ALL
                  </button>
                </div>

                <div className="space-y-3 font-mono text-[10px]">
                  {connectorStatus.map((conn, idx) => (
                    <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-white block">{conn.name}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-white/40">
                          <span>Latency: <span className="text-white/80">{conn.syncDelay}</span></span>
                          <span>Webhook Status: <span className="text-white/80">{conn.webhooks}</span></span>
                          <span>Auth Expiry: <span className="text-white/80">{conn.tokenExpiry}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right">
                          <span className="text-[9px] text-white/30 block">RATE LIMIT CAP:</span>
                          <span className="text-white block font-bold">{conn.rateLimitMargin} margin</span>
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          conn.status === 'Online' ? 'bg-[#10B981]/10 text-[#10B981]' :
                          conn.status === 'Warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {conn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Cost Optimizer */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">AI Cloud Cost Optimizer</span>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Real-time token routing optimizations. Balancing performance goals with cloud expenditures.
                </p>

                <div className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/50">COMPUTATIONAL PROMPT EFFICIENCY:</span>
                    <span className="text-emerald-400 font-bold">+24.8% optimized</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-white/50">CACHING EMBEDDING HITS:</span>
                    <span className="text-indigo-400 font-bold">89.2% speedup gain</span>
                  </div>

                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: '89.2%' }} />
                  </div>
                </div>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded space-y-2">
                  <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase block">DYNAMIC MODEL ROUTER</span>
                  <p className="text-[11px] text-white/80 leading-relaxed">
                    Auto-divert simple query structures (formatting, schema checks, lists) to cost-effective models. Saves 70% cost.
                  </p>
                  <div className="flex justify-between items-center pt-1.5 border-t border-white/[0.04]">
                    <span className="text-[9px] text-white/40 font-mono">STATUS: {dynamicRoutingEnabled ? 'ENABLED' : 'DISABLED'}</span>
                    <button
                      onClick={() => {
                        setDynamicRoutingEnabled(!dynamicRoutingEnabled);
                        logAction('COST_OPTIMIZER', `Dynamic prompt optimization and token routing ${!dynamicRoutingEnabled ? 'ENABLED' : 'DISABLED'} successfully.`, 'info');
                      }}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-mono text-[9px] font-bold uppercase transition-all"
                    >
                      {dynamicRoutingEnabled ? 'DISABLE ROUTER' : 'ENABLE ROUTER'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: RELEASE READINESS */}
        {activeTab === 'release' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Release Audits list */}
              <div className="lg:col-span-6 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Pre-Release Compliance Auditing</span>
                    <p className="text-[10px] text-white/50">Run simulations, regressions, accessibility, and security checks before deployment.</p>
                  </div>

                  <button
                    onClick={handleRunReleaseAudit}
                    disabled={isAuditingRelease}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded text-xs font-mono font-bold uppercase flex items-center gap-1"
                  >
                    {isAuditingRelease ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    RUN FULL COMPLIANCE AUDIT
                  </button>
                </div>

                <div className="space-y-2.5 font-mono text-[10px]">
                  {releaseAudits.map((audit, i) => (
                    <div key={i} className="p-2.5 bg-black/40 border border-white/5 rounded flex justify-between items-center">
                      <div className="space-y-0.5">
                        <span className="text-white font-bold block">{audit.name}</span>
                        <span className="text-[9px] text-white/40 block">{audit.details}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[#10B981] font-bold">{audit.score}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">
                          {audit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Released Readiness Certificate */}
              <div className="lg:col-span-6 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Release Readiness Certification</span>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">
                    Generates a cryptographically signed operational readiness clearance required to push active changes to production nodes.
                  </p>
                </div>

                {releaseCertificate ? (
                  <div className="p-4 bg-black/60 border border-indigo-500/20 rounded font-mono text-[9px] text-cyan-400 overflow-y-auto max-h-[250px] leading-relaxed relative group">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(releaseCertificate);
                        logAction('RELEASE_AUDITOR', 'Copied compliance release certificate to workspace clipboard.', 'info');
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy Certificate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-white/90 select-text">{releaseCertificate}</pre>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center text-white/30 space-y-2">
                    <Award className="w-10 h-10 text-white/15" />
                    <p className="text-[11px] font-mono leading-relaxed max-w-[280px]">
                      Trigger "Run Full Compliance Audit" to generate the signed release certificate.
                    </p>
                  </div>
                )}

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded flex items-center gap-2 font-mono text-[9px] text-white/70">
                  <Shield className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>
                    Release certificate locks core configuration, protecting your production users against any breaking changes.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 7: SELF-HEALING ENGINE & TERMINAL */}
        {activeTab === 'selfhealing' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Quick Actions Panel */}
              <div className="lg:col-span-4 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Manual Overrides & Interventions</span>
                <p className="text-[10px] text-white/50 leading-relaxed mb-4">
                  Dispatch instant troubleshooting procedures and let the self-healing engine re-align cluster routing.
                </p>

                <div className="space-y-2.5 font-mono text-[10px]">
                  {[
                    { label: 'Restart Unhealthy Workers', desc: 'Hard restart worker pods safely', cmd: 'heal restart --node EU-WEST-02' },
                    { label: 'Rebalance Mission Queues', desc: 'Distribute loaded tasks safely', cmd: 'heal balance --queue mission-pool' },
                    { label: 'Flush Distributed Cache', desc: 'Clear stagnant index cache', cmd: 'heal clear --cache vector-db' },
                    { label: 'Rebuild Search Indexes', desc: 'Recompile vector schemas', cmd: 'heal repair --index search' },
                    { label: 'Rotate Connector Credentials', desc: 'Refurbish expired tokens', cmd: 'heal rotate --keys credentials' },
                    { label: 'Optimize Database Queries', desc: 'Dynamic index generation', cmd: 'heal optimize --db queries' }
                  ].map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleRunHealingRoutine(act.cmd)}
                      className="w-full p-2.5 bg-black/40 hover:bg-black/60 border border-white/5 hover:border-white/10 rounded text-left transition-all group"
                    >
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-white font-bold block">{act.label}</span>
                        <ChevronRight className="w-3 h-3 text-white/30 group-hover:text-indigo-400 transition-colors" />
                      </div>
                      <span className="text-[9px] text-white/40 block mb-1">{act.desc}</span>
                      <span className="text-[8px] font-mono text-indigo-400 font-semibold block">{act.cmd}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal Logs View */}
              <div className="lg:col-span-8 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Self-Healing Terminal & Audit Log</span>
                    <p className="text-[10px] text-white/50">Tracking automatic and manual platform correction activities.</p>
                  </div>
                  <span className="text-[10px] text-white/30 font-mono uppercase">REALTIME TELEMETRY</span>
                </div>

                {/* Simulated interactive terminal */}
                <div className="flex-1 bg-black/90 border border-white/10 rounded-lg p-4 font-mono text-[11px] leading-relaxed text-indigo-300 h-[300px] overflow-y-auto select-text custom-scrollbar space-y-1">
                  {healingLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.startsWith('$') ? 'text-white font-bold' :
                        log.startsWith('[SELF-HEALING]') ? 'text-emerald-400' :
                        log.startsWith('[✔]') ? 'text-cyan-400 pl-4' :
                        log.startsWith('[INFO]') || log.startsWith('[SYSTEM') ? 'text-white/60' : 'text-indigo-200'
                      }
                    >
                      {log}
                    </div>
                  ))}
                  <div ref={terminalBottomRef} />
                </div>

                {/* Input Prompt */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunHealingRoutine(terminalInput);
                  }}
                  className="flex items-center gap-2 bg-black border border-white/10 rounded px-3 py-1.5 mt-2"
                >
                  <span className="text-indigo-400 font-mono font-bold text-xs select-none">$</span>
                  <input
                    type="text"
                    placeholder="Type 'help' to view available healing directives..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent text-white font-mono text-xs outline-none border-none placeholder-white/30"
                  />
                  <button type="submit" className="text-indigo-400 hover:text-white transition-colors">
                    <Terminal className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
