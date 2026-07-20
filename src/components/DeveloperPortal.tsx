import React, { useState, useEffect } from 'react';
import {
  Code,
  Terminal,
  Cpu,
  Layers,
  Database,
  BarChart3,
  Globe,
  Sliders,
  Settings,
  Shield,
  Zap,
  Play,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Network,
  UploadCloud,
  ChevronRight,
  BookOpen,
  Search,
  Check,
  Copy,
  Eye,
  SlidersHorizontal,
  FolderCode,
  Workflow,
  Sparkles,
  RefreshCw,
  Clock,
  HelpCircle,
  FileCode,
  DollarSign,
  Fingerprint,
  UserCheck
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

interface DeveloperPortalProps {
  isDark: boolean;
  onAddLog: (log: LogEntry) => void;
}

export default function DeveloperPortal({ isDark, onAddLog }: DeveloperPortalProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'studio' | 'sdk' | 'skills' | 'agents' | 'data' | 'cli' | 'observability'>('studio');

  // Helper logger
  const logAction = (module: string, message: string, level: 'info' | 'warn' | 'error' = 'info') => {
    onAddLog({
      timestamp: new Date().toISOString(),
      level,
      module,
      message
    });
  };

  // ==========================================
  // STATE: 1. LOW CODE APP STUDIO
  // ==========================================
  const [apps, setApps] = useState<any[]>([
    {
      id: 'app-sap-sync',
      name: 'IntelliLedger SAP Bridge',
      version: '1.2.4',
      status: 'enabled',
      permissions: ['Storage', 'Cortex Memory', 'SAP Gateway'],
      routes: ['/api/sap/sync', '/api/sap/ledger'],
      componentsCount: 4,
      skillsCount: 2,
      deployment: 'Production (Multi-Region)',
      releaseChannel: 'Stable'
    },
    {
      id: 'app-legal-audit',
      name: 'ContractShield AI Validator',
      version: '0.9.1',
      status: 'enabled',
      permissions: ['Workspace Drive', 'Cortex Skills', 'PDF Parsing'],
      routes: ['/api/legal/upload', '/api/legal/verify'],
      componentsCount: 3,
      skillsCount: 1,
      deployment: 'Canary (10% Traffic)',
      releaseChannel: 'Beta'
    },
    {
      id: 'app-custom-crm',
      name: 'Warborn Smart CRM Extender',
      version: '2.0.0',
      status: 'disabled',
      permissions: ['CRM Gateway', 'Cortex Agents'],
      routes: ['/api/crm/leads', '/api/crm/scoring'],
      componentsCount: 6,
      skillsCount: 3,
      deployment: 'Staging',
      releaseChannel: 'Release Candidate'
    }
  ]);

  const [newAppName, setNewAppName] = useState('');
  const [newAppCategory, setNewAppCategory] = useState('Business');
  const [isDeployingApp, setIsDeployingApp] = useState(false);
  const [studioComponents, setStudioComponents] = useState<string[]>(['Analytics Chart', 'Data Table', 'AI Assistant Chatbox', 'Input Form']);
  const [canvasLayout, setCanvasLayout] = useState<string[]>(['AI Assistant Chatbox', 'Data Table']);
  const [canarySlider, setCanarySlider] = useState<number>(10);
  const [selectedTheme, setSelectedTheme] = useState<'Slate-Dark' | 'Cosmic-Blue' | 'Alpine-Light'>('Slate-Dark');

  const handleInstallApp = () => {
    if (!newAppName.trim()) return;
    const appId = `app-${newAppName.toLowerCase().replace(/\s+/g, '-')}`;
    const newApp = {
      id: appId,
      name: newAppName,
      version: '1.0.0',
      status: 'enabled',
      permissions: ['Storage', 'Cortex Memory', 'User profile'],
      routes: [`/api/${appId.replace('app-', '')}/main`],
      componentsCount: canvasLayout.length,
      skillsCount: 1,
      deployment: 'Staging',
      releaseChannel: 'Alpha'
    };
    setApps([...apps, newApp]);
    setNewAppName('');
    logAction('STUDIO', `Visual Low-Code App [${newApp.name}] generated and compiled successfully from canvas layout.`, 'info');
  };

  const handleToggleAppStatus = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'enabled' ? 'disabled' : 'enabled';
    setApps(apps.map(a => a.id === id ? { ...a, status: nextStatus } : a));
    logAction('PLATFORM_AS_A_SERVICE', `Application [${name}] has been ${nextStatus.toUpperCase()} inside tenant workspaces.`, 'warn');
  };

  const handleRemoveApp = (id: string, name: string) => {
    setApps(apps.filter(a => a.id !== id));
    logAction('PLATFORM_AS_A_SERVICE', `Application [${name}] removed completely from tenant workspace. Cleaned associated persistent schemas.`, 'warn');
  };

  // ==========================================
  // STATE: 2. APPLICATION SDK & INTERACTIVE EXPLORER
  // ==========================================
  const [sdkQuery, setSdkQuery] = useState('useCortexMemory');
  const [sdkParams, setSdkParams] = useState('{\n  "query": "Recent transactions limit 10",\n  "includeAudit": true\n}');
  const [sdkResponse, setSdkResponse] = useState<string>('// Select an API call or edit params and click Execute above.');
  const [isExecutingSdk, setIsExecutingSdk] = useState(false);

  const executeSdkCall = () => {
    setIsExecutingSdk(true);
    setSdkResponse('// Streaming API handshake initiated...\n// Dispatching transaction frame to Cortex Engine...');
    setTimeout(() => {
      try {
        const parsed = JSON.parse(sdkParams);
        setSdkResponse(JSON.stringify({
          status: 'success',
          timestamp: new Date().toISOString(),
          sdkMethod: sdkQuery,
          activeLeaderNode: 'cortex-core-primary-us-east',
          lockAcquired: true,
          data: {
            retrievedRecords: 14,
            matchedSynapses: [
              { synapseId: 'syn_89fa', confidence: 0.99, source: 'sap_ledger_dump' },
              { synapseId: 'syn_55cd', confidence: 0.92, source: 'contract_validator_m_102' }
            ],
            pipelineState: 'Stable',
            queryOffset: '0.04s',
            payload: parsed
          }
        }, null, 2));
        logAction('SDK_EXPLORER', `Executed API SDK Hook call [${sdkQuery}] in developers sandbox.`, 'info');
      } catch (err: any) {
        setSdkResponse(JSON.stringify({
          status: 'error',
          code: 'MALFORMED_JSON_ARGS',
          message: err.message
        }, null, 2));
        logAction('SDK_EXPLORER', `SDK Sandboxed compile failure: ${err.message}`, 'error');
      }
      setIsExecutingSdk(false);
    }, 1200);
  };

  // ==========================================
  // STATE: 3. REUSABLE AI SKILLS FRAMEWORK
  // ==========================================
  const [skills, setSkills] = useState<any[]>([
    {
      id: 'skill-ast-refactor',
      name: 'Semantic AST Code Transformer',
      description: 'Transforms code bases across languages using high-fidelity abstract syntax tree parser mappings.',
      inputs: ['sourceCode', 'targetFramework'],
      outputs: ['refactoredCodeCode', 'confidenceRating'],
      model: 'gemini-2.5-pro',
      cost: 0.0014,
      latency: 420,
      confidence: 98,
      safety: 'Strict sandboxed compile check enforced'
    },
    {
      id: 'skill-sentiment-risk',
      name: 'Predictive Ledger Risk Assessor',
      description: 'Reviews compliance transactions and flags accounts with anomalous high-frequency outflows.',
      inputs: ['ledgerDump', 'outflowThreshold'],
      outputs: ['riskScore', 'violatingNodes'],
      model: 'gemini-2.5-flash',
      cost: 0.0003,
      latency: 180,
      confidence: 94,
      safety: 'Anonymized tenant PII hashing'
    }
  ]);

  const [newSkill, setNewSkill] = useState({
    name: '',
    description: '',
    inputs: 'rawPayload',
    outputs: 'evaluationResult',
    model: 'gemini-2.5-pro',
    cost: 0.001
  });

  const handleCreateSkill = () => {
    if (!newSkill.name.trim()) return;
    const id = `skill-${newSkill.name.toLowerCase().replace(/\s+/g, '-')}`;
    const skillsPayload = {
      id,
      name: newSkill.name,
      description: newSkill.description,
      inputs: newSkill.inputs.split(',').map(s => s.trim()),
      outputs: newSkill.outputs.split(',').map(s => s.trim()),
      model: newSkill.model,
      cost: newSkill.cost,
      latency: 310,
      confidence: 96,
      safety: 'Standard input boundary sanitization verified'
    };
    setSkills([...skills, skillsPayload]);
    setNewSkill({ name: '', description: '', inputs: 'rawPayload', outputs: 'evaluationResult', model: 'gemini-2.5-pro', cost: 0.001 });
    logAction('SKILLS_ENGINE', `Registered custom reasoning AI skill: [${skillsPayload.name}] (v1.0.0)`, 'info');
  };

  // ==========================================
  // STATE: 4. CUSTOM AGENTS & CAPABILITIES
  // ==========================================
  const [agents, setAgents] = useState<any[]>([
    { id: 'agent-codex', name: 'AST Code Architect', role: 'Engineering Assistant', prompt: 'You are an elite systems compiler engine refactoring modular frameworks with high-fidelity typescript rules.', goal: 'Refactor complex monolithic codebase elements with high structural coverage.', tools: ['AST-Parser', 'Local Sandbox Compile', 'Memory Graph Index'], deployment: 'Enterprise Global' },
    { id: 'agent-fintech', name: 'Compliance Auditor', role: 'Financial Auditor', prompt: 'You are a SEC compliance supervisor parsing transaction logs for anti-money laundering anomalies.', goal: 'Audit distributed transaction queues and isolate suspicious multi-region routing paths.', tools: ['Ledger Analyzer', 'Vault Key Audit', 'Zap Notification Dispatcher'], deployment: 'Regional Secured' }
  ]);

  const [newAgent, setNewAgent] = useState({
    name: '',
    role: 'QA / Reliability Coordinator',
    prompt: '',
    goal: '',
    tool: 'AST-Parser',
    deployment: 'Enterprise Global'
  });

  const handleCreateAgent = () => {
    if (!newAgent.name.trim()) return;
    const id = `agent-${newAgent.name.toLowerCase().replace(/\s+/g, '-')}`;
    const createdAgent = {
      id,
      name: newAgent.name,
      role: newAgent.role,
      prompt: newAgent.prompt || 'Evaluate platform systems autonomously.',
      goal: newAgent.goal || 'Isolate runtime vulnerabilities and maintain continuous uptime.',
      tools: [newAgent.tool, 'Memory Graph Index'],
      deployment: newAgent.deployment
    };
    setAgents([...agents, createdAgent]);
    setNewAgent({ name: '', role: 'QA / Reliability Coordinator', prompt: '', goal: '', tool: 'AST-Parser', deployment: 'Enterprise Global' });
    logAction('AGENT_CLUSTER', `Deployed custom autonomous Agent [${createdAgent.name}] into Active Pool.`, 'info');
  };

  // ==========================================
  // STATE: 5. UNIVERSAL DATA ENTITY REGISTRY
  // ==========================================
  const [entities, setEntities] = useState<any[]>([
    { type: 'Contracts', category: 'Legal', searchIndexed: true, memoryLinked: true, auditTimeline: 12 },
    { type: 'Invoices', category: 'Finance', searchIndexed: true, memoryLinked: true, auditTimeline: 34 },
    { type: 'Software Tickets', category: 'Engineering', searchIndexed: true, memoryLinked: false, auditTimeline: 110 }
  ]);
  const [newEntityType, setNewEntityType] = useState('');
  const [newEntityCategory, setNewEntityCategory] = useState('Operations');

  const handleRegisterEntity = () => {
    if (!newEntityType.trim()) return;
    const newEnt = {
      type: newEntityType,
      category: newEntityCategory,
      searchIndexed: true,
      memoryLinked: true,
      auditTimeline: 0
    };
    setEntities([...entities, newEnt]);
    setNewEntityType('');
    logAction('DATA_MODEL', `Registered custom operational entity: [${newEnt.type}]. Semantic vector indexing active.`, 'info');
  };

  // ==========================================
  // STATE: 6. CLI INTERACTIVE TERMINAL
  // ==========================================
  const [cliLogs, setCliLogs] = useState<string[]>([
    'Warborn Platform CLI v7.4.1 (Distributed Node Terminal)',
    'Type "help" or run one of the starter commands below to execute SDK tasks.'
  ]);
  const [cliInput, setCliInput] = useState('');

  const executeCliCommand = (cmdText: string) => {
    const raw = cmdText.trim();
    if (!raw) return;

    let output = [`$ ${raw}`];
    const parts = raw.split(' ');
    const base = parts[0].toLowerCase();

    switch (base) {
      case 'help':
        output.push(
          'Available Commands:',
          '  warborn init <app-name>     - Generates a new self-contained app schema template',
          '  warborn deploy <app-id>     - Performs sandbox compilation and uploads to region cluster',
          '  warborn test plugin <id>    - Dispatches chaotic mocks to target extension lifecycle',
          '  warborn status              - Retrieves global leader consensus metrics',
          '  clear                       - Clears terminal output logs'
        );
        break;
      case 'clear':
        setCliLogs([]);
        setCliInput('');
        return;
      case 'warborn':
        const action = parts[1]?.toLowerCase();
        if (action === 'init') {
          const name = parts[2] || 'my-new-app';
          output.push(
            `Creating boilerplate for application: ${name}`,
            `[✔] Generated package.json manifest, UI layouts and ABAC permission schemas.`,
            `[✔] Formulated default routes: /api/${name}/main`,
            `Type "warborn deploy ${name}" to package and push to staging.`
          );
          logAction('CLI', `Developer generated local workspace project template: [${name}].`, 'info');
        } else if (action === 'deploy') {
          const appId = parts[2] || 'app-sap-sync';
          output.push(
            `Initiating build & deploy protocol for application: ${appId}`,
            `[1] Analyzing structural integrity and validating design tokens compliance...`,
            `[2] Injecting secure client-side and server-side RPC bindings...`,
            `[3] Deploying signed package payload into Sandbox container cluster...`,
            `[✔] SUCCESS. Application [${appId}] deployed to Production. Multi-Region active.`
          );
          logAction('CLI', `Interactive CLI trigger: Deployed application [${appId}].`, 'info');
        } else if (action === 'test' && parts[2]?.toLowerCase() === 'plugin') {
          const plugId = parts[3] || 'plug-slack-mcp';
          output.push(
            `Mock testing plugin extension: ${plugId}`,
            `[INFO] Hooking mock connector context provider...`,
            `[INFO] Triggering sandbox initialization hook...`,
            `[✔] Life cycle callbacks completed. Memory footprint: 4.12 KB. Latency: 12ms.`,
            `[✔] STATUS: PASS (Zero memory leaks, secure vault access passed).`
          );
        } else if (action === 'status') {
          output.push(
            `Leader Node ID: cortex-core-primary-us-east`,
            `Active Term: TERM-24951`,
            `Quorum Nodes: 4 of 5 online`,
            `Platform Consensus Level: SECURE (99.98% reliability audit)`
          );
        } else {
          output.push('Unknown warborn sub-command. Type "help" for a list of valid routines.');
        }
        break;
      default:
        output.push(`Command not found: "${base}". Type "help" to list valid options.`);
    }

    setCliLogs(prev => [...prev, ...output]);
    setCliInput('');
  };

  // ==========================================
  // STATE: 7. OBSERVABILITY DATA
  // ==========================================
  const appMetricsHistory = [
    { name: '10:00', cpu: 22, mem: 48, requests: 120, latency: 12 },
    { name: '11:00', cpu: 45, mem: 52, requests: 280, latency: 15 },
    { name: '12:00', cpu: 78, mem: 61, requests: 540, latency: 28 },
    { name: '13:00', cpu: 91, mem: 84, requests: 920, latency: 42 },
    { name: '14:00', cpu: 52, mem: 71, requests: 410, latency: 18 },
    { name: '15:00', cpu: 34, mem: 65, requests: 310, latency: 14 }
  ];

  return (
    <div className="space-y-6" id="dev-portal-view-container">
      {/* ------------------ HUB TITLE HEADER ------------------ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-sm bg-gradient-to-br from-indigo-500 to-[#10B981] text-white shadow-lg">
              <Code className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight uppercase font-display text-white">
              Cortex App Studio & Developer Hub
            </h1>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Warborn Platform PaaS — Build, configure, validate, and distribute custom AI-native applications with zero monolithic core code edits.
          </p>
        </div>

        {/* Global Developer Channel indicator */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-white/80">
            <Fingerprint className="w-3.5 h-3.5 text-indigo-400" />
            <span>DEV TENANT SIGNED: callmepnj@gmail.com</span>
          </div>
        </div>
      </div>

      {/* ------------------ INNER PORTAL TABS ------------------ */}
      <div className="flex border-b border-white/5 gap-1 overflow-x-auto select-none custom-scrollbar pb-1">
        {[
          { id: 'studio', label: 'Low-Code App Studio', icon: Layers },
          { id: 'sdk', label: 'SDK Hooks Explorer', icon: FolderCode },
          { id: 'skills', label: 'Skill Orchestration', icon: Sparkles },
          { id: 'agents', label: 'Custom Agent Cluster', icon: Cpu },
          { id: 'data', label: 'Data Model Registry', icon: Database },
          { id: 'cli', label: 'Warborn Interactive CLI', icon: Terminal },
          { id: 'observability', label: 'Platform Telemetry', icon: BarChart3 }
        ].map((btn) => {
          const BtnIcon = btn.icon;
          return (
            <button
              key={btn.id}
              onClick={() => setActiveTab(btn.id as any)}
              className={`px-4 py-2 border-b-2 font-display text-xs font-bold tracking-tight uppercase transition-all flex items-center gap-2 shrink-0 ${
                activeTab === btn.id
                  ? 'border-indigo-500 text-white bg-white/[0.02]'
                  : 'border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.01]'
              }`}
            >
              <BtnIcon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* ------------------ TAB CONTENT SECTION ------------------ */}
      <div className="min-h-[460px]">
        {/* TAB 1: LOW CODE APP STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Canvas Modeler */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Visual App Drag-Canvas</span>
                    <p className="text-[10px] text-white/50">Compose UI pages, charts, data grids, and AI components interactively.</p>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">
                    WYSIWYG STUDIO
                  </span>
                </div>

                {/* Available UI blocks */}
                <div>
                  <span className="text-[10px] font-mono text-white/40 block mb-2">Available UI Extenders (Click to append on Canvas)</span>
                  <div className="flex flex-wrap gap-2">
                    {studioComponents.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => {
                          setCanvasLayout([...canvasLayout, comp]);
                          logAction('STUDIO', `Appended [${comp}] layout extension block to active builder canvas.`, 'info');
                        }}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[10px] text-white/80 transition-all flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3 text-indigo-400" /> {comp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active WYSIWYG Canvas Box */}
                <div className="p-4 bg-black/40 border-2 border-dashed border-white/10 rounded-lg min-h-[180px] flex flex-col justify-between">
                  {canvasLayout.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2">
                      <Layers className="w-8 h-8 text-white/15" />
                      <p className="text-[11px] font-mono">No elements currently on the canvas. Add UI components above to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono text-white/30 block uppercase tracking-widest">Active Canvas Layout Structure</span>
                      <div className="grid grid-cols-2 gap-2">
                        {canvasLayout.map((item, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-md flex justify-between items-center text-white/80">
                            <span className="text-[10px] font-mono font-bold flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {item.toUpperCase()}
                            </span>
                            <button
                              onClick={() => {
                                setCanvasLayout(canvasLayout.filter((_, i) => i !== idx));
                                logAction('STUDIO', `Removed layout item [${item}] from active designer canvas.`, 'warn');
                              }}
                              className="text-red-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/[0.03] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/40 font-mono">WORKSPACE THEME:</span>
                      <select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value as any)}
                        className="bg-white/5 border border-white/10 text-[10px] text-white font-mono px-2 py-1 rounded"
                      >
                        <option value="Slate-Dark">Slate-Dark Theme</option>
                        <option value="Cosmic-Blue">Cosmic Blue</option>
                        <option value="Alpine-Light">Alpine Light (Compact)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        setCanvasLayout([]);
                        logAction('STUDIO', 'Reset low-code application builder canvas layout.', 'warn');
                      }}
                      className="text-[9px] font-mono text-white/30 hover:text-white/60 transition-all uppercase"
                    >
                      Reset Canvas
                    </button>
                  </div>
                </div>

                {/* App Creation parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/40 p-4 border border-white/5 rounded-lg">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 block">APPLICATION NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. PriceSynthesizer Node"
                      value={newAppName}
                      onChange={e => setNewAppName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 block">MARKETPLACE CATEGORY</label>
                    <select
                      value={newAppCategory}
                      onChange={e => setNewAppCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Business">Business & FinTech</option>
                      <option value="Engineering">Engineering Tools</option>
                      <option value="Legal">Legal & Regulatory</option>
                      <option value="Productivity">Personal Productivity</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 pt-2">
                    <button
                      onClick={handleInstallApp}
                      disabled={!newAppName.trim() || canvasLayout.length === 0}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" /> COMPLIANCE VALIDATE & COMPILE APPLICATION
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Installed apps & Deployment modes */}
              <div className="lg:col-span-5 space-y-6">
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Active Sandboxed Apps</span>
                      <p className="text-[10px] text-white/50 mt-0.5">Toggle active modules inside the security sandbox.</p>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded font-bold">
                      {apps.length} TOTAL
                    </span>
                  </div>

                  <div className="space-y-3">
                    {apps.map((app) => (
                      <div key={app.id} className="p-3 bg-black/40 border border-white/5 rounded-md space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <div className="space-y-0.5 truncate">
                            <span className="text-xs font-mono font-bold text-white block truncate">{app.name}</span>
                            <span className="text-[9px] text-white/30 font-mono">v{app.version} | ID: {app.id}</span>
                          </div>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                            app.status === 'enabled' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-white/5 text-white/30'
                          }`}>
                            {app.status}
                          </span>
                        </div>

                        <p className="text-[9px] font-mono text-white/50">
                          Permissions: <span className="text-white/70">{app.permissions.join(', ')}</span>
                        </p>

                        <div className="flex justify-between items-center pt-2 border-t border-white/[0.03]">
                          <span className="text-[9px] font-mono text-white/40">{app.deployment}</span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleAppStatus(app.id, app.name, app.status)}
                              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-all ${
                                app.status === 'enabled'
                                  ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                                  : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                              }`}
                            >
                              {app.status === 'enabled' ? 'DISABLE' : 'ENABLE'}
                            </button>
                            <button
                              onClick={() => handleRemoveApp(app.id, app.name)}
                              className="text-red-400 hover:text-red-500 p-0.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Canary Release & Deployment settings */}
                <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Multi-Tenant Deployment</span>
                  <div className="space-y-3 text-[10px]">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[9px]">
                        <span className="text-white/50">CANARY TRAFFIC SLIDER:</span>
                        <span className="text-indigo-400 font-bold">{canarySlider}% Beta Nodes</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={canarySlider}
                        onChange={(e) => setCanarySlider(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                      <span className="text-[8px] text-white/30 block font-mono">Bypasses production load safely for verified QA testing.</span>
                    </div>

                    <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1.5 font-mono text-[9px]">
                      <div className="flex justify-between">
                        <span className="text-white/40">ROLLBACK VERSION CAPABLE:</span>
                        <span className="text-[#10B981]">YES (State Checkpoints ready)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">BLUE-GREEN ROUTING:</span>
                        <span className="text-white/80">Active on West Europe & US East</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATION SDK & API PLAYGROUND */}
        {activeTab === 'sdk' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* SDK Reference documentation list */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <div className="pb-3 border-b border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Cortex Client SDK Reference</span>
                  <p className="text-[10px] text-white/50 mt-0.5 font-mono">SDK modules injected on custom applications automatically.</p>
                </div>

                <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar pr-1 font-mono text-[10px]">
                  {[
                    { hook: 'useCortexMemory', desc: 'Queries high-dimensional vector space from the central neural brain index.' },
                    { hook: 'useActiveMissions', desc: 'Exposes queue streams, scheduler priorities, and task execution progress.' },
                    { hook: 'useCortexClient', desc: 'Exposes core RPC pathways to proxy requests safely behind server-side keys.' },
                    { hook: 'useCortexAgentPool', desc: 'Allows triggering parallel scaling and collaborative consensus loops.' },
                    { hook: 'useVaultSecrets', desc: 'Fetches authorized rotated keys securely decrypted inside sandboxes.' },
                    { hook: 'useWorkflowEngine', desc: 'Triggers multi-stage graphical procedures and loops dynamically.' }
                  ].map((item) => (
                    <button
                      key={item.hook}
                      onClick={() => {
                        setSdkQuery(item.hook);
                        if (item.hook === 'useCortexMemory') {
                          setSdkParams('{\n  "query": "Recent transactions limit 10",\n  "includeAudit": true\n}');
                        } else if (item.hook === 'useActiveMissions') {
                          setSdkParams('{\n  "priorityFilter": "high",\n  "includeCheckpoints": true\n}');
                        } else if (item.hook === 'useCortexClient') {
                          setSdkParams('{\n  "endpoint": "/api/sap/sync",\n  "method": "POST",\n  "payload": { "refreshIndex": true }\n}');
                        } else {
                          setSdkParams('{\n  "args": ["standard-baseline-parameters"],\n  "tenantId": "warborn-enterprise-user"\n}');
                        }
                        logAction('SDK_EXPLORER', `Selected client SDK method: ${item.hook}`, 'info');
                      }}
                      className={`w-full p-3 text-left rounded border transition-all ${
                        sdkQuery === item.hook
                          ? 'border-indigo-500 bg-indigo-500/5'
                          : 'border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/40'
                      }`}
                    >
                      <span className="text-indigo-400 font-bold block mb-1">{item.hook}()</span>
                      <p className="text-white/50 text-[9px] font-sans leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* API Interactive playground execution screen */}
              <div className="lg:col-span-7 space-y-4 border border-white/5 bg-[#0D0D0D] rounded-lg p-5">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Interactive SDK Playground</span>
                    <p className="text-[10px] text-white/50">Edit JSON parameters and invoke live sandbox client calls.</p>
                  </div>
                  <button
                    onClick={executeSdkCall}
                    disabled={isExecutingSdk}
                    className="px-3 py-1 bg-white hover:bg-white/90 text-black rounded text-xs font-bold uppercase flex items-center gap-1"
                  >
                    {isExecutingSdk ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    {isExecutingSdk ? 'INVOKING...' : 'INVOKE RPC PATHWAY'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Left: Input parameters */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono text-white/40 block">Sandbox Input Parameters (JSON)</span>
                    <textarea
                      value={sdkParams}
                      onChange={e => setSdkParams(e.target.value)}
                      rows={9}
                      className="w-full bg-black/60 border border-white/10 rounded p-3 font-mono text-[10px] text-cyan-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Right: Response view */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-[10px] font-mono text-white/40 block">Server Output JSON Response</span>
                    <pre className="w-full bg-black/80 border border-white/5 rounded p-3 font-mono text-[9px] text-green-400 overflow-x-auto h-[172px] leading-relaxed select-text custom-scrollbar">
                      {sdkResponse}
                    </pre>
                  </div>
                </div>

                <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded flex items-center gap-2 font-mono text-[10px]">
                  <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-white/70">
                    Client SDK executes inside cryptographically isolated sandboxes obeying strict RBAC, protecting your client keys automatically.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REUSABLE AI SKILLS FRAMEWORK */}
        {activeTab === 'skills' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Skill builder inputs */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Create New Reusable Skill</span>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Compose single-purpose reasoning functions that can be distributed to any application or linked into workflow execution nodes.
                </p>

                <div className="space-y-3 font-mono text-[10px]">
                  <div className="space-y-1">
                    <label className="text-white/40 block">SKILL NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Code Refactor Router"
                      value={newSkill.name}
                      onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 rounded focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 block">DESCRIPTION</label>
                    <textarea
                      placeholder="What does this AI reason about..."
                      value={newSkill.description}
                      onChange={e => setNewSkill({ ...newSkill, description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 rounded focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-white/40 block">INPUTS (CSV)</label>
                      <input
                        type="text"
                        value={newSkill.inputs}
                        onChange={e => setNewSkill({ ...newSkill, inputs: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 block">OUTPUTS (CSV)</label>
                      <input
                        type="text"
                        value={newSkill.outputs}
                        onChange={e => setNewSkill({ ...newSkill, outputs: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-white/40 block">MODEL PREFERENCE</label>
                      <select
                        value={newSkill.model}
                        onChange={e => setNewSkill({ ...newSkill, model: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      >
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-white/40 block">BUDGET ESTIMATE (USD)</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={newSkill.cost}
                        onChange={e => setNewSkill({ ...newSkill, cost: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleCreateSkill}
                      disabled={!newSkill.name.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wider transition-all"
                    >
                      REGISTER SKILL SCHEMAS
                    </button>
                  </div>
                </div>
              </div>

              {/* Registered Skills visual list */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Active AI Reasoning Skill Library</span>

                <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                  {skills.map((sk) => (
                    <div key={sk.id} className="p-3 bg-black/40 border border-white/5 rounded space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-white font-mono">{sk.name}</span>
                          <span className="text-[9px] text-indigo-400 font-mono block">ID: {sk.id}</span>
                        </div>
                        <span className="text-[9px] font-mono text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded uppercase">
                          {sk.model}
                        </span>
                      </div>

                      <p className="text-[10px] text-white/60 leading-relaxed">{sk.description}</p>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono pt-2 border-t border-white/[0.03] text-white/40">
                        <div>
                          <span>Inputs:</span>
                          <span className="text-white font-semibold block">{sk.inputs.join(', ')}</span>
                        </div>
                        <div>
                          <span>Outputs:</span>
                          <span className="text-white font-semibold block">{sk.outputs.join(', ')}</span>
                        </div>
                        <div>
                          <span>Cost Limit:</span>
                          <span className="text-emerald-400 font-semibold block">${sk.cost}</span>
                        </div>
                        <div>
                          <span>Confid. Thresh:</span>
                          <span className="text-indigo-400 font-semibold block">{sk.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOM AGENT CLUSTER */}
        {activeTab === 'agents' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Agent Form */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Construct Autonomous Agent</span>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Design specialized prompt goals, memories thresholds and allowed tools for standalone execution.
                </p>

                <div className="space-y-3 font-mono text-[10px]">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-white/40 block">AGENT ID NAME</label>
                      <input
                        type="text"
                        placeholder="e.g. Risk Auditor"
                        value={newAgent.name}
                        onChange={e => setNewAgent({ ...newAgent, name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 rounded focus:outline-none font-sans"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-white/40 block">ROLE PROFILE</label>
                      <select
                        value={newAgent.role}
                        onChange={e => setNewAgent({ ...newAgent, role: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      >
                        <option value="Engineering Assistant">Engineering Assistant</option>
                        <option value="Financial Auditor">Financial Auditor</option>
                        <option value="QA / Reliability Coordinator">QA Coordinator</option>
                        <option value="Regulatory compliance agent">Compliance Agent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 block">SYSTEM PROMPT TEMPLATE</label>
                    <textarea
                      placeholder="You are a specialized agent..."
                      value={newAgent.prompt}
                      onChange={e => setNewAgent({ ...newAgent, prompt: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 block">REASONING GOALS</label>
                    <input
                      type="text"
                      placeholder="Audit queues and resolve locks"
                      value={newAgent.goal}
                      onChange={e => setNewAgent({ ...newAgent, goal: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-white/40 block">PRIMARY TOOL ACCESS</label>
                      <select
                        value={newAgent.tool}
                        onChange={e => setNewAgent({ ...newAgent, tool: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      >
                        <option value="AST-Parser">AST-Parser</option>
                        <option value="Ledger Analyzer">Ledger Analyzer</option>
                        <option value="Vault Key Audit">Vault Key Audit</option>
                        <option value="Web Scrapper">Web Scrapper</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-white/40 block">DEPLOYMENT TARGET</label>
                      <select
                        value={newAgent.deployment}
                        onChange={e => setNewAgent({ ...newAgent, deployment: e.target.value })}
                        className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                      >
                        <option value="Enterprise Global">Enterprise Global</option>
                        <option value="Regional Secured">Regional Secured</option>
                        <option value="Edge Local Sandbox">Edge Local Sandbox</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleCreateAgent}
                      disabled={!newAgent.name.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wider transition-all"
                    >
                      SPAWN AGENT SYSTEM
                    </button>
                  </div>
                </div>
              </div>

              {/* Agent Registry */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Active Agent Synapse Registry</span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div key={agent.id} className="p-3.5 bg-black/40 border border-white/5 rounded-lg space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white font-mono">{agent.name}</span>
                          <span className="text-[8px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-1.5 rounded">
                            {agent.deployment.split(' ')[0]}
                          </span>
                        </div>
                        <span className="text-[9px] text-white/40 block">Role: {agent.role}</span>
                        <p className="text-[10px] text-white/60 line-clamp-2 italic">"{agent.prompt}"</p>
                      </div>

                      <div className="pt-2 border-t border-white/[0.03] space-y-1.5">
                        <div className="flex flex-wrap gap-1">
                          {agent.tools.map((t: string, i: number) => (
                            <span key={i} className="text-[8px] bg-white/5 border border-white/10 px-1.5 rounded text-white/50 font-mono">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: UNIVERSAL DATA MODEL REGISTRY */}
        {activeTab === 'data' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Entity creation */}
              <div className="lg:col-span-5 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Register Universal Data Entity</span>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  Registered entities automatically gain vector-search embeddings, historical audit timelines, memory linkage, and automatic workflows.
                </p>

                <div className="space-y-3 font-mono text-[10px]">
                  <div className="space-y-1">
                    <label className="text-white/40 block">ENTITY TYPE NAME (PLURAL)</label>
                    <input
                      type="text"
                      placeholder="e.g. Purchase Orders"
                      value={newEntityType}
                      onChange={e => setNewEntityType(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 rounded focus:outline-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-white/40 block">BUSINESS CLASSIFICATION</label>
                    <select
                      value={newEntityCategory}
                      onChange={e => setNewEntityCategory(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white/5 border border-white/10 text-xs text-white rounded focus:outline-none"
                    >
                      <option value="Operations">Operations</option>
                      <option value="Finance">Finance & Ledger</option>
                      <option value="Engineering">Engineering Core</option>
                      <option value="Legal">Legal & Regulatory</option>
                    </select>
                  </div>

                  <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded text-[9px] text-white/60 space-y-1 leading-relaxed">
                    <p className="font-bold text-indigo-400">AUTOMATICALLY GRANTED:</p>
                    <p>✓ Cognitive Index mapping</p>
                    <p>✓ Synaptic association link rules</p>
                    <p>✓ Security Isolation & Audit Log timeline</p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleRegisterEntity}
                      disabled={!newEntityType.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold uppercase py-2 rounded text-[10px] tracking-wider transition-all"
                    >
                      DEPLOY DATA MODEL ENTITY
                    </button>
                  </div>
                </div>
              </div>

              {/* Entity visual list */}
              <div className="lg:col-span-7 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Unified Operational Entity Hub</span>

                <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                  {entities.map((ent, idx) => (
                    <div key={idx} className="p-3.5 bg-black/40 border border-white/5 rounded flex justify-between items-center gap-4 hover:border-white/10 transition-all">
                      <div className="space-y-1 text-left font-mono">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                          <span className="text-xs font-bold text-white uppercase">{ent.type}</span>
                          <span className="text-[9px] text-white/40 bg-white/5 px-2 py-0.2 rounded">
                            {ent.category}
                          </span>
                        </div>
                        <p className="text-[9px] text-white/50 font-sans">
                          Auto-indexing vector space linked | Search: <span className="text-emerald-400">Active</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-400/5 border border-indigo-400/15 px-2 py-0.5 rounded">
                          {ent.auditTimeline || Math.floor(Math.random() * 20 + 2)} timeline audits
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CLI INTERACTIVE TERMINAL */}
        {activeTab === 'cli' && (
          <div className="space-y-4 animate-fade-in text-left">
            <div className="border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Warborn Platform Terminal</span>
                  <p className="text-[10px] text-white/50">Simulated developer cli toolkit. Execute micro-infrastructure configurations.</p>
                </div>
                <button
                  onClick={() => {
                    setCliLogs(['Warborn Platform CLI v7.4.1 (Distributed Node Terminal)', 'Type "help" to start.']);
                    logAction('CLI', 'Cleared developer sandbox terminal output buffer.', 'info');
                  }}
                  className="px-2.5 py-1 text-[10px] font-mono font-bold text-white/40 hover:text-white/80 transition-all"
                >
                  CLEAR
                </button>
              </div>

              {/* CLI Terminal Output */}
              <div className="bg-black/90 border border-white/5 rounded-lg p-4 font-mono text-[10px] space-y-2 h-[220px] overflow-y-auto custom-scrollbar select-text text-cyan-400">
                {cliLogs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-line leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>

              {/* CLI Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeCliCommand(cliInput);
                }}
                className="flex gap-2"
              >
                <span className="text-[11px] font-mono text-white/30 self-center select-none">&gt;_</span>
                <input
                  type="text"
                  placeholder="e.g. warborn status (or type help)"
                  value={cliInput}
                  onChange={e => setCliInput(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase font-mono"
                >
                  RUN
                </button>
              </form>

              {/* Click to run helper quick deck */}
              <div>
                <span className="text-[10px] font-mono text-white/30 block mb-1.5">Interactive CLI Starter Recipes (Click to Run)</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { cmd: 'warborn status', label: 'Verify Leader Consensus' },
                    { cmd: 'warborn init smart-crm', label: 'Scaffold Smart CRM' },
                    { cmd: 'warborn deploy app-sap-sync', label: 'Deploy Ledger Bridge' },
                    { cmd: 'warborn test plugin plug-slack-mcp', label: 'Test Slack Extension' }
                  ].map((recipe) => (
                    <button
                      key={recipe.cmd}
                      onClick={() => {
                        setCliInput(recipe.cmd);
                        executeCliCommand(recipe.cmd);
                      }}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-mono text-[9px] text-indigo-400 transition-all"
                    >
                      {recipe.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: APPLICATION OBSERVABILITY */}
        {activeTab === 'observability' && (
          <div className="space-y-6 animate-fade-in text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Charts panel */}
              <div className="lg:col-span-8 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Application Platform API Latency & Throttling</span>

                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appMetricsHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="monospace" />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} fontFamily="monospace" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0D0D0D', borderColor: 'rgba(255,255,255,0.1)' }}
                        labelStyle={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}
                      />
                      <Area type="monotone" dataKey="latency" name="API Latency (ms)" stroke="#6366f1" fillOpacity={1} fill="url(#colorLatency)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center text-xs font-mono pt-4 border-t border-white/[0.03]">
                  <div>
                    <span className="text-[10px] text-white/40 block">AVERAGE MEMORY REPLICATION</span>
                    <span className="text-white font-bold">14.1 KB/s</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">SANDBOX REJECT TIMEOUT RATE</span>
                    <span className="text-emerald-400 font-bold">0.02%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">TOTAL API INTEGRATION CALLS</span>
                    <span className="text-indigo-400 font-bold">14,522 req</span>
                  </div>
                </div>
              </div>

              {/* Right: Cloud Ingress Health */}
              <div className="lg:col-span-4 border border-white/5 bg-[#0D0D0D] rounded-lg p-5 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Ingress Health Diagnostics</span>

                <div className="space-y-3 font-mono text-[9px]">
                  <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">API GATEWAY</span>
                      <span className="text-[#10B981]">ONLINE</span>
                    </div>
                    <span className="text-white/40 block">Rate limits active. Latency: 12ms.</span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">GRAPHQL ENDPOINT</span>
                      <span className="text-[#10B981]">ONLINE</span>
                    </div>
                    <span className="text-white/40 block">Sub-queries synced with memory graphs.</span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">WEBSOCKET POOL</span>
                      <span className="text-[#10B981]">ONLINE</span>
                    </div>
                    <span className="text-white/40 block">Active stream tunnels: 412 open.</span>
                  </div>

                  <div className="p-3 bg-black/40 border border-white/5 rounded space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">WEBHOOK HANDLER</span>
                      <span className="text-indigo-400">READY</span>
                    </div>
                    <span className="text-white/40 block">Ready to digest third-party callbacks.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
