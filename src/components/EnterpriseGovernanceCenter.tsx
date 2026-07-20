import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Shield,
  Workflow,
  Cpu,
  Layers,
  Network,
  Activity,
  FileCheck,
  History,
  Undo2,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  LifeBuoy,
  Database,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Settings2,
  FileText,
  ClipboardList,
  CheckSquare,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Lock,
  CheckCircle,
  Server,
  Clock,
  Coins,
  TrendingDown,
  SearchCheck,
  Layers2,
  BookOpen,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Flame,
  HelpCircle
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

interface EnterpriseGovernanceCenterProps {
  isDark: boolean;
  onAddLog: (log: LogEntry) => void;
}

// -------------------------------------------------------------------------
// HARDCODED ENUMS & INITIAL MOCK DATA
// -------------------------------------------------------------------------

const INITIAL_BUSINESS_UNITS = [
  { id: 'bu-1', name: 'AI Core Intelligence', leader: 'Dr. Evelyn Vance', deptCount: 3, projects: 8 },
  { id: 'bu-2', name: 'Distributed Mission Runtime', leader: 'Marcus Sterling', deptCount: 2, projects: 5 },
  { id: 'bu-3', name: 'Strategic Ops & Security', leader: 'Col. Sarah Jenkins', deptCount: 4, projects: 12 },
  { id: 'bu-4', name: 'Enterprise Integrations', leader: 'Hana Kimura', deptCount: 2, projects: 6 }
];

const INITIAL_SERVICE_CATALOG = [
  { id: 'sc-1', name: 'Cortex Decision Core', type: 'Application', owner: 'Evelyn Vance', state: 'Production', deps: ['Spanner-DB', 'Vector-Store-v3'], version: 'v4.2.1' },
  { id: 'sc-2', name: 'Slack MCP Connector', type: 'Connector', owner: 'Hana Kimura', state: 'Production', deps: ['Auth-Service'], version: 'v2.1.0' },
  { id: 'sc-3', name: 'Mission Generator Agent', type: 'Agent', owner: 'Marcus Sterling', state: 'Staging', deps: ['Cortex-Decision-Core'], version: 'v1.8.4-rc' },
  { id: 'sc-4', name: 'Self-Healing Engine', type: 'Workflow', owner: 'Marcus Sterling', state: 'Production', deps: ['Prometheus-Bridge'], version: 'v3.0.1' },
  { id: 'sc-5', name: 'Warborn Analytics API', type: 'API', owner: 'Sarah Jenkins', state: 'Production', deps: ['Cortex-Decision-Core'], version: 'v2.0.0' },
  { id: 'sc-6', name: 'Cortex RAG Embeddings', type: 'Data Model', owner: 'Evelyn Vance', state: 'Experimental', deps: ['Vector-Store-v3'], version: 'v0.9.1' }
];

const INITIAL_DEPLOYMENTS = [
  { id: 'dep-1', name: 'Cortex Decision Core', version: 'v4.2.1', type: 'App', env: 'Production', status: 'Healthy', strategy: 'Blue-Green', date: '2026-07-19 04:12', user: 'm.sterling' },
  { id: 'dep-2', name: 'Slack MCP Connector', version: 'v2.1.0', type: 'Plugin', env: 'Production', status: 'Healthy', strategy: 'Canary (10%)', date: '2026-07-18 21:45', user: 'h.kimura' },
  { id: 'dep-3', name: 'Mission Generator Agent', version: 'v1.8.4-rc', type: 'Agent', env: 'Staging', status: 'Testing', strategy: 'Recreate', date: '2026-07-19 08:05', user: 'e.vance' },
  { id: 'dep-4', name: 'Billing Pipeline', version: 'v3.2.0', type: 'Workflow', env: 'Staging', status: 'Rollback', strategy: 'Rolling', date: '2026-07-17 14:30', user: 's.jenkins' }
];

const INITIAL_RFCS = [
  { id: 'rfc-102', title: 'Migrate Vector Core to Pinecone Enterprise Cluster', type: 'Architecture Decision', author: 'Dr. Evelyn Vance', status: 'Approved', approvalState: 'Signed-Off', date: '2026-07-15' },
  { id: 'rfc-103', title: 'Add Cross-Tenant Isolation Framework for Core Runtime', type: 'RFC Document', author: 'Marcus Sterling', status: 'Under Review', approvalState: 'Pending Board', date: '2026-07-18' },
  { id: 'rfc-104', title: 'Deploy Regional Failover Validation Automation', type: 'Migration Plan', author: 'Col. Sarah Jenkins', status: 'Implemented', approvalState: 'Auto-Approved', date: '2026-07-12' },
  { id: 'rfc-105', title: 'Implement SLA Error Budget Alerts for MCP Connectors', type: 'Feature Request', author: 'Hana Kimura', status: 'Draft', approvalState: 'Draft', date: '2026-07-19' }
];

const INITIAL_INCIDENTS = [
  { id: 'inc-409', title: 'Vector Store Query Latency Spike', sev: 'P2', status: 'Mitigated', escalation: 'Level 2 Ops', elapsed: '42m', date: '2026-07-19 02:15', rca: 'Garbage collection pause on Vector-v3 node cluster. Solved via heap auto-tuning.' },
  { id: 'inc-410', title: 'MCP Hub Slack Socket Disconnection', sev: 'P3', status: 'Closed', escalation: 'Automated Recovery', elapsed: '3m', date: '2026-07-18 11:32', rca: 'Slack API rate limits hit on standard token. Switched to enterprise pooled gateway.' }
];

const INITIAL_FLAGS = [
  { key: 'ENABLE_COGNITIVE_FALLBACK', value: 'true', type: 'Boolean', scope: 'Global Policy', owner: 'Evelyn Vance' },
  { key: 'MAX_AGENTS_PER_MISSION', value: '16', type: 'Number', scope: 'Tenant Policy', owner: 'Marcus Sterling' },
  { key: 'ENFORCE_MFA_ADMIN_PORTAL', value: 'true', type: 'Boolean', scope: 'Security Baseline', owner: 'Sarah Jenkins' },
  { key: 'REGIONAL_FAILOVER_TIMEOUT_MS', value: '45000', type: 'Number', scope: 'Runtime Config', owner: 'Col. Sarah Jenkins' }
];

