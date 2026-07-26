import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Project,
  Memory,
  KnowledgeDoc,
  MCPConnector,
  LogEntry,
  SystemMetric,
} from './types';
import {
  INITIAL_PROJECTS,
  INITIAL_MEMORIES,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_MCP_CONNECTORS,
  INITIAL_LOGS,
  INITIAL_WORKFLOWS,
  INITIAL_TOOLS,
} from './data';
import { cortex } from './lib/cortexClient';
import { BrandRegistry, BrandAnimationController } from './lib/branding';
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  FileText,
  Code as CodeIcon,
  FileSpreadsheet,
  Presentation as PresentationIcon,
  Mail,
  Mic,
  Eye,
  Database,
  Brain,
  FolderDot,
  Network,
  Layers,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Plus,
  Activity,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
  LogOut,
  Server,
  Shield,
  Cpu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

import MetricCards from './components/MetricCards';
import TraceLogs from './components/TraceLogs';
import CortexAgentConsole from './components/CortexAgentConsole';
import ContextMemoryEngine from './components/ContextMemoryEngine';
import KnowledgeVectorEngine from './components/KnowledgeVectorEngine';
import MissionEngineDashboard from './components/MissionEngineDashboard';
import OperationsCenter from './components/OperationsCenter';
import DeveloperPortal from './components/DeveloperPortal';
import SelfOptimizingHub from './components/SelfOptimizingHub';
import EnterpriseGovernanceCenter from './components/EnterpriseGovernanceCenter';
import ModelIntelligencePlatform from './components/ModelIntelligencePlatform';

// Studio components
import {
  DeepResearchStudio,
  DocumentStudio,
  CodeStudio,
  SpreadsheetStudio,
  PresentationStudio,
  EmailStudio,
  MeetingStudio,
  VisionStudio,
  Marketplace,
  ProjectsDashboardView,
  SettingsWorkspace,
} from './components/WorkspaceStudios';

// ============================================================================
// HOME OVERVIEW SUB-COMPONENT
// ============================================================================
interface HomeOverviewProps {
  isDark: boolean;
  projects: Project[];
  documents: KnowledgeDoc[];
  memories: Memory[];
  metrics: SystemMetric;
  onTabSelect: (tabId: string) => void;
  onAddLog: (log: LogEntry) => void;
}