const AUDIT_LOG_MOCKS = [
  { id: 'aud-9201', user: 'callmepnj@gmail.com', action: 'PROMOTE_TO_PRODUCTION', target: 'Slack MCP Connector v2.1.0', result: 'SUCCESS', ip: '192.168.10.45', time: '2026-07-19T08:12:30Z' },
  { id: 'aud-9202', user: 'e.vance@warborn.ai', action: 'APPROVE_RFC', target: 'RFC-102: Vector Pinecone Migration', result: 'APPROVED', ip: '10.250.4.12', time: '2026-07-19T07:44:12Z' },
  { id: 'aud-9203', user: 'system-monitor', action: 'SECURITY_COMPLIANCE_SCAN', target: 'Environment: Production', result: 'PASS (0 Vulnerabilities)', ip: '127.0.0.1', time: '2026-07-19T06:00:00Z' },
  { id: 'aud-9204', user: 's.jenkins@warborn.ai', action: 'UPDATE_FEATURE_FLAG', target: 'ENFORCE_MFA_ADMIN_PORTAL = true', result: 'UPDATED', ip: '10.250.9.88', time: '2026-07-18T22:15:00Z' }
];

export default function EnterpriseGovernanceCenter({ isDark, onAddLog }: EnterpriseGovernanceCenterProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'org-catalog' | 'pipeline-change' | 'ops-incidents' | 'finops-data' | 'admin-compliance'>('overview');

  // Interactive state lists
  const [businessUnits, setBusinessUnits] = useState(INITIAL_BUSINESS_UNITS);
  const [serviceCatalog, setServiceCatalog] = useState(INITIAL_SERVICE_CATALOG);
  const [deployments, setDeployments] = useState(INITIAL_DEPLOYMENTS);
  const [rfcs, setRfcs] = useState(INITIAL_RFCS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [auditLogs, setAuditLogs] = useState(AUDIT_LOG_MOCKS);

  // New item states
  const [newBUName, setNewBUName] = useState('');
  const [newBULeader, setNewBULeader] = useState('');
  
  const [newRFCTitle, setNewRFCTitle] = useState('');
  const [newRFCType, setNewRFCType] = useState('RFC Document');
  const [newRFCAuthor, setNewRFCAuthor] = useState('callmepnj@gmail.com');

  const [newFlagKey, setNewFlagKey] = useState('');
  const [newFlagVal, setNewFlagVal] = useState('');
  const [newFlagScope, setNewFlagScope] = useState('Global Policy');

  const [newIncTitle, setNewIncTitle] = useState('');
  const [newIncSev, setNewIncSev] = useState('P2');

  // Drill simulations & load indicators
  const [isDeploying, setIsDeploying] = useState<string | null>(null);
  const [isTestingFailover, setIsTestingFailover] = useState(false);
  const [isVerifyingBackup, setIsVerifyingBackup] = useState(false);
  const [complianceScanActive, setComplianceScanActive] = useState(false);
  const [complianceScore, setComplianceScore] = useState(98.4);
  const [failoverLogs, setFailoverLogs] = useState<string[]>([]);
  const [activeDrillStep, setActiveDrillStep] = useState<string>('');

  const logAction = (module: string, message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    onAddLog({
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    });
  };

  // Onboarding tasks & customer success
  const [onboardingTasks, setOnboardingTasks] = useState([
    { id: 1, text: 'Enable MFA Policy across active Administrators group', done: true },
    { id: 2, text: 'Register & configure regional disaster recovery endpoint', done: false },
    { id: 3, text: 'Approve pending RFC-103 architectural isolations', done: false },
    { id: 4, text: 'Execute the periodic region-failover simulation drill', done: false },
    { id: 5, text: 'Verify automated Spanner database point-in-time recovery restore', done: true }
  ]);

  const toggleOnboardingTask = (id: number) => {
    setOnboardingTasks(tasks =>
      tasks.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
    logAction('CUSTOMER SUCCESS', `Toggled onboarding requirement #${id}`, 'info');
  };

  // -------------------------------------------------------------------------
  // INTERACTIVE ACTION HANDLERS
  // -------------------------------------------------------------------------

  const handleAddBU = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBUName.trim() || !newBULeader.trim()) return;
    const newBU = {
      id: `bu-${Date.now()}`,
      name: newBUName,
      leader: newBULeader,
      deptCount: 1,
      projects: 0
    };
    setBusinessUnits([...businessUnits, newBU]);
    logAction('ORGANIZATION CENTER', `Created Business Unit: ${newBUName} led by ${newBULeader}`, 'info');
    
    // Add compliance footprint log
    const newAudit = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      user: 'callmepnj@gmail.com',
      action: 'CREATE_BUSINESS_UNIT',
      target: newBUName,
      result: 'SUCCESS',
      ip: '192.168.10.45',
      time: new Date().toISOString()
    };
    setAuditLogs([newAudit, ...auditLogs]);
    setNewBUName('');
    setNewBULeader('');
  };

  const handleAddRFC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRFCTitle.trim()) return;
    const newRFC = {
      id: `rfc-${100 + rfcs.length + 2}`,
      title: newRFCTitle,
      type: newRFCType,
      author: newRFCAuthor,
      status: 'Draft',
      approvalState: 'Draft',
      date: new Date().toISOString().split('T')[0]
    };
    setRfcs([newRFC, ...rfcs]);
    logAction('CHANGE MANAGEMENT', `Registered changes: ${newRFCTitle} (${newRFCType})`, 'info');
    
    const newAudit = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      user: newRFCAuthor,
      action: 'SUBMIT_RFC',
      target: `${newRFC.id}: ${newRFCTitle}`,
      result: 'SUCCESS',
      ip: '192.168.10.45',
      time: new Date().toISOString()
    };
    setAuditLogs([newAudit, ...auditLogs]);
    setNewRFCTitle('');
  };

  const handleAddFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlagKey.trim() || !newFlagVal.trim()) return;
    const newFlag = {
      key: newFlagKey.toUpperCase().replace(/\s+/g, '_'),
      value: newFlagVal,
      type: isNaN(Number(newFlagVal)) ? (newFlagVal === 'true' || newFlagVal === 'false' ? 'Boolean' : 'String') : 'Number',
      scope: newFlagScope,
      owner: 'callmepnj@gmail.com'
    };
    setFlags([...flags, newFlag]);
    logAction('CONFIGURATION MANAGEMENT', `Set Environment Variable / Flag: ${newFlag.key} to ${newFlagVal}`, 'info');
    
    const newAudit = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      user: 'callmepnj@gmail.com',
      action: 'SET_CONFIG_FLAG',
      target: `${newFlag.key} = ${newFlagVal}`,
      result: 'SUCCESS',
      ip: '192.168.10.45',
      time: new Date().toISOString()
    };
    setAuditLogs([newAudit, ...auditLogs]);
    setNewFlagKey('');
    setNewFlagVal('');
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncTitle.trim()) return;
    const newInc = {
      id: `inc-${400 + incidents.length + 11}`,
      title: newIncTitle,
      sev: newIncSev,
      status: 'Investigating',
      escalation: newIncSev === 'P1' ? 'P1 Command Center (Executive)' : 'Level 2 Tier 1 Ops',
      elapsed: '1m',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      rca: 'Under active diagnosis. Core Telemetry streams linked.'
    };
    setIncidents([newInc, ...incidents]);
    logAction('INCIDENT MANAGEMENT', `CRITICAL ALARM raised: [${newIncSev}] ${newIncTitle}`, 'error');
    
    const newAudit = {
      id: `aud-${Date.now().toString().slice(-4)}`,
      user: 'Automated Agent',
      action: 'TRIGGER_INCIDENT',
      target: `${newInc.id}: ${newIncTitle}`,
      result: 'ALERTING',
      ip: '127.0.0.1',
      time: new Date().toISOString()
    };
    setAuditLogs([newAudit, ...auditLogs]);
    setNewIncTitle('');
  };

  // Run deployment simulation (Canary, Rollback, Blue-Green)
  const triggerDeployAction = (depId: string, action: 'rollback' | 'promote' | 'canary') => {
    setIsDeploying(depId);
    logAction('SOFTWARE DELIVERY', `Initiated deployment action [${action.toUpperCase()}] for release pipeline ID: ${depId}`, 'info');
    
    setTimeout(() => {
      setDeployments(prev =>
        prev.map(d => {
          if (d.id === depId) {
            if (action === 'rollback') {
              return { ...d, status: 'Healthy', version: `v${parseFloat(d.version.replace('v', '')) - 1}.0.0-rolledback`, date: 'Just Now', strategy: 'Rollback' };
            } else if (action === 'promote') {
              return { ...d, status: 'Healthy', env: 'Production', date: 'Just Now', strategy: 'Blue-Green' };
            } else if (action === 'canary') {
              return { ...d, status: 'Testing', strategy: 'Canary (50% traffic)', date: 'Just Now' };
            }
          }
          return d;
        })
      );
      
      const targetDep = deployments.find(d => d.id === depId);
      const newAudit = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        user: 'callmepnj@gmail.com',
        action: `DEPLOY_${action.toUpperCase()}`,
        target: targetDep?.name || 'Service Pipeline',
        result: 'SUCCESS',
        ip: '192.168.10.45',
        time: new Date().toISOString()
      };
      setAuditLogs([newAudit, ...auditLogs]);
      setIsDeploying(null);
      logAction('SOFTWARE DELIVERY', `Completed [${action.toUpperCase()}] for ${targetDep?.name || 'Service Pipeline'} with status: HEALTHY`, 'info');
    }, 1800);
  };

  // Run disaster recovery failover validation drill
  const runFailoverDrill = () => {
    if (isTestingFailover) return;
    setIsTestingFailover(true);
    setFailoverLogs([]);
    setActiveDrillStep('Initializing disaster recovery failover drill...');
    logAction('BUSINESS CONTINUITY', 'Disaster Recovery region failover dry-run requested.', 'warn');

    const steps = [
      'Step 1/5: Isolating Primary Region us-central1 (Simulating severe regional blackout)...',
      'Step 2/5: Diverting ingress router traffic (Cloud DNS steering towards replica cluster eu-west1)...',
      'Step 3/5: Promoting Read-Replica Spanner Database instance "cortex-spanner-eu" to Primary Leader status...',
      'Step 4/5: Re-routing local MQ message brokers & warming up microservice containers in replica cluster...',
      'Step 5/5: Region Failover completed successfully in 14.8 seconds! RTO = 15s Met, RPO = 0s Met.'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setFailoverLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${steps[current]}`]);
        setActiveDrillStep(steps[current]);
        current++;
      } else {
        clearInterval(interval);
        setIsTestingFailover(false);
        setActiveDrillStep('All DR drills validated. Recovery posture is: PREPARED.');
        logAction('BUSINESS CONTINUITY', 'Disaster Recovery drill completed. 100% data integrity verified.', 'info');
        
        const newAudit = {
          id: `aud-${Date.now().toString().slice(-4)}`,
          user: 'callmepnj@gmail.com',
          action: 'DISASTER_RECOVERY_DRILL',
          target: 'Failover: us-central1 -> eu-west1',
          result: 'SUCCESS',
          ip: '192.168.10.45',
          time: new Date().toISOString()
        };
        setAuditLogs([newAudit, ...auditLogs]);
      }
    }, 1200);
  };

  // Run Backup restore validation drill
  const runBackupVerification = () => {
    if (isVerifyingBackup) return;
    setIsVerifyingBackup(true);
    logAction('DATA GOVERNANCE', 'Initiating automated Spanner database restore-integrity verification audit...', 'info');
    
    setTimeout(() => {
      setIsVerifyingBackup(false);
      logAction('DATA GOVERNANCE', 'Point-in-Time-Recovery (PITR) verified. Restored dataset hash exactly matches active cluster hash.', 'info');
      
      const newAudit = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        user: 'system-governor',
        action: 'VERIFY_BACKUP_INTEGRITY',
        target: 'Backup Snapshot ID: spanner-daily-2026-07-19',
        result: 'PASSED_INTEGRITY',
        ip: '127.0.0.1',
        time: new Date().toISOString()
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }, 1600);
  };

  // Run Compliance check scanner
  const runComplianceScan = () => {
    if (complianceScanActive) return;
    setComplianceScanActive(true);
    logAction('AUDIT & COMPLIANCE', 'Triggered full enterprise-wide security & SOC2 policy compliance scanning...', 'info');

    setTimeout(() => {
      setComplianceScanActive(false);
      const improvement = parseFloat((Math.random() * 0.8 + 0.1).toFixed(2));
      setComplianceScore(prev => Math.min(100, parseFloat((prev + improvement).toFixed(2))));
      logAction('AUDIT & COMPLIANCE', 'Policy scanning completed. 18 baseline policies verified. Compliance score optimized.', 'info');
      
      const newAudit = {
        id: `aud-${Date.now().toString().slice(-4)}`,
        user: 'callmepnj@gmail.com',
        action: 'RUN_COMPLIANCE_SCAN',
        target: 'Compliance score recalculated',
        result: 'OPTIMIZED',
        ip: '192.168.10.45',
        time: new Date().toISOString()
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }, 1500);
  };

  const handleExportAuditReport = () => {
    const textContent = `WARBORN COMPLIANCE REPORT\nDate: ${new Date().toISOString()}\nAudit logs count: ${auditLogs.length}\nCompliance score: ${complianceScore}%\nActive BUs: ${businessUnits.length}\nActive Service Catalog: ${serviceCatalog.length}\nFlags configured: ${flags.length}\nActive Incidents: ${incidents.filter(i => i.status !== 'Closed').length}\n\nImmutable logs:\n` + 
      auditLogs.map(l => `[${l.time}] ${l.user} performed ${l.action} on ${l.target} -> RESULT: ${l.result}`).join('\n');
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `warborn-governance-audit-${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    logAction('AUDIT & COMPLIANCE', 'Exported encrypted regulatory compliance report TXT format.', 'info');
  };

  // -------------------------------------------------------------------------
  // CHART DATA DEFINITIONS
  // -------------------------------------------------------------------------

  const modelCostsData = [
    { name: 'Gemini 3.5 Flash', cost: 1240, queries: 320000, value: 35 },
    { name: 'Gemini 3.1 Pro', cost: 2850, queries: 45000, value: 55 },
    { name: 'Cortex Fine-Tuned', cost: 680, queries: 120000, value: 10 }
  ];

  const tenantCostsData = [
    { tenant: 'Enterprise Alpha', infrastructure: 480, model: 1200, storage: 210 },
    { tenant: 'Defense Beta', infrastructure: 720, model: 1800, storage: 450 },
    { tenant: 'Commerce Gamma', infrastructure: 220, model: 650, storage: 120 },
    { tenant: 'Gov Delta', infrastructure: 900, model: 2400, storage: 800 }
  ];

  const slaAvailabilityHistory = [
    { name: 'Jan', availability: 99.95, latency: 154, errorBudget: 95 },
    { name: 'Feb', availability: 99.97, latency: 148, errorBudget: 92 },
    { name: 'Mar', availability: 99.98, latency: 140, errorBudget: 89 },
    { name: 'Apr', availability: 99.96, latency: 146, errorBudget: 84 },
    { name: 'May', availability: 99.99, latency: 135, errorBudget: 90 },
    { name: 'Jun', availability: 99.98, latency: 142, errorBudget: 94 },
    { name: 'Jul (YTD)', availability: 99.985, latency: 132, errorBudget: 98 }
  ];

  const platformAdoptionData = [
    { name: 'Onboarded', count: 480 },
    { name: 'Active Users', count: 320 },
    { name: 'Integrators', count: 180 },
    { name: 'Admins', count: 14 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div id="enterprise-governance-hub" className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans border border-slate-800 rounded-xl max-w-7xl mx-auto shadow-2xl space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-emerald-950/40 text-emerald-400 rounded border border-emerald-800/50">
              <Shield className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-mono text-xs font-semibold text-emerald-400 tracking-widest uppercase">
              Phase 10 Operations
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            Warborn Enterprise Governance Center
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Centralized enterprise lifecycle portal: manage organizations, audit software delivery pipelines, enforce compliance posture, resolve incidents, track FinOps costs, and ensure disaster readiness.
          </p>
        </div>

        {/* TOP STATUS CARD */}
        <div className="flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-3 self-start md:self-auto">
          <div className="text-right border-r border-slate-800 pr-4">
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">Compliance Index</span>
            <span className="text-xl font-bold text-emerald-400 font-mono">{complianceScore}%</span>
          </div>
          <div className="text-right pr-2">
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">Core Active SLO</span>
            <span className="text-xl font-bold text-blue-400 font-mono">99.985%</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL OPERATIONAL CATEGORY TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-3">
        <button
          id="tab-overview"
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'overview'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview & SLA
        </button>
        <button
          id="tab-org-catalog"
          onClick={() => setActiveSubTab('org-catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'org-catalog'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Org & Service Catalog
        </button>
        <button
          id="tab-pipeline-change"
          onClick={() => setActiveSubTab('pipeline-change')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'pipeline-change'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Workflow className="w-4 h-4" />
          Pipeline & Change Management
        </button>
        <button
          id="tab-ops-incidents"
          onClick={() => setActiveSubTab('ops-incidents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'ops-incidents'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Incident & Continuity DR
        </button>
        <button
          id="tab-finops-data"
          onClick={() => setActiveSubTab('finops-data')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'finops-data'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Coins className="w-4 h-4" />
          FinOps & Data Governance
        </button>
        <button
          id="tab-admin-compliance"
          onClick={() => setActiveSubTab('admin-compliance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs tracking-wider transition-all uppercase border ${
            activeSubTab === 'admin-compliance'
              ? 'bg-emerald-950/40 border-emerald-600 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Compliance & QA Center
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="grid grid-cols-1 gap-6">

        {/* SUBTAB 1: OVERVIEW & SLA */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Global Platform Adoption</span>
                <span className="text-2xl font-bold text-white font-mono">1,480 users</span>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+12.4% Active this week</span>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Total Active License Allocation</span>
                <span className="text-2xl font-bold text-white font-mono">92.5%</span>
                <div className="text-[10px] text-slate-500">
                  14 Admin Licenses, 250 Developer seats
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Active Storage Utilization</span>
                <span className="text-2xl font-bold text-white font-mono">4.12 TB</span>
                <div className="text-[10px] text-emerald-400">
                  Capacity: 12 TB (34.3% Used)
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-1">
                <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider block">Total Monthly API & Token Count</span>
                <span className="text-2xl font-bold text-white font-mono">412.5M</span>
                <div className="text-[10px] text-amber-500 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Avg Latency: 132ms</span>
                </div>
              </div>
            </div>

            {/* SLA HISTORICAL TREND & PLAN */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Enterprise SLO Historical Trends</h3>
                    <p className="text-xs text-slate-400">Target Availability: 99.95% | Latency target: &lt;150ms</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-mono">
                    <span className="text-emerald-400">● Core Availability (%)</span>
                    <span className="text-blue-400">● Avg Latency (ms)</span>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={slaAvailabilityHistory}>
                      <defs>
                        <linearGradient id="availGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                      <YAxis yAxisId="left" stroke="#64748b" fontSize={10} domain={[99.9, 100]} />
                      <YAxis yAxisId="right" stroke="#64748b" fontSize={10} orientation="right" domain={[100, 200]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Area yAxisId="left" type="monotone" dataKey="availability" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#availGrad)" name="Availability %" />
                      <Area yAxisId="right" type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" name="Avg Latency (ms)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* SERVICE LEVEL OBJECTIVES COMPLIANCE */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  SLA / SLO Objectives Status
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-300">Cortex API Uptime (99.99%)</span>
                      <span className="font-mono text-emerald-400">99.998%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '99.99%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-300">Slack MCP Connector Uptime (99.9%)</span>
                      <span className="font-mono text-emerald-400">99.95%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '99.95%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-300">Mission Planning Latency (&lt;250ms)</span>
                      <span className="font-mono text-emerald-400">132ms</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-slate-300">Remaining Error Budget YTD</span>
                      <span className="font-mono text-emerald-400">98.4%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '98.4%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ADMISSION & ONBOARDING (CUSTOMER SUCCESS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    Customer Success Onboarding Checklist
                  </h3>
                  <span className="text-[10px] font-mono bg-blue-950 text-blue-400 px-2 py-0.5 rounded border border-blue-800/50">
                    {onboardingTasks.filter(t => t.done).length} / {onboardingTasks.length} Done
                  </span>
                </div>
                <p className="text-slate-400 text-xs">Verify key workspace milestones for enterprise-ready adoption:</p>
                <div className="space-y-2 text-xs">
                  {onboardingTasks.map(t => (
                    <div
                      key={t.id}
                      onClick={() => toggleOnboardingTask(t.id)}
                      className="flex items-center gap-3 p-2.5 bg-slate-950/70 border border-slate-800 rounded hover:border-slate-700 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={t.done}
                        readOnly
                        className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className={`flex-1 ${t.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>{t.text}</span>
                      {t.done ? (
                        <span className="text-[9px] text-emerald-400 font-mono">Passed</span>
                      ) : (
                        <span className="text-[9px] text-amber-400 font-mono">Action Needed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* USAGE RECOMMENDATIONS & HEALTH SCORE */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-emerald-400" />
                    Strategic Health & Recommendation Engine
                  </h3>
                  <div className="flex items-center gap-4 mt-3 bg-slate-950 p-3 rounded border border-slate-800">
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 flex items-center justify-center font-mono font-bold text-lg text-emerald-400">
                      A+
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-semibold text-white">Platform Health Rating: 94.6 / 100</span>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Cortex Nodes have high cohesion and low fault counts. Memory index pruning has optimized vector retrieval times by 14%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Actions Suggested:</span>
                  <div className="p-2.5 bg-slate-950 text-xs border-l-2 border-emerald-500 text-slate-300 rounded-r">
                    <span className="font-bold text-white block">Promote "Mission Generator Agent" to Production</span>
                    Staging baseline verification passed with 100% regression coverage.
                  </div>
                  <div className="p-2.5 bg-slate-950 text-xs border-l-2 border-amber-500 text-slate-300 rounded-r">
                    <span className="font-bold text-white block">Rotate API Keys for Slack MCP Connector</span>
                    Slack integrations credential lifespan is approaching the 90-day security threshold.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ORGANIZATIONS & SERVICE CATALOG */}
        {activeSubTab === 'org-catalog' && (
          <div className="space-y-6 animate-fade-in">
            {/* BUSINESS UNITS & DEPARTMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* BUSINESS UNITS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Enterprise Business Units</h3>
                    <p className="text-xs text-slate-400">Structure of organizational entities & department counts</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800/50 px-2 py-0.5 rounded">
                    {businessUnits.length} Units Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {businessUnits.map(bu => (
                    <div key={bu.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-bold text-white">{bu.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">Leader: {bu.leader}</span>
                        </div>
                        <Building2 className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="flex gap-4 font-mono text-xs text-slate-400">
                        <div>
                          <span className="block text-white text-sm">{bu.deptCount}</span>
                          Departments
                        </div>
                        <div>
                          <span className="block text-white text-sm">{bu.projects}</span>
                          Active Projects
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ADD NEW BU FORM */}
                <form onSubmit={handleAddBU} className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-white uppercase tracking-wider block">Add Corporate Business Unit</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Unit Name (e.g. Cognitive Systems)"
                      value={newBUName}
                      onChange={e => setNewBUName(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      placeholder="Leader (e.g. Dr. Jane Doe)"
                      value={newBULeader}
                      onChange={e => setNewBULeader(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold transition-colors ml-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Business Unit
                  </button>
                </form>
              </div>

              {/* ENVIRONMENTS & COMPLIANCE CHANNELS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Environments Isolation Posture
                </h3>
                <p className="text-xs text-slate-400">Governance policies enforced across active clusters:</p>
                
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-emerald-400 block font-mono">PRODUCTION</span>
                      <span className="text-[10px] text-slate-400">Locked down. Auto Rollbacks Active.</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-mono">Enforced</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-blue-400 block font-mono">STAGING</span>
                      <span className="text-[10px] text-slate-400">Continuous pre-deploy performance testing.</span>
                    </div>
                    <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-mono">Enforced</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-amber-400 block font-mono">TESTING</span>
                      <span className="text-[10px] text-slate-400">Simulated load injectors enabled.</span>
                    </div>
                    <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-mono">Active</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-purple-400 block font-mono">DEVELOPMENT</span>
                      <span className="text-[10px] text-slate-400">Cortex sandbox testing logs streamed.</span>
                    </div>
                    <span className="text-[10px] bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-mono">Active</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Cross-Org Collaboration Gateway</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Allow Federated Agent Discovery</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICE CATALOG INVENTORY */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers2 className="w-4 h-4 text-emerald-400" />
                    Platform Service Catalog
                  </h3>
                  <p className="text-xs text-slate-400">Verified repository of applications, workflows, models, and connectors</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono bg-slate-950 text-slate-400 px-2.5 py-1 rounded border border-slate-800">
                    Total Assets: {serviceCatalog.length}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2.5 px-3">Asset Name</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Owner</th>
                      <th className="py-2.5 px-3">Lifecycle State</th>
                      <th className="py-2.5 px-3">Direct Dependencies</th>
                      <th className="py-2.5 px-3">Latest Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceCatalog.map(asset => (
                      <tr key={asset.id} className="border-b border-slate-800/60 hover:bg-slate-950/40 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${asset.state === 'Production' ? 'bg-emerald-500' : asset.state === 'Staging' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                          {asset.name}
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono text-[10px]">{asset.type}</td>
                        <td className="py-3 px-3 text-slate-400">{asset.owner}</td>
                        <td className="py-3 px-3">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                            asset.state === 'Production'
                              ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-400'
                              : asset.state === 'Staging'
                              ? 'bg-blue-950/20 border-blue-800/60 text-blue-400'
                              : 'bg-amber-950/20 border-amber-800/60 text-amber-400'
                          }`}>
                            {asset.state}
                          </span>
                        </td>
                        <td className="py-3 px-3 flex flex-wrap gap-1">
                          {asset.deps.map((dep, idx) => (
                            <span key={idx} className="bg-slate-950 text-slate-400 text-[9px] font-mono px-1 py-0.5 rounded border border-slate-850">
                              {dep}
                            </span>
                          ))}
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono text-[11px]">{asset.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: DELIVERY & CHANGE MANAGEMENT */}
        {activeSubTab === 'pipeline-change' && (
          <div className="space-y-6 animate-fade-in">
            {/* DELIVERY PIPELINE CONTROL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* CURRENT DEPLOYMENTS & LIVE OPERATIONS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Software Delivery Pipeline</h3>
                    <p className="text-xs text-slate-400">Trigger promotional rollouts, run canary tests, or trigger instant rollbacks.</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    CD Active
                  </span>
                </div>

                <div className="space-y-3.5">
                  {deployments.map(dep => (
                    <div key={dep.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{dep.name}</span>
                            <span className="text-[11px] font-mono text-slate-400">{dep.version}</span>
                            <span className="text-[10px] bg-slate-900 text-slate-500 px-1.5 py-0.2 rounded border border-slate-800">{dep.type}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                            Released on {dep.date} by {dep.user} | Mode: {dep.strategy}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            dep.status === 'Healthy'
                              ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400'
                              : dep.status === 'Testing'
                              ? 'bg-blue-950/20 border-blue-800 text-blue-400'
                              : 'bg-red-950/20 border-red-800 text-red-400'
                          }`}>
                            {dep.status}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS DRAWER */}
                      <div className="flex flex-wrap items-center gap-2 border-t border-slate-900 pt-2.5">
                        <button
                          onClick={() => triggerDeployAction(dep.id, 'canary')}
                          disabled={isDeploying !== null}
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-750 rounded text-[10px] font-mono text-slate-300 disabled:opacity-50 transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${isDeploying === dep.id ? 'animate-spin' : ''}`} />
                          Canary Deployment
                        </button>
                        <button
                          onClick={() => triggerDeployAction(dep.id, 'promote')}
                          disabled={isDeploying !== null || dep.env === 'Production'}
                          className="flex items-center gap-1 px-2.5 py-1 bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/80 rounded text-[10px] font-mono text-blue-400 disabled:opacity-30 transition-colors"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          Promote to Prod
                        </button>
                        <button
                          onClick={() => triggerDeployAction(dep.id, 'rollback')}
                          disabled={isDeploying !== null}
                          className="flex items-center gap-1 px-2.5 py-1 bg-red-950/50 hover:bg-red-900/60 border border-red-800/80 rounded text-[10px] font-mono text-red-400 disabled:opacity-50 transition-colors ml-auto"
                        >
                          <Undo2 className="w-3 h-3" />
                          Emergency Rollback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAGING CERTIFICATIONS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Pre-Release Gating Policies
                </h3>
                <p className="text-xs text-slate-400">All code promotions require automated compliance certification checks:</p>
                
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                    <span className="text-slate-300">Unit Coverage &gt; 85%</span>
                    <span className="font-mono text-emerald-400 font-bold">Passed (92.4%)</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                    <span className="text-slate-300">Security Audit Scan</span>
                    <span className="font-mono text-emerald-400 font-bold">Passed (No Highs)</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                    <span className="text-slate-300">Cortex Schema Migration Validated</span>
                    <span className="font-mono text-emerald-400 font-bold">Passed</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded flex items-center justify-between">
                    <span className="text-slate-300">Enterprise SLA Simulation</span>
                    <span className="font-mono text-amber-400 font-bold">Warning (Latency spike in P99)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2 text-xs">
                  <span className="font-semibold text-white uppercase block text-[10px] font-mono">Manual Sign-off Override</span>
                  <p className="text-[11px] text-slate-400">Enforces board of directors authorization keys before promoting any P1 workflows.</p>
                  <button className="w-full py-1.5 bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono text-[10px] hover:bg-slate-850 transition-colors">
                    Request Admin Override Key
                  </button>
                </div>
              </div>
            </div>

            {/* CHANGE MANAGEMENT & RFCS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* SUBMIT NEW RFC */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-400" />
                  Initiate Change Event / RFC
                </h3>
                <p className="text-xs text-slate-400">Submit an architectural change request or migration roadmap for review.</p>

                <form onSubmit={handleAddRFC} className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Change Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Upgrade PostgreSQL Cluster to pg15"
                      value={newRFCTitle}
                      onChange={e => setNewRFCTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Change Type</label>
                      <select
                        value={newRFCType}
                        onChange={e => setNewRFCType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                      >
                        <option>RFC Document</option>
                        <option>Architecture Decision</option>
                        <option>Migration Plan</option>
                        <option>Feature Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Submitted By</label>
                      <input
                        type="text"
                        value={newRFCAuthor}
                        onChange={e => setNewRFCAuthor(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white rounded transition-colors"
                  >
                    Register RFC Document
                  </button>
                </form>
              </div>

              {/* RFC ARCHIVE TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Change Control & Architectural Records</h3>
                
                <div className="space-y-2.5">
                  {rfcs.map(rfc => (
                    <div key={rfc.id} className="p-3 bg-slate-950 border border-slate-800 rounded flex justify-between items-center text-xs">
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-900 px-1.5 py-0.2 rounded">
                            {rfc.id}
                          </span>
                          <span className="font-semibold text-white truncate block">{rfc.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Author: {rfc.author} | Date: {rfc.date} | Class: {rfc.type}
                        </p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                          rfc.status === 'Approved' || rfc.status === 'Implemented'
                            ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                            : rfc.status === 'Under Review'
                            ? 'bg-blue-950 border-blue-800 text-blue-400'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}>
                          {rfc.status}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">Stage: {rfc.approvalState}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: INCIDENTS, SLA, AND BUSINESS CONTINUITY */}
        {activeSubTab === 'ops-incidents' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ALARMS & INCIDENT MANAGEMENT */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Enterprise Alarm & Incident Center</h3>
                    <p className="text-xs text-slate-400">Tracks active site reliability anomalies, P1 incidents, and escalation workflows.</p>
                  </div>
                  <span className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-900 px-2 py-0.5 rounded">
                    SRE Hub
                  </span>
                </div>

                {/* LOG NEW SIMULATION INCIDENT */}
                <form onSubmit={handleCreateIncident} className="p-3 bg-slate-950 border border-slate-850 rounded-lg flex flex-col sm:flex-row gap-3 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Simulate Incident Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Memory leak on API endpoint /api/v1/summarize"
                      value={newIncTitle}
                      onChange={e => setNewIncTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="w-full sm:w-28">
                    <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Severity</label>
                    <select
                      value={newIncSev}
                      onChange={e => setNewIncSev(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                    >
                      <option>P1</option>
                      <option>P2</option>
                      <option>P3</option>
                      <option>P4</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-red-700 hover:bg-red-600 font-semibold text-xs text-white rounded transition-colors whitespace-nowrap"
                  >
                    Raise Fire Drill
                  </button>
                </form>

                <div className="space-y-3">
                  {incidents.map(inc => (
                    <div key={inc.id} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.2 rounded text-[10px] font-mono border font-bold ${
                              inc.sev === 'P1'
                                ? 'bg-red-950 text-red-400 border-red-600'
                                : 'bg-amber-950 text-amber-400 border-amber-800'
                            }`}>
                              {inc.sev}
                            </span>
                            <h4 className="text-sm font-semibold text-white">{inc.title}</h4>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                            Raised: {inc.date} | Response Escalation: {inc.escalation}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          inc.status === 'Closed' || inc.status === 'Mitigated'
                            ? 'bg-emerald-950/20 border-emerald-800 text-emerald-400'
                            : 'bg-red-950/20 border-red-800 text-red-400 animate-pulse'
                        }`}>
                          {inc.status}
                        </span>
                      </div>

                      <div className="p-2.5 bg-slate-900 rounded border border-slate-850 text-xs text-slate-400">
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-300 block mb-0.5">Root Cause Analysis (RCA)</span>
                        {inc.rca}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DISASTER RECOVERY DRILLS & RUNBOOKS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Business Continuity Posture
                </h3>
                <p className="text-xs text-slate-400">Audit failover readiness, RTO/RPO margins, and execute simulated failover drills:</p>

                <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Target Recovery Time (RTO)</span>
                    <span className="text-white">&lt; 30 seconds</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>Target Recovery Point (RPO)</span>
                    <span className="text-white">&lt; 1 second</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={runFailoverDrill}
                    disabled={isTestingFailover}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 font-semibold text-xs text-white rounded transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isTestingFailover ? 'animate-spin' : ''}`} />
                    Simulate Region Failover Drill
                  </button>
                  <button
                    onClick={runBackupVerification}
                    disabled={isVerifyingBackup}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 font-semibold text-xs text-slate-300 rounded transition-colors disabled:opacity-50"
                  >
                    <Database className={`w-4 h-4 ${isVerifyingBackup ? 'animate-pulse' : ''}`} />
                    Verify Point-in-Time Database Backups
                  </button>
                </div>

                {/* FAILOVER WORK LOGS */}
                {(isTestingFailover || failoverLogs.length > 0) && (
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block border-b border-slate-900 pb-1">
                      Drill Telemetry Stream
                    </span>
                    <p className="text-[11px] font-semibold text-blue-400">{activeDrillStep}</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 text-[10px] font-mono text-slate-400">
                      {failoverLogs.map((log, index) => (
                        <div key={index} className="leading-normal">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 5: FINOPS & DATA GOVERNANCE */}
        {activeSubTab === 'finops-data' && (
          <div className="space-y-6 animate-fade-in">
            {/* FINOPS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COST ALLOCATION PIE & CHANNELS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white uppercase tracking-wider">AI Model & Resource Cost Allocations</h3>
                    <p className="text-xs text-slate-400">Monthly breakdown across infrastructure clusters, tokens, storage, and models.</p>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded">
                    FinOps Audited
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Model Distribution Chart */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Model Costs (USD)</span>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={modelCostsData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="cost"
                          >
                            {modelCostsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-around text-[10px] font-mono">
                      {modelCostsData.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <span className="block" style={{ color: COLORS[idx] }}>● {item.name}</span>
                          <span className="text-white">${item.cost}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Tenant Resource Bar Chart */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Per-Tenant Infrastructure Breakdown</span>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tenantCostsData}>
                          <XAxis dataKey="tenant" stroke="#64748b" fontSize={9} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                          <Bar dataKey="infrastructure" fill="#3b82f6" stackId="a" name="Infra" />
                          <Bar dataKey="model" fill="#10b981" stackId="a" name="AI Models" />
                          <Bar dataKey="storage" fill="#8b5cf6" stackId="a" name="Storage" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-[9px] font-mono">
                      <span className="text-blue-400">■ Infra</span>
                      <span className="text-emerald-400">■ AI Models</span>
                      <span className="text-purple-400">■ Storage</span>
                    </div>
                  </div>
                </div>

                {/* FORECAST CALCULATOR */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-bold text-white block uppercase text-[10px] font-mono">Cost Forecasting Engine</span>
                    <p className="text-slate-400 text-[11px]">Calculates projected model expenditure based on active concurrency growth.</p>
                  </div>
                  <div className="flex gap-3 text-right">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-mono">Current Runrate</span>
                      <span className="text-white font-bold">$4,770/mo</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block text-[9px] font-mono">30d Project Forecast</span>
                      <span className="text-emerald-400 font-bold">$5,120/mo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DATA GOVERNANCE & ARCHIVING POLICIES */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Enterprise Data Governance
                </h3>
                <p className="text-xs text-slate-400">Enforce classification schemas, archiving boundaries, and retention baselines.</p>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-850 rounded">
                    <span className="font-semibold text-slate-300 block mb-1">Data Classification Schema</span>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-center">
                      <span className="p-1 bg-red-950/20 border border-red-900 text-red-400 rounded">Secret</span>
                      <span className="p-1 bg-amber-950/20 border border-amber-900 text-amber-400 rounded">Restricted</span>
                      <span className="p-1 bg-slate-900 border border-slate-800 text-slate-400 rounded">Public</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-850 rounded space-y-1.5">
                    <span className="font-semibold text-slate-300 block">Retention & Archiving Rules</span>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Cortex Mission History</span>
                      <span className="text-white">7 Years (Confidential)</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Ephemeral Workspace Logs</span>
                      <span className="text-white">90 Days (Auto Pruned)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-850 rounded space-y-2">
                    <span className="font-semibold text-slate-300 block text-[10px] font-mono">Point-In-Time Backup Schedule</span>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Daily snapshot snapshot trigger</span>
                      <span className="text-emerald-400">02:00 UTC (Active)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">Continuous logs retention</span>
                      <span className="text-emerald-400">PITR 35 Days (Active)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 6: COMPLIANCE, ADMIN, & QUALITY ASSURANCE */}
        {activeSubTab === 'admin-compliance' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* QUALITY ASSURANCE & METRIC BASELINES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* COMPLIANCE CHECKLIST & TRIGGER SCAN */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Regulatory Security Evidence
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-1.5 py-0.2 rounded">
                    SOC2 & ISO Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400">Continuous auditing of system boundaries and platform configurations.</p>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded flex justify-between items-center">
                    <span className="text-slate-300">Encryption of Rest & Transit</span>
                    <span className="text-emerald-400 font-bold font-mono">Verified (AES-256)</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded flex justify-between items-center">
                    <span className="text-slate-300">Identity Provisioning Auth (MFA)</span>
                    <span className="text-emerald-400 font-bold font-mono">Active (OIDC / SSO)</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded flex justify-between items-center">
                    <span className="text-slate-300">Immutable Audit Ledger Policy</span>
                    <span className="text-emerald-400 font-bold font-mono">Enforced (WORM Block)</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 border border-slate-850 rounded flex justify-between items-center">
                    <span className="text-slate-300">Workspace Sandbox Isolations</span>
                    <span className="text-emerald-400 font-bold font-mono">Active</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={runComplianceScan}
                    disabled={complianceScanActive}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${complianceScanActive ? 'animate-spin' : ''}`} />
                    Recalculate Compliance Score
                  </button>
                  <button
                    onClick={handleExportAuditReport}
                    className="w-full py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 font-semibold text-xs text-slate-300 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export Regulatory Evidence Package
                  </button>
                </div>
              </div>

              {/* IMMUTABLE AUDIT LOG VIEWER */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    Immutable Administrative Audit Ledger
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-950 border border-slate-850 px-2 py-0.5 rounded">
                    WORM Log Engine Active
                  </span>
                </div>
                
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {auditLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-950 border border-slate-800 rounded text-xs space-y-1 hover:border-slate-700 transition-colors">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="text-emerald-400 font-bold">{log.action}</span>
                        <span className="text-slate-500">{log.time}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 text-[11px]">
                        <span>Target: {log.target}</span>
                        <span className="text-slate-400">{log.user}</span>
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-500">
                        <span>IP: {log.ip}</span>
                        <span className="text-emerald-500">Hash verified</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QUALITY ASSURANCE BASES & CENTRALISED DOCUMENTATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* QUALITY ASSURANCE & REGRESSIONS */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Quality Assurance & Plugin Certification
                </h3>
                
                <div className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Regression Test Suite Coverage</span>
                      <span className="font-mono text-emerald-400">92.4%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[92.4%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Performance Benchmarks delta (vs baseline)</span>
                      <span className="font-mono text-emerald-400">Optimal (-4.5% Latency)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>A11y Accessibility Coverage Index</span>
                      <span className="font-mono text-emerald-400">98.2%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98.2%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Cross-Browser Compatibility Score</span>
                      <span className="font-mono text-emerald-400">100% Verified</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full"></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-850 rounded text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-300 block">Plugin Sandbox Certification</span>
                    <span className="text-[10px] text-slate-500">Automated isolation static code scanning on upload.</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-900 text-emerald-400 px-2 py-0.5 rounded font-mono">Enabled</span>
                </div>
              </div>

              {/* THE KNOWLEDGE & DOCUMENTATION CENTER */}
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Centralized Enterprise Documentation Center
                </h3>
                <p className="text-xs text-slate-400">Access comprehensive references and operational guides for administrators, engineers, and users.</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <a href="#doc-architecture" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">Architecture Manual</span>
                    <span className="text-[9px] text-slate-500">Module design principles & layouts</span>
                  </a>
                  <a href="#doc-api" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">API References</span>
                    <span className="text-[9px] text-slate-500">Cortex REST & JSON spec</span>
                  </a>
                  <a href="#doc-sdk" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">TypeScript SDK Guide</span>
                    <span className="text-[9px] text-slate-500">Integration templates</span>
                  </a>
                  <a href="#doc-administrator" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">Administrator Guide</span>
                    <span className="text-[9px] text-slate-500">Tenant & Policy governance</span>
                  </a>
                  <a href="#doc-developer" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">Developer Sandbox</span>
                    <span className="text-[9px] text-slate-500">Local cluster setup & runbooks</span>
                  </a>
                  <a href="#doc-user" className="p-2.5 bg-slate-950 border border-slate-850 hover:border-slate-700 rounded flex flex-col gap-0.5 group">
                    <span className="font-bold text-white group-hover:text-emerald-400 transition-colors">End-User Manual</span>
                    <span className="text-[9px] text-slate-500">Cortex interface walk-throughs</span>
                  </a>
                </div>
              </div>

            </div>

            {/* CONFIGURATION MANAGEMENT (FEATURE FLAGS & SECRETS) */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-emerald-400" />
                    Centralized Runtime Configuration & Secrets References
                  </h3>
                  <p className="text-xs text-slate-400">Declare environment variables, operational policies, and inject runtime key overrides.</p>
                </div>
                <span className="text-xs font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-850">
                  Total Parameters: {flags.length}
                </span>
              </div>

              {/* DECLARE NEW VALUE */}
              <form onSubmit={handleAddFlag} className="bg-slate-950 p-4 rounded-lg border border-slate-850 space-y-3">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider block font-mono">Inject Global / Tenant Config Variable</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="KEY_NAME (e.g. COGNITIVE_RETRY_POSTURE)"
                    value={newFlagKey}
                    onChange={e => setNewFlagKey(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. true, 18, high-availability)"
                    value={newFlagVal}
                    onChange={e => setNewFlagVal(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newFlagScope}
                    onChange={e => setNewFlagScope(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded p-2 text-xs text-slate-300 focus:outline-none"
                  >
                    <option>Global Policy</option>
                    <option>Tenant Policy</option>
                    <option>Security Baseline</option>
                    <option>Runtime Config</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-4 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Save Parameter Configuration
                </button>
              </form>

              {/* FLAGS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {flags.map((flag, index) => (
                  <div key={index} className="p-3 bg-slate-950 border border-slate-850 rounded space-y-1 text-xs">
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800 self-start">
                      {flag.scope}
                    </span>
                    <h4 className="font-mono font-bold text-white truncate">{flag.key}</h4>
                    <div className="flex justify-between items-center font-mono text-[10px]">
                      <span className="text-slate-500">Value:</span>
                      <span className="text-emerald-400 font-bold">{flag.value}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>Owner: {flag.owner.split('@')[0]}</span>
                      <span>Type: {flag.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