function HomeOverview({
  isDark,
  projects,
  documents,
  memories,
  metrics,
  onTabSelect,
  onAddLog,
}: HomeOverviewProps) {
  const greeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'GOOD MORNING';
    if (hrs < 18) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const chartData = [
    { name: '08:00', queries: 24, latency: 310 },
    { name: '10:00', queries: 45, latency: 450 },
    { name: '12:00', queries: 68, latency: 380 },
    { name: '14:00', queries: 55, latency: 490 },
    { name: '16:00', queries: 92, latency: 420 },
    { name: '18:00', queries: 40, latency: 350 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Welcome banner */}
      <div className={`p-8 border rounded-xl flex flex-wrap justify-between items-center gap-6 ${
        isDark ? 'bg-gradient-to-r from-white/2 to-transparent border-white/5' : 'bg-neutral-50 border-black/5'
      }`}>
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.2em] opacity-40 font-mono block">
            {greeting()} • SYSTEM STATUS: ACTIVE
          </span>
          <h2 className="text-xl font-bold font-display tracking-tight text-white">
            Welcome to Warborn AI Workspace
          </h2>
          <p className="text-xs opacity-50 leading-relaxed max-w-[450px]">
            Your local Cortex core nodes are running in hot standby. Access all 21 enterprise-grade modules from the operational rail sidebar.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              onTabSelect('research');
              onAddLog({ timestamp: new Date().toISOString(), level: 'info', module: 'HOME', message: 'Redirected to Deep Research studio.' });
            }}
            className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded cursor-pointer hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" /> DEEP RESEARCH <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics breakdown cards */}
      <MetricCards metrics={metrics} isDark={isDark} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Core telemetry area */}
        <div className={`xl:col-span-8 p-6 border rounded-xl space-y-4 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className="flex justify-between items-center select-none">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" /> Core Analytical Streams
            </h3>
            <span className="text-[10px] font-mono opacity-40">UTC REAL-TIME UPDATES</span>
          </div>

          <div className="h-60 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? '#FFF' : '#000'} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={isDark ? '#FFF' : '#000'} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke={isDark ? '#444' : '#ccc'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                <YAxis stroke={isDark ? '#444' : '#ccc'} style={{ fontSize: 9, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ background: isDark ? '#141414' : '#fff', border: '1px solid #333' }} />
                <Area type="monotone" dataKey="queries" stroke={isDark ? '#FFF' : '#000'} strokeWidth={1.5} fillOpacity={1} fill="url(#queryGrad)" name="Queries Executed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick-links and summaries */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <div className={`p-6 border rounded-xl space-y-4 flex-1 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Quick Workspace Actions
            </h3>
            <div className="grid grid-cols-1 gap-2 font-mono text-xs">
              {[
                { label: 'Cortex Agent Chat', tab: 'chat', desc: 'Direct assistant pipeline' },
                { label: 'Document Studio', tab: 'document', desc: 'QA and comparison matrix' },
                { label: 'Code Refactor Engine', tab: 'code', desc: 'Slab optimization reviews' },
                { label: 'Spasmodic Spreadsheet', tab: 'spreadsheet', desc: 'AI analytical forecasts' },
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => onTabSelect(link.tab)}
                  className={`w-full p-2.5 rounded border text-left flex justify-between items-center transition-all cursor-pointer ${
                    isDark
                      ? 'border-white/5 bg-white/3 hover:border-white/10 hover:bg-white/5 text-white'
                      : 'border-black/5 bg-black/3 hover:border-black/10 hover:bg-black/5 text-black'
                  }`}
                >
                  <div>
                    <span className="font-bold block">{link.label}</span>
                    <span className="text-[10px] opacity-40">{link.desc}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple layout helper helper for tab arrows
import { ChevronDown } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true);

  // Logo character animation cycle states (W > A > R > B > O > R > N)
  const brand = BrandRegistry.get('cortex');

  useEffect(() => {
    document.title = `${brand.name} | ${brand.subtitle}`;
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (link) {
      link.href = brand.favicon;
    }
  }, [brand]);

  // Subscribed global logo character animation cycle state
  const [logoCharIndex, setLogoCharIndex] = useState(BrandAnimationController.getCurrentIndex());
  const logoChars = BrandAnimationController.getSequence();

  useEffect(() => {
    return BrandAnimationController.subscribe((char, index) => {
      setLogoCharIndex(index);
    });
  }, []);

  // Core Data States
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjId, setActiveProjId] = useState<string>(INITIAL_PROJECTS[0]?.id || '');
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(INITIAL_KNOWLEDGE_DOCS);
  const [connectors, setConnectors] = useState<MCPConnector[]>(INITIAL_MCP_CONNECTORS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);

  // Active Zone / Tab Selection
  const [activeTab, setActiveTab] = useState<string>('home');

  // Workspace creation toggles
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjModel, setNewProjModel] = useState('gemini-3.5-flash');
  const [newProjInstruction, setNewProjInstruction] = useState('');

  // Cumulative Metrics State
  const [metrics, setMetrics] = useState<SystemMetric>({
    totalCost: 0.00342,
    totalTokens: 14205,
    promptTokens: 8450,
    generationTokens: 5755,
    reasoningTokens: 0,
    latencyAvg: 480,
    requestCount: 14,
    cacheHitRate: 0.384,
  });

  // Sprint 2 - Identity, Session, Multi-Tenancy & Presence States
  const [user, setUser] = useState<any>(null);
  const [loadingSession, setLoadingSession] = useState<boolean>(true);
  const [orgs, setOrgs] = useState<any[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string>('');
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWsId, setActiveWsId] = useState<string>('');
  const [presenceUsers, setPresenceUsers] = useState<any[]>([]);

  // Authentication flow states
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot' | 'verify'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authRemember, setAuthRemember] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  const activeProject = projects.find((p) => p.id === activeProjId) || projects[0] || INITIAL_PROJECTS[0];

  // Helper to load orgs, workspaces, and presence
  const syncTenantState = async (sessionUser: any) => {
    try {
      const orgsRes = await cortex.getOrganizations().catch(() => null);
      if (orgsRes && orgsRes.success && orgsRes.organizations?.length > 0) {
        setOrgs(orgsRes.organizations);
        const defaultOrg = orgsRes.organizations[0];
        setActiveOrgId(defaultOrg.id);
        
        const wsRes = await cortex.getWorkspaces(defaultOrg.id).catch(() => null);
        if (wsRes && wsRes.success) {
          setWorkspaces(wsRes.workspaces || []);
          if (wsRes.workspaces?.length > 0) {
            setActiveWsId(wsRes.workspaces[0].id);
          }
        }
      }
      const presenceRes = await cortex.getPresence().catch(() => null);
      if (presenceRes && presenceRes.success) {
        setPresenceUsers(presenceRes.users || []);
      }
    } catch (e) {
      console.error('Error syncing tenant boundaries:', e);
    }
  };

  // Fetch initial data from Cortex production APIs on mount
  useEffect(() => {
    const initCortexData = async () => {
      try {
        // Authenticate Session
        const sessionRes = await cortex.getSessionUser().catch(() => null);
        if (sessionRes && sessionRes.success) {
          setUser(sessionRes.user);
          await syncTenantState(sessionRes.user);
        }

        const liveMemories = await cortex.getMemories(true);
        if (liveMemories) {
          setMemories(liveMemories);
        }

        const liveDocs = await cortex.getDocuments(true);
        if (liveDocs) {
          setDocuments(liveDocs);
        }

        handleAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'BOOT',
          message: 'Connected to Cortex core engine. Dynamic registry loaded.',
        });
      } catch (err: any) {
        console.error('Failed to initialize live Cortex data:', err);
        handleAddLog({
          timestamp: new Date().toISOString(),
          level: 'error',
          module: 'BOOT',
          message: `Cortex integration warning: ${err.message || err}. Local standby active.`,
        });
      } finally {
        setLoadingSession(false);
      }
    };

    initCortexData();
  }, []);

  // Sync active presence updates
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        await cortex.updatePresence({ workspaceId: activeWsId });
        const presenceRes = await cortex.getPresence().catch(() => null);
        if (presenceRes && presenceRes.success) {
          setPresenceUsers(presenceRes.users || []);
        }
      } catch (e) {
        // quiet fail
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [user, activeWsId]);

  // Sync body theme class
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Append new trace logs
  const handleAddLog = (log: LogEntry) => {
    setLogs((prev) => [...prev, log]);
  };

  // Clear traces buffer
  const handleClearLogs = () => {
    setLogs([]);
    handleAddLog({
      timestamp: new Date().toISOString(),
      level: 'trace',
      module: 'BOOT',
      message: 'Trace buffer flushed by administrator command.',
    });
  };

  // Mutator triggers (directly communicating with Cortex server)
  const handleAddMemory = async (newMemory: Memory) => {
    try {
      const created = await cortex.createMemory({
        content: newMemory.content,
        type: newMemory.type,
        associatedKeywords: newMemory.associatedKeywords,
      });
      setMemories((prev) => [created, ...prev]);
      handleAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'MEMORY',
        message: 'Successfully registered episodic synapse memory in Cortex Engine.',
      });
    } catch (err: any) {
      console.error(err);
      setMemories((prev) => [newMemory, ...prev]);
    }
  };

  const handleAddDocument = async (newDoc: KnowledgeDoc) => {
    try {
      await cortex.createDocument({
        name: newDoc.name,
        content: newDoc.content,
        size: newDoc.size,
      });
      const liveDocs = await cortex.getDocuments(true);
      setDocuments(liveDocs);
    } catch (err: any) {
      console.error(err);
      setDocuments((prev) => [newDoc, ...prev]);
    }
  };

  const handleAddConnector = (newConn: MCPConnector) => {
    setConnectors((prev) => [...prev, newConn]);
  };

  const handleToggleTool = (toolId: string) => {
    // handled locally inside our component
  };

  const handleUpdateInstruction = async (newText: string) => {
    try {
      const updated = await cortex.updateProject(activeProjId, { customInstruction: newText });
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjId ? updated : p))
      );
      handleAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'PROJECTS',
        message: 'Saved updated instructions to Cortex server workspace configuration.',
      });
    } catch (err: any) {
      console.error(err);
      // Fallback
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjId ? { ...p, customInstruction: newText } : p))
      );
    }
  };

  const handleUpdateMetrics = (update: Partial<SystemMetric> & { costUsd?: number }) => {
    setMetrics((prev) => {
      const updatedPrompt = prev.promptTokens + (update.promptTokens || 0);
      const updatedGen = prev.generationTokens + (update.generationTokens || 0);
      const updatedReasoning = prev.reasoningTokens + (update.reasoningTokens || 0);
      const updatedTokens = prev.totalTokens + (update.totalTokens || 0);
      const updatedCost = prev.totalCost + (update.costUsd || 0);
      const updatedCount = prev.requestCount + (update.requestCount || 1);

      // Average latency running calculation
      const updatedLatency = update.latencyAvg
        ? Math.floor((prev.latencyAvg * prev.requestCount + update.latencyAvg) / updatedCount)
        : prev.latencyAvg;

      return {
        totalCost: updatedCost,
        totalTokens: updatedTokens,
        promptTokens: updatedPrompt,
        generationTokens: updatedGen,
        reasoningTokens: updatedReasoning,
        latencyAvg: updatedLatency,
        requestCount: updatedCount,
        cacheHitRate: Math.min(0.85, prev.cacheHitRate + 0.015), // micro simulation increments
      };
    });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    try {
      const created = await cortex.createProject({
        name: newProjName.trim(),
        model: newProjModel,
        customInstruction: newProjInstruction.trim() || 'You are Warborn Cortex.',
        temperature: 0.5,
      });

      setProjects((prev) => [...prev, created]);
      setActiveProjId(created.id);
      setShowNewProjModal(false);

      // reset fields
      setNewProjName('');
      setNewProjInstruction('');

      handleAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'BOOT',
        message: `Created new project workspace: '${created.name}' via Cortex Client SDK.`,
      });
    } catch (err: any) {
      console.error(err);
      // fallback to offline generation
      const fallbackId = `proj_${Date.now()}`;
      const newProj: Project = {
        id: fallbackId,
        name: newProjName.trim(),
        description: 'Custom developer workspace cell.',
        createdAt: new Date().toISOString(),
        status: 'active',
        customInstruction: newProjInstruction.trim() || 'You are Warborn Cortex.',
        model: newProjModel,
        temperature: 0.5,
      };
      setProjects((prev) => [...prev, newProj]);
      setActiveProjId(fallbackId);
      setShowNewProjModal(false);
      setNewProjName('');
      setNewProjInstruction('');
    }
  };

  // Exactly 17 workspace modules defined semantically
  const sidebarTabs = [
    { id: 'home', label: 'HOME', icon: HomeIcon, section: 'Core Workspace' },
    { id: 'chat', label: 'CHAT', icon: MessageSquare, section: 'Core Workspace' },
    
    { id: 'research', label: 'DEEP RESEARCH', icon: Search, section: 'Creative Studios' },
    { id: 'document', label: 'DOCUMENT STUDIO', icon: FileText, section: 'Creative Studios' },
    { id: 'code', label: 'CODE STUDIO', icon: CodeIcon, section: 'Creative Studios' },
    { id: 'spreadsheet', label: 'SPREADSHEET STUDIO', icon: FileSpreadsheet, section: 'Creative Studios' },
    { id: 'presentation', label: 'PRESENTATION STUDIO', icon: PresentationIcon, section: 'Creative Studios' },
    { id: 'email', label: 'EMAIL STUDIO', icon: Mail, section: 'Creative Studios' },
    { id: 'meeting', label: 'MEETING STUDIO', icon: Mic, section: 'Creative Studios' },
    { id: 'vision', label: 'VISION STUDIO', icon: Eye, section: 'Creative Studios' },
    
    { id: 'knowledge', label: 'KNOWLEDGE', icon: Database, section: 'Intelligence & Memory' },
    { id: 'memory', label: 'MEMORY', icon: Brain, section: 'Intelligence & Memory' },
    { id: 'projects', label: 'PROJECTS', icon: FolderDot, section: 'Intelligence & Memory' },
    { id: 'mip', label: 'MODEL INTELLIGENCE', icon: Cpu, section: 'Intelligence & Memory' },
    { id: 'workflows', label: 'WORKFLOWS', icon: Network, section: 'System Orchestration' },
    { id: 'operations', label: 'OPERATIONS CENTER', icon: Server, section: 'System Orchestration' },
    { id: 'developer', label: 'DEVELOPER PORTAL', icon: CodeIcon, section: 'System Orchestration' },
    { id: 'intelligence', label: 'AUTONOMOUS INTELLIGENCE', icon: Sparkles, section: 'System Orchestration' },
    { id: 'governance', label: 'ENTERPRISE GOVERNANCE', icon: Shield, section: 'System Orchestration' },
    { id: 'marketplace', label: 'MARKETPLACE', icon: Layers, section: 'System Orchestration' },
    { id: 'settings', label: 'SETTINGS', icon: SettingsIcon, section: 'System Orchestration' },
  ];

  // Group tabs by section
  const sections = ['Core Workspace', 'Creative Studios', 'Intelligence & Memory', 'System Orchestration'];

  // ------------------ AUTH HANDLERS ------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    try {
      const res = await cortex.login({
        email: authEmail,
        password: authPassword,
        rememberMe: authRemember,
      });
      if (res.success) {
        if (res.mfaRequired) {
          setMfaChallenge(true);
        } else {
          setUser(res.user);
          await syncTenantState(res.user);
          handleAddLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            module: 'AUTH',
            message: `Developer session acquired for user: ${res.user.email}. Lease granted.`,
          });
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login credentials rejected.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    try {
      const res = await cortex.register({
        email: authEmail,
        password: authPassword,
        displayName: authDisplayName || 'Co-Developer',
        username: authUsername || 'peer',
      });
      if (res.success) {
        setUser(res.user);
        await syncTenantState(res.user);
        handleAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'AUTH',
          message: `Spawned secure new developer user record for email: ${authEmail}`,
        });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration properties rejected.');
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await cortex.request<any>('/api/v1/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, code: mfaCode }),
      });
      if (res.success && res.session?.token) {
        cortex.setAuthToken(res.session.token);
        setUser(res.user);
        await syncTenantState(res.user);
        setMfaChallenge(false);
        handleAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'SECURITY',
          message: 'Multi-factor verification challenge passed. Lease granted.',
        });
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid passcode token.');
    }
  };

  const handleLogout = async () => {
    await cortex.logout();
    setUser(null);
    setOrgs([]);
    setWorkspaces([]);
    setMfaChallenge(false);
    handleAddLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      module: 'AUTH',
      message: 'Developer session lease revoked. Ingress locked.',
    });
  };

  const handleSocialOAuth = async (provider: string) => {
    setAuthError('');
    setAuthMsg('');
    try {
      const res = await cortex.request<any>(`/api/v1/auth/oauth/${provider}`, {
        method: 'POST',
      });
      if (res.success && res.session?.token) {
        cortex.setAuthToken(res.session.token);
        setUser(res.user);
        await syncTenantState(res.user);
        handleAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'AUTH',
          message: `${provider} OAuth gateway authenticated. Token lease granted.`,
        });
      }
    } catch (err: any) {
      setAuthError('OAuth negotiation lease failed.');
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    try {
      await cortex.requestPasswordReset({ email: authEmail });
      setAuthMsg('Password reset instructions dispatched to your mailbox.');
    } catch (err: any) {
      setAuthError(err.message || 'Email not found in registries.');
    }
  };

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthMsg('');
    try {
      await cortex.verifyEmail({ email: authEmail, code: verifyCode });
      setAuthMsg('Email verified. Proceed to log in.');
      setAuthMode('login');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid verification code.');
    }
  };

  // ------------------ LOADING RENDER ------------------
  if (loadingSession) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center font-mono text-xs text-white">
        <div className="w-8 h-8 rounded-full border border-t-white border-white/15 animate-spin mb-4" />
        <span className="tracking-widest animate-pulse uppercase">BOOTING SECURE WARBORN AI CORE...</span>
      </div>
    );
  }

  // ------------------ AUTH PORTAL SCREEN ------------------
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 select-none font-sans text-[#EDEDED]">
        <div className="w-full max-w-md bg-[#0F0F0F] border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle glowing header bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

          <div className="text-center space-y-2">
            <div className="w-10 h-10 mx-auto flex items-center justify-center rounded bg-white">
              <div className="w-5 h-5 rotate-45 bg-[#0A0A0A]" />
            </div>
            <h2 className="text-sm font-bold font-mono tracking-widest text-neutral-400 uppercase">WARBORN COGNITIVE CORE</h2>
            <p className="text-[11px] opacity-40 font-mono">ENTERPRISE IDENTITY GATEWAY</p>
          </div>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono">
              ⚡ ERROR: {authError}
            </div>
          )}

          {authMsg && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs rounded font-mono">
              ✓ {authMsg}
            </div>
          )}

          {mfaChallenge ? (
            /* MFA Passcode verification form */
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">MULTI-FACTOR PASSCODE (TOTP)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 focus:outline-none text-center tracking-[0.4em] font-bold font-mono text-lg text-indigo-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold font-mono text-xs rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                VERIFY & INGRESS
              </button>
              <button
                type="button"
                onClick={() => setMfaChallenge(false)}
                className="w-full text-center text-[10px] font-mono text-neutral-500 hover:underline"
              >
                CANCEL CHALLENGE
              </button>
            </form>
          ) : authMode === 'login' ? (
            /* Standard login form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">EMAIL INSTANCE ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold font-mono tracking-wider opacity-60">PASSWORD SIGNATURE</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[9px] font-mono text-neutral-500 hover:underline"
                  >
                    FORGOT?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={authRemember}
                  onChange={(e) => setAuthRemember(e.target.checked)}
                  className="rounded border-white/10 bg-transparent text-indigo-600 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="remember" className="text-[10px] font-semibold font-mono text-neutral-400 cursor-pointer">
                  REMEMBER AUTHENTICATION LEASE (30 DAYS)
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold font-mono text-xs rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                ACQUIRE ACCESS LEASE
              </button>

              <div className="border-t border-white/5 pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialOAuth('google')}
                    className="py-1.5 bg-[#141414] hover:bg-white/5 border border-white/5 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    🔐 GOOGLE ACCOUNT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialOAuth('github')}
                    className="py-1.5 bg-[#141414] hover:bg-white/5 border border-white/5 rounded text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    🐙 GITHUB DEVELOPER
                  </button>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-[10px] font-mono text-neutral-400 hover:underline"
                >
                  SPAWN NEW DEVELOPER CREDENTIALS
                </button>
              </div>
            </form>
          ) : authMode === 'register' ? (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">EMAIL INSTANCE ADDRESS</label>
                <input
                  type="email"
                  required
                  placeholder="developer@warborn.ai"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">DISPLAY NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={authDisplayName}
                    onChange={(e) => setAuthDisplayName(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">USERNAME</label>
                  <input
                    type="text"
                    required
                    placeholder="jdoe"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">PASSWORD PROTECTION</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold font-mono text-xs rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                PROVISION ACCOUNT
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[10px] font-mono text-neutral-400 hover:underline block mx-auto"
                >
                  INGRESS WITH EXISTING CREDENTIALS
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('verify')}
                  className="text-[9px] font-mono text-neutral-500 hover:underline block mx-auto"
                >
                  HAVE VERIFICATION CODE? EMAIL CONFIRM
                </button>
              </div>
            </form>
          ) : authMode === 'forgot' ? (
            /* Forgot password Form */
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">PEER INSTANCE EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="peer@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 text-xs focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold font-mono text-xs rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                DISPATCH RESET EMAIL
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[10px] font-mono text-neutral-400 hover:underline"
                >
                  RETURN TO INGRESS
                </button>
              </div>
            </form>
          ) : (
            /* Email verify code Form */
            <form onSubmit={handleEmailVerify} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">PEER INSTANCE EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="peer@company.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-xs rounded border border-white/10 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono tracking-wider opacity-60 block">6-DIGIT VERIFICATION CODE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent rounded border border-white/10 focus:outline-none text-center font-bold tracking-wider font-mono text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-white text-black font-bold font-mono text-xs rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                SUBMIT VERIFICATION CODE
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-[10px] font-mono text-neutral-400 hover:underline"
                >
                  RETURN TO INGRESS
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="root-viewport-container"
      className={`h-screen w-screen flex overflow-hidden transition-colors duration-300 font-sans ${
        isDark ? 'bg-[#0A0A0A] text-[#EDEDED]' : 'bg-[#FFFFFF] text-[#18181B]'
      }`}
    >
      {/* Left Sidebar Navigation - continuous height with scrollable content */}
      <nav
        id="cortex-applet-sidebar"
        className={`w-64 shrink-0 hidden md:flex flex-col select-none justify-between border-r transition-colors duration-300 ${
          isDark
            ? 'bg-[#0C0C0C] border-white/5'
            : 'bg-[#FAFAFA] border-black/5'
        }`}
      >
        <div className="flex flex-col overflow-y-auto flex-1 pb-4">
          {/* Design System Authenticated Brand Mark logo box */}
          <div className={`p-6 flex items-center gap-3 border-b shrink-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <motion.div
              id="cortex-brand-logo-box"
              className="w-9 h-9 flex items-center justify-center rounded-sm shrink-0 cursor-pointer overflow-hidden"
              whileHover={{ rotate: 180, scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut"
                },
                default: { type: "spring", stiffness: 300, damping: 15 }
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  id="cortex-brand-logo-letter"
                  key={logoCharIndex}
                  initial={{ opacity: 0, y: 10, scale: 0.7 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.7 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="font-mono font-black text-[17px] tracking-tight flex items-center justify-center"
                >
                  {logoChars[logoCharIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`text-sm font-semibold tracking-widest uppercase ${isDark ? 'text-white' : 'text-black'}`}>
                  {brand.name}
                </h1>
                <span className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded border ${isDark ? 'bg-white/5 text-white/50 border-white/10' : 'bg-black/5 text-black/50 border-black/10'}`}>
                  {brand.version}
                </span>
              </div>
              <p className={`text-[10px] font-mono tracking-normal leading-none mt-0.5 ${isDark ? 'text-white/40' : 'text-black/40'}`}>
                {brand.subtitle}
              </p>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {sections.map((secName) => (
              <div key={secName} className="space-y-1">
                <span className={`text-[9px] font-bold tracking-[0.2em] uppercase block px-3 mb-1.5 font-mono ${isDark ? 'text-white/30' : 'text-black/30'}`}>
                  {secName}
                </span>
                {sidebarTabs
                  .filter((tab) => tab.section === secName)
                  .map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs transition-all duration-200 text-left font-medium cursor-pointer ${
                          activeTab === tab.id
                            ? isDark
                              ? 'bg-white/5 text-white shadow-xs font-semibold'
                              : 'bg-black/5 text-black font-semibold'
                            : isDark
                            ? 'text-white/50 hover:text-white hover:bg-white/5'
                            : 'text-black/50 hover:text-black hover:bg-black/5'
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full transition-all shrink-0 ${
                            activeTab === tab.id
                              ? isDark ? 'bg-white' : 'bg-black'
                              : 'bg-transparent'
                          }`}
                        />
                        <TabIcon className="w-3.5 h-3.5 shrink-0 opacity-70" />
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* System Nominal Footer bar */}
        <div className={`p-4 border-t shrink-0 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            <span className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-white/40' : 'text-neutral-500'}`}>
              System Nominal
            </span>
          </div>
          <div className={`flex justify-between text-[9px] font-mono ${isDark ? 'text-white/30' : 'text-neutral-400'}`}>
            <span>v1.2.0-stable</span>
            <span>45ns</span>
          </div>
        </div>
      </nav>

      {/* Right Content Area (Header + Main Stage) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ------------------ COLLABORATIVE ENTERPRISE HEADER SECTION ------------------ */}
        <header
          id="cortex-applet-header"
          className={`h-16 border-b flex items-center justify-between px-8 select-none shrink-0 transition-all duration-300 ${
            isDark ? 'bg-[#0A0A0A]/80 border-white/5 backdrop-blur-md' : 'bg-white/80 border-black/5 backdrop-blur-md'
          }`}
        >
          {/* Organization & Workspace Breadcrumb Swappers */}
          <div className="flex items-center gap-3 text-xs font-medium font-mono">
            {orgs.length > 0 ? (
              <select
                value={activeOrgId}
                onChange={async (e) => {
                  const orgId = e.target.value;
                  setActiveOrgId(orgId);
                  const wsRes = await cortex.getWorkspaces(orgId).catch(() => null);
                  if (wsRes && wsRes.success) {
                    setWorkspaces(wsRes.workspaces || []);
                    if (wsRes.workspaces?.length > 0) {
                      setActiveWsId(wsRes.workspaces[0].id);
                    }
                  }
                  handleAddLog({
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    module: 'TENANCY',
                    message: `Swapped active tenant boundary lease to: ${orgId}`,
                  });
                }}
                className={`px-2 py-1 rounded border bg-transparent text-[11px] focus:outline-none transition-all font-bold ${
                  isDark ? 'border-white/10 text-[#EDEDED] bg-[#0A0A0A]' : 'border-black/10 text-[#18181B] bg-white'
                }`}
              >
                {orgs.map(org => (
                  <option key={org.id} value={org.id} className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                    🏢 {org.name.toUpperCase()}
                  </option>
                ))}
              </select>
            ) : (
              <span className="opacity-50">CORTEX</span>
            )}

            <span className={isDark ? 'text-white/10' : 'text-black/10'}>/</span>

            {workspaces.length > 0 ? (
              <select
                value={activeWsId}
                onChange={(e) => {
                  const wsId = e.target.value;
                  setActiveWsId(wsId);
                  handleAddLog({
                    timestamp: new Date().toISOString(),
                    level: 'info',
                    module: 'TENANCY',
                    message: `Swapped active isolated workspace workspace to: ${wsId}`,
                  });
                }}
                className={`px-2 py-1 rounded border bg-transparent text-[11px] focus:outline-none transition-all font-bold ${
                  isDark ? 'border-white/10 text-indigo-400 bg-[#0A0A0A]' : 'border-black/10 text-indigo-600 bg-white'
                }`}
              >
                {workspaces.map(ws => (
                  <option key={ws.id} value={ws.id} className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                    📁 {ws.name.toUpperCase()}
                  </option>
                ))}
              </select>
            ) : (
              <span className="opacity-50">DEFAULT</span>
            )}
            
            <span className={isDark ? 'text-white/10' : 'text-black/10'}>/</span>
            
            <span className={`text-[11px] font-bold ${isDark ? 'text-white/80' : 'text-black/80'}`}>
              {sidebarTabs.find((t) => t.id === activeTab)?.label || 'Cortex Core'}
            </span>
          </div>

          {/* Header Right Controllers & Presence */}
          <div className="flex items-center gap-6">
            {/* Real-time active developer presence list */}
            {presenceUsers.length > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 border-r border-neutral-800/40 pr-6 select-none">
                <span className="text-[9px] font-bold tracking-widest font-mono text-neutral-500 mr-2 uppercase">ACTIVE DEVS:</span>
                <div className="flex -space-x-2">
                  {presenceUsers.map((item, idx) => (
                    <div
                      key={item.userId}
                      className="relative group cursor-pointer"
                      title={`${item.displayName || item.userId} • Status: ${item.status || 'Active'}`}
                    >
                      <img
                        src={item.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.userId}`}
                        alt="avatar"
                        className="w-6 h-6 rounded-full border border-[#0A0A0A] bg-[#141414]"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0A0A0A] ${
                        item.status === 'active' ? 'bg-green-500' : item.status === 'idle' ? 'bg-amber-400' : 'bg-neutral-500'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Workspace Cell Selector */}
            <div className="flex items-center gap-2">
              <FolderDot className={`w-3.5 h-3.5 ${isDark ? 'text-white/40' : 'text-black/40'}`} />
              <select
                value={activeProjId}
                onChange={(e) => setActiveProjId(e.target.value)}
                className={`px-2.5 py-1 rounded text-xs bg-transparent focus:outline-none transition-all font-semibold ${
                  isDark ? 'border-white/10 text-[#EDEDED] bg-[#0A0A0A]' : 'border-black/10 text-[#18181B] bg-white'
                }`}
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                    {proj.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewProjModal(true)}
                className={`p-1 rounded border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 hover:bg-white/5 text-white/70 hover:text-white'
                    : 'border-black/10 hover:bg-black/5 text-black/70 hover:text-black'
                }`}
                title="Spawn Workspace Cell"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Theme Toggler */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                isDark
                  ? 'border-white/10 hover:bg-white/5 text-amber-400'
                  : 'border-black/10 hover:bg-black/5 text-sky-600'
              }`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Personalized user identity badge + logout */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] select-none ${
                  isDark ? 'bg-[#141414] border-white/5' : 'bg-neutral-100 border-black/5'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="font-semibold text-neutral-300 max-w-[120px] truncate" title={user.email}>
                  {user.displayName || user.username || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  isDark
                    ? 'border-white/10 hover:bg-white/5 text-neutral-400 hover:text-white'
                    : 'border-black/10 hover:bg-[#FEE2E2] text-neutral-600 hover:text-red-600'
                }`}
                title="Revoke session lease"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Stage Panel Area */}
        <main
          id="cortex-applet-stage"
          className={`flex-1 p-8 overflow-y-auto transition-colors duration-300 ${
            isDark ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'
          }`}
        >
          {/* Active Workspace Banner Details */}
          <div className={`mb-6 select-none flex flex-wrap items-center justify-between border-b pb-4 gap-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
            <div>
              <span className="text-[10px] font-bold mono-text opacity-40 uppercase block tracking-wider">
                ACTIVE WORKSPACE MATRIX
              </span>
              <h2 className="text-xl font-bold font-display tracking-tight mt-0.5">
                {activeProject.name}
              </h2>
              <p className="text-xs opacity-50 mt-1 leading-normal max-w-[500px]">
                {activeProject.description}
              </p>
            </div>

            <div className="flex gap-2.5 text-[10px] font-bold tracking-wide uppercase mono-text">
              <span className={`px-2.5 py-1 rounded border ${
                isDark ? 'border-white/5 bg-white/5 text-white/80' : 'border-black/5 bg-black/5 text-black/80'
              }`}>
                MODEL: {activeProject.model}
              </span>
              <span className={`px-2.5 py-1 rounded border ${
                isDark ? 'border-white/5 bg-white/5 text-white/80' : 'border-black/5 bg-black/5 text-black/80'
              }`}>
                TEMP: {activeProject.temperature || 0.5}
              </span>
            </div>
          </div>

          {/* Render Active Studio */}
          <div className="space-y-6">
            {activeTab === 'home' && (
              <HomeOverview
                isDark={isDark}
                projects={projects}
                documents={documents}
                memories={memories}
                metrics={metrics}
                onTabSelect={setActiveTab}
                onAddLog={handleAddLog}
              />
            )}

            {activeTab === 'chat' && (
              <div className="animate-fade-in">
                <CortexAgentConsole
                  activeProject={activeProject}
                  onAddLog={handleAddLog}
                  onUpdateMetrics={handleUpdateMetrics}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'research' && (
              <div className="animate-fade-in">
                <DeepResearchStudio
                  isDark={isDark}
                  activeProject={activeProject}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'document' && (
              <div className="animate-fade-in">
                <DocumentStudio
                  isDark={isDark}
                  activeProject={activeProject}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'code' && (
              <div className="animate-fade-in">
                <CodeStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'spreadsheet' && (
              <div className="animate-fade-in">
                <SpreadsheetStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'presentation' && (
              <div className="animate-fade-in">
                <PresentationStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'email' && (
              <div className="animate-fade-in">
                <EmailStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'meeting' && (
              <div className="animate-fade-in">
                <MeetingStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'vision' && (
              <div className="animate-fade-in">
                <VisionStudio
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="animate-fade-in">
                <KnowledgeVectorEngine
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'memory' && (
              <div className="animate-fade-in">
                <ContextMemoryEngine
                  memories={memories}
                  onAddMemory={handleAddMemory}
                  customInstruction={activeProject.customInstruction || 'You are Warborn Cortex.'}
                  onUpdateInstruction={handleUpdateInstruction}
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="animate-fade-in">
                <ProjectsDashboardView
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'workflows' && (
              <div className="animate-fade-in">
                <MissionEngineDashboard
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'operations' && (
              <div className="animate-fade-in">
                <OperationsCenter
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="animate-fade-in">
                <DeveloperPortal
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'intelligence' && (
              <div className="animate-fade-in">
                <SelfOptimizingHub
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'governance' && (
              <div className="animate-fade-in">
                <EnterpriseGovernanceCenter
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'mip' && (
              <div className="animate-fade-in">
                <ModelIntelligencePlatform
                  onAddLog={handleAddLog}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="animate-fade-in">
                <Marketplace
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-fade-in">
                <SettingsWorkspace
                  isDark={isDark}
                  onAddLog={handleAddLog}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ------------------ NEW WORKSPACE MODAL ------------------ */}
      {showNewProjModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
          <div
            className={`w-full max-w-md border rounded-xl p-6 shadow-2xl transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5 text-white' : 'bg-white border-black/5 text-black'
            }`}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider font-display mb-4">
              SPAWN NEW WORKSPACE CELL
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                  WORKSPACE LABEL
                </label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="Warborn Builder Engine"
                  className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-200' : 'border-neutral-300 text-neutral-800'
                  }`}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                  DEFAULT ROUTER DISPATCH MODEL
                </label>
                <select
                  value={newProjModel}
                  onChange={(e) => setNewProjModel(e.target.value)}
                  className={`w-full px-2 py-1.5 rounded border bg-transparent text-xs focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                >
                  <option value="gemini-3.5-flash" className={isDark ? 'bg-[#141414]' : 'bg-white'}>gemini-3.5-flash</option>
                  <option value="gemini-3.1-pro-preview" className={isDark ? 'bg-[#141414]' : 'bg-white'}>gemini-3.1-pro-preview</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                  SEED INSTRUCTION DIRECTIVES
                </label>
                <textarea
                  value={newProjInstruction}
                  onChange={(e) => setNewProjInstruction(e.target.value)}
                  placeholder="Define constraints, guidelines, and instructions for this context..."
                  rows={4}
                  className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-200' : 'border-neutral-300 text-neutral-800'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors ${
                    isDark
                      ? 'border-neutral-800 hover:bg-neutral-900 text-neutral-400 hover:text-white'
                      : 'border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-black'
                  }`}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-white text-black hover:bg-neutral-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  SPAWN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
