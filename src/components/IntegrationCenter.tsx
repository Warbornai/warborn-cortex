import React, { useState, useEffect } from 'react';
import {
  Github,
  FolderOpen,
  Mail,
  Calendar as CalendarIcon,
  Slack,
  BookOpen,
  Trello,
  Database,
  Monitor,
  RefreshCw,
  Plus,
  Play,
  CheckCircle,
  AlertTriangle,
  Settings,
  Trash2,
  Search,
  Eye,
  GitBranch,
  GitPullRequest,
  Check,
  Code,
  Terminal as TermIcon,
  AlertCircle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  User,
  ChevronRight,
  Clock,
  Briefcase
} from 'lucide-react';
import { LogEntry } from '../types';

interface IntegrationCenterProps {
  isDark: boolean;
  onAddLog: (log: LogEntry) => void;
}

export function IntegrationCenter({ isDark, onAddLog }: IntegrationCenterProps) {
  const [activeSubTab, setActiveSubTab] = useState<'connectors' | 'workflows' | 'search'>('connectors');
  
  // Connectors State
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Workflows State
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any | null>(null);
  const [runningWorkflowId, setRunningWorkflowId] = useState<string | null>(null);
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);

  // Create Workflow State
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowDesc, setNewFlowDesc] = useState('');
  const [newFlowTriggerType, setNewFlowTriggerType] = useState<any>('github_pr');
  const [newFlowTriggerVal, setNewFlowTriggerVal] = useState('');
  const [newFlowConditionField, setNewFlowConditionField] = useState('');
  const [newFlowConditionOp, setNewFlowConditionOp] = useState<'contains' | 'equals'>('contains');
  const [newFlowConditionVal, setNewFlowConditionVal] = useState('');
  const [newFlowActions, setNewFlowActions] = useState<any[]>([]);
  
  // Database Console State
  const [selectedDbEngine, setSelectedDbEngine] = useState('PostgreSQL');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM documents LIMIT 5;');
  const [sqlResults, setSqlResults] = useState<any[] | null>(null);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [dbSchemas, setDbSchemas] = useState<any | null>(null);

  // Load backend data
  const loadIntegrations = async () => {
    try {
      const res = await fetch('/api/v1/integrations');
      const data = await res.json();
      if (data.success) {
        setIntegrations(data.integrations);
        // Sync selected details if open
        if (selectedIntegration) {
          const updated = data.integrations.find((i: any) => i.id === selectedIntegration.id);
          if (updated) setSelectedIntegration(updated);
        }
      }
    } catch (e) {
      console.error('Error fetching integrations:', e);
    }
  };

  const loadWorkflows = async () => {
    try {
      const res = await fetch('/api/v1/workflows');
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.workflows);
      }
    } catch (e) {
      console.error('Error fetching workflows:', e);
    }
  };

  useEffect(() => {
    loadIntegrations();
    loadWorkflows();
  }, []);

  // Connect integration handler
  const handleConnect = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/integrations/${id}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'INTEGRATIONS',
          message: `Established secure tunnel auth to service gateway: ${id.toUpperCase()}`,
        });
        await loadIntegrations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect integration handler
  const handleDisconnect = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/integrations/${id}/disconnect`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          module: 'INTEGRATIONS',
          message: `Dismounted connector lease for service gateway: ${id.toUpperCase()}`,
        });
        await loadIntegrations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Sync integration handler
  const handleSync = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/integrations/${id}/sync`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'SYNC',
          message: `Incremental delta synchronization verified for: ${id.toUpperCase()}`,
        });
        await loadIntegrations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Configure integration (automatic vs manual sync, etc.)
  const handleConfigure = async (id: string, syncMode: 'manual' | 'automatic') => {
    try {
      const res = await fetch(`/api/v1/integrations/${id}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ syncMode }),
      });
      const data = await res.json();
      if (data.success) {
        await loadIntegrations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run SQL Query
  const handleRunSQL = async () => {
    setSqlResults(null);
    setSqlError(null);
    try {
      const res = await fetch('/api/v1/integrations/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine: selectedDbEngine, sql: sqlQuery }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.schema) {
          setDbSchemas(data.schema);
        } else if (data.results) {
          setSqlResults(data.results);
        }
      } else {
        setSqlError(data.error || 'SQL statement failure.');
      }
    } catch (e: any) {
      setSqlError(e.message || 'Network communication error.');
    }
  };

  // Run schema explorer query on mount/select engine
  useEffect(() => {
    if (selectedIntegration?.id === 'database') {
      fetch('/api/v1/integrations/database/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engine: selectedDbEngine, sql: 'SHOW TABLES' }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.schema) {
            setDbSchemas(data.schema);
          }
        });
    }
  }, [selectedDbEngine, selectedIntegration]);

  // Unified Search handler
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await fetch('/api/v1/integrations/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Trigger Automation Workflow
  const handleTriggerWorkflow = async (id: string) => {
    setRunningWorkflowId(id);
    setWorkflowLogs(['Contacting Cortex event broker...', 'Queuing trigger payload...']);
    try {
      const res = await fetch(`/api/v1/workflows/${id}/trigger`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        // Stream the logs gradually for dynamic high-fidelity display
        const logsArray = data.workflow.executionHistory[0]?.logs || [];
        setWorkflowLogs([]);
        let logIndex = 0;
        const interval = setInterval(() => {
          if (logIndex < logsArray.length) {
            setWorkflowLogs(prev => [...prev, logsArray[logIndex]]);
            logIndex++;
          } else {
            clearInterval(interval);
            setRunningWorkflowId(null);
            loadWorkflows();
          }
        }, 500);
      }
    } catch (e) {
      console.error(e);
      setRunningWorkflowId(null);
    }
  };

  // Delete workflow handler
  const handleDeleteWorkflow = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/workflows/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          module: 'AUTOMATION',
          message: `Dismantled workflow pipeline structure.`,
        });
        await loadWorkflows();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create workflow helper
  const handleAddActionToNewFlow = () => {
    setNewFlowActions(prev => [
      ...prev,
      { id: 'act_' + Math.random().toString(36).substring(2, 5), service: 'slack', actionType: 'send_message', payload: {} }
    ]);
  };

  const handleRemoveActionFromNewFlow = (idx: number) => {
    setNewFlowActions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateNewFlowAction = (idx: number, key: string, val: any) => {
    setNewFlowActions(prev => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], [key]: val };
      return clone;
    });
  };

  const handleSaveWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlowName.trim()) return;

    try {
      const payload = {
        name: newFlowName.trim(),
        description: newFlowDesc.trim(),
        isActive: true,
        trigger: { type: newFlowTriggerType, value: newFlowTriggerVal.trim() },
        condition: newFlowConditionField.trim()
          ? { field: newFlowConditionField.trim(), operator: newFlowConditionOp, value: newFlowConditionVal.trim() }
          : null,
        actions: newFlowActions,
      };

      const res = await fetch('/api/v1/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'AUTOMATION',
          message: `Assembled automated logic gateway: "${payload.name}"`,
        });
        setShowCreateWorkflow(false);
        setNewFlowName('');
        setNewFlowDesc('');
        setNewFlowTriggerVal('');
        setNewFlowConditionField('');
        setNewFlowConditionVal('');
        setNewFlowActions([]);
        await loadWorkflows();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper for rendering connector icons
  const renderConnectorIcon = (id: string, className = 'w-5 h-5') => {
    switch (id) {
      case 'github': return <Github className={`${className} text-[#4ade80]`} />;
      case 'drive': return <FolderOpen className={`${className} text-[#38bdf8]`} />;
      case 'gmail': return <Mail className={`${className} text-[#f87171]`} />;
      case 'calendar': return <CalendarIcon className={`${className} text-[#fb7185]`} />;
      case 'slack': return <Slack className={`${className} text-[#a78bfa]`} />;
      case 'notion': return <BookOpen className={`${className} text-[#fbbf24]`} />;
      case 'jira': return <Trello className={`${className} text-[#60a5fa]`} />;
      case 'database': return <Database className={`${className} text-[#2dd4bf]`} />;
      case 'filesystem': return <Monitor className={`${className} text-[#94a3b8]`} />;
      default: return <Settings className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab select bar */}
      <div className="flex border-b border-neutral-800/40 p-1 gap-2 max-w-lg select-none">
        <button
          onClick={() => setActiveSubTab('connectors')}
          className={`flex-1 py-1.5 px-3 text-center text-xs font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeSubTab === 'connectors'
              ? isDark
                ? 'bg-white/5 text-white border border-white/10'
                : 'bg-black/5 text-black border border-black/10'
              : 'opacity-50 hover:opacity-100 text-neutral-400'
          }`}
        >
          CONNECTORS
        </button>
        <button
          onClick={() => setActiveSubTab('workflows')}
          className={`flex-1 py-1.5 px-3 text-center text-xs font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeSubTab === 'workflows'
              ? isDark
                ? 'bg-white/5 text-white border border-white/10'
                : 'bg-black/5 text-black border border-black/10'
              : 'opacity-50 hover:opacity-100 text-neutral-400'
          }`}
        >
          AUTOMATIONS
        </button>
        <button
          onClick={() => setActiveSubTab('search')}
          className={`flex-1 py-1.5 px-3 text-center text-xs font-mono font-bold tracking-wider rounded-lg transition-all ${
            activeSubTab === 'search'
              ? isDark
                ? 'bg-white/5 text-white border border-white/10'
                : 'bg-black/5 text-black border border-black/10'
              : 'opacity-50 hover:opacity-100 text-neutral-400'
          }`}
        >
          UNIFIED SEARCH
        </button>
      </div>

      {/* TABS CONTENT */}
      {activeSubTab === 'connectors' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Cortex Unified Integration Center</h3>
            <p className="text-xs opacity-50">Manage secure tunnels, synchronize external indexes, inspect data schemas, and health metrics co-operatively.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map(integ => {
              const isConnected = integ.status === 'connected';
              return (
                <div
                  key={integ.id}
                  onClick={() => isConnected && setSelectedIntegration(integ)}
                  className={`p-4 border rounded-xl flex flex-col justify-between transition-all group ${
                    isConnected ? 'cursor-pointer hover:border-white/20' : 'opacity-70'
                  } ${isDark ? 'bg-neutral-900/40 border-white/5' : 'bg-neutral-50/50 border-black/5'}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-lg ${isDark ? 'bg-white/2' : 'bg-black/2'}`}>
                          {renderConnectorIcon(integ.id)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-mono tracking-wide">{integ.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              integ.health === 'healthy' ? 'bg-[#4ade80]' :
                              integ.health === 'degraded' ? 'bg-[#fbbf24]' :
                              integ.health === 'unhealthy' ? 'bg-[#f87171]' : 'bg-neutral-500'
                            }`} />
                            <span className="text-[9px] uppercase font-mono opacity-60 tracking-wider">
                              {integ.health === 'none' ? 'offline' : integ.health}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        isConnected
                          ? isDark ? 'bg-[#4ade80]/10 text-[#4ade80]' : 'bg-[#4ade80]/20 text-[#166534]'
                          : isDark ? 'bg-white/5 text-white/40' : 'bg-black/5 text-black/40'
                      }`}>
                        {integ.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[10px] opacity-50 leading-relaxed font-sans">
                      {integ.id === 'github' && 'Code repositories, branches, commits, PRs, issues and review audits.'}
                      {integ.id === 'drive' && 'Browse, search, upload, move and automatically index Drive folders.'}
                      {integ.id === 'gmail' && 'Email threads, AI-assisted drafted replies, labels and summarization.'}
                      {integ.id === 'calendar' && 'Google & Outlook meetings, busy schedules, automatic allocations.'}
                      {integ.id === 'slack' && 'Collaborative team channels, threads, alert message dispatcher.'}
                      {integ.id === 'notion' && 'Workspace page integration, databases search and knowledge extraction.'}
                      {integ.id === 'jira' && 'Sprint tracking, assignments, issues board and state transitions.'}
                      {integ.id === 'database' && 'SQL schema terminal explorer supporting Postgres, SQLite, Supabase.'}
                      {integ.id === 'filesystem' && 'Incremental file watch, indexers, hot code reload triggers.'}
                    </p>
                  </div>

                  <div className="border-t border-neutral-800/20 pt-3 mt-4 flex items-center justify-between">
                    <div className="text-[9px] font-mono opacity-40">
                      {integ.lastSync ? `Synced: ${new Date(integ.lastSync).toLocaleTimeString()}` : 'Never synchronized'}
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => handleSync(integ.id)}
                            disabled={isLoading}
                            className={`p-1.5 rounded hover:bg-white/5 text-neutral-400 hover:text-white transition-all`}
                            title="Manual Synchronize"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDisconnect(integ.id)}
                            disabled={isLoading}
                            className="px-2 py-1 rounded bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 text-[10px] font-mono font-bold transition-all"
                          >
                            DISCONNECT
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConnect(integ.id)}
                          disabled={isLoading}
                          className={`px-3 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                            isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                          }`}
                        >
                          CONNECT
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AUTOMATIONS TAB */}
      {activeSubTab === 'workflows' && (
        <div className="space-y-6 animate-fade-in select-none">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Cortex Orchestration & Automation Engine</h3>
              <p className="text-xs opacity-50">Establish reactive workflows based on upstream hooks. Custom triggers, logic gates, and modular action steps.</p>
            </div>
            
            <button
              onClick={() => {
                setShowCreateWorkflow(true);
                setNewFlowActions([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wider ${
                isDark ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10' : 'bg-black/5 text-black border border-black/10 hover:bg-black/10'
              }`}
            >
              <Plus className="w-4 h-4" />
              CREATE WORKFLOW
            </button>
          </div>

          {/* CREATE WORKFLOW INTERFACE */}
          {showCreateWorkflow && (
            <form onSubmit={handleSaveWorkflow} className={`p-5 border rounded-xl space-y-4 animate-fade-in ${isDark ? 'bg-[#121212]/50 border-white/10' : 'bg-neutral-100/50 border-black/10'}`}>
              <div className="flex justify-between items-center border-b border-neutral-800/30 pb-3">
                <h4 className="text-xs font-bold font-mono tracking-wider text-neutral-400">ASSEMBLE DYNAMIC AUTOMATION FLOW</h4>
                <button
                  type="button"
                  onClick={() => setShowCreateWorkflow(false)}
                  className="text-xs opacity-50 hover:opacity-100"
                >
                  CANCEL
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold opacity-60">WORKFLOW NAME</label>
                  <input
                    type="text"
                    required
                    value={newFlowName}
                    onChange={(e) => setNewFlowName(e.target.value)}
                    placeholder="e.g. GitHub Slack PR Broadcaster"
                    className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono font-bold opacity-60">DESCRIPTION</label>
                  <input
                    type="text"
                    value={newFlowDesc}
                    onChange={(e) => setNewFlowDesc(e.target.value)}
                    placeholder="Briefly state trigger intent"
                    className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                  />
                </div>
              </div>

              {/* STEP 1: TRIGGER */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500">STEP 1</span>
                  <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400">REGISTER UPSTREAM HOOK TRIGGER</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l border-neutral-800">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono opacity-50 block">TRIGGER EVENT TYPE</label>
                    <select
                      value={newFlowTriggerType}
                      onChange={(e) => setNewFlowTriggerType(e.target.value as any)}
                      className={`w-full px-2 py-1 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/10 bg-white'}`}
                    >
                      <option value="github_pr">GitHub (Pull Request opened)</option>
                      <option value="gmail_received">Gmail (Inbox mail received)</option>
                      <option value="slack_mention">Slack (@Cortex ping in channel)</option>
                      <option value="jira_update">Jira (Sprint Ticket status altered)</option>
                      <option value="manual">Manual Trigger override</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono opacity-50 block">TRIGGER CHANNEL OR PATH</label>
                    <input
                      type="text"
                      value={newFlowTriggerVal}
                      onChange={(e) => setNewFlowTriggerVal(e.target.value)}
                      placeholder="e.g. cortex-core/pull_requests or general"
                      className={`w-full px-3 py-1 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 2: OPTIONAL CONDITION */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-500">STEP 2</span>
                  <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400">LOGICAL GATE CONDITION (OPTIONAL)</h5>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-4 border-l border-neutral-800">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono opacity-50 block">EVALUATION FIELD</label>
                    <input
                      type="text"
                      value={newFlowConditionField}
                      onChange={(e) => setNewFlowConditionField(e.target.value)}
                      placeholder="e.g. title or subject"
                      className={`w-full px-3 py-1 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono opacity-50 block">OPERATOR</label>
                    <select
                      value={newFlowConditionOp}
                      onChange={(e) => setNewFlowConditionOp(e.target.value as any)}
                      className={`w-full px-2 py-1.5 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/10 bg-white'}`}
                    >
                      <option value="contains">CONTAINS</option>
                      <option value="equals">EQUALS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono opacity-50 block">MATCH VALUE</label>
                    <input
                      type="text"
                      value={newFlowConditionVal}
                      onChange={(e) => setNewFlowConditionVal(e.target.value)}
                      placeholder="e.g. Feat or Urgent"
                      className={`w-full px-3 py-1 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: ACTION CHAIN */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">STEP 3</span>
                    <h5 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400">ACTION SEQUENCE CHAIN</h5>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddActionToNewFlow}
                    className="text-[10px] font-mono font-bold text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> ADD ACTION STEP
                  </button>
                </div>

                <div className="space-y-2 pl-4 border-l border-neutral-800">
                  {newFlowActions.length === 0 ? (
                    <p className="text-[10px] opacity-40 italic">No action steps compiled yet. Create at least one action step.</p>
                  ) : (
                    newFlowActions.map((action, idx) => (
                      <div key={action.id} className="flex gap-2 items-center bg-black/10 p-2 rounded-lg border border-white/5">
                        <span className="text-[10px] font-mono font-bold opacity-30">#{idx + 1}</span>
                        <select
                          value={action.service}
                          onChange={(e) => handleUpdateNewFlowAction(idx, 'service', e.target.value)}
                          className={`px-1.5 py-0.5 text-[10px] rounded border bg-transparent ${isDark ? 'border-white/10 bg-neutral-900' : 'border-black/10 bg-white'}`}
                        >
                          <option value="slack">Slack Channel Alert</option>
                          <option value="github">GitHub review dispatch</option>
                          <option value="drive">Drive file compiler</option>
                          <option value="gmail">Gmail template replies</option>
                          <option value="calendar">Calendar allocations</option>
                          <option value="jira">Jira Sprint tracker</option>
                        </select>
                        <span className="text-[10px] opacity-40 font-mono">→ ACTION TYPE:</span>
                        <input
                          type="text"
                          required
                          value={action.actionType}
                          onChange={(e) => handleUpdateNewFlowAction(idx, 'actionType', e.target.value)}
                          placeholder="e.g. send_message or review"
                          className="px-2 py-0.5 text-[10px] rounded border bg-transparent border-white/10 text-white w-32 focus:outline-none"
                        />
                        <span className="text-[10px] opacity-40 font-mono">→ PAYLOAD:</span>
                        <input
                          type="text"
                          value={JSON.stringify(action.payload)}
                          onChange={(e) => {
                            try {
                              handleUpdateNewFlowAction(idx, 'payload', JSON.parse(e.target.value));
                            } catch {
                              // loose typing
                            }
                          }}
                          placeholder='{"channel":"#ops","msg":"ok"}'
                          className="px-2 py-0.5 text-[10px] rounded border bg-transparent border-white/10 text-white flex-1 font-mono focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveActionFromNewFlow(idx)}
                          className="p-1 hover:bg-white/5 rounded text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-neutral-800/40 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={newFlowActions.length === 0}
                  className={`px-4 py-2 rounded text-xs font-mono font-bold tracking-wider ${
                    isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  SAVE WORKFLOW PIPELINE
                </button>
              </div>
            </form>
          )}

          {/* WORKFLOW LIST */}
          <div className="space-y-4">
            {workflows.map(wf => {
              const lastExecution = wf.executionHistory && wf.executionHistory[0];
              const isRunning = runningWorkflowId === wf.id;

              return (
                <div key={wf.id} className={`p-5 border rounded-xl space-y-4 ${isDark ? 'bg-neutral-900/40 border-white/5' : 'bg-white border-black/5'}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold font-mono tracking-wide">{wf.name}</h4>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          wf.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-500/10 text-neutral-400'
                        }`}>
                          {wf.isActive ? 'ACTIVE' : 'STANDBY'}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-50">{wf.description}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTriggerWorkflow(wf.id)}
                        disabled={isRunning}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-mono font-bold border ${
                          isRunning
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-emerald-950/20 border-emerald-900/30 hover:bg-emerald-900/40 text-emerald-400'
                        }`}
                      >
                        <Play className="w-3 h-3" />
                        {isRunning ? 'RUNNING...' : 'TRIGGER NOW'}
                      </button>
                      <button
                        onClick={() => handleDeleteWorkflow(wf.id)}
                        className="p-1.5 rounded hover:bg-white/5 text-red-400/70 hover:text-red-400"
                        title="Delete Workflow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* VISUAL WORKFLOW MAP */}
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 bg-black/10 p-3 rounded-lg border border-white/2 text-[10px] font-mono">
                    <div className="p-2 border border-dashed border-white/5 rounded text-center">
                      <div className="text-[8px] opacity-40">TRIGGER SOURCE</div>
                      <div className="font-bold uppercase tracking-wider text-amber-400">{wf.trigger.type}</div>
                      <div className="text-[8px] opacity-50 truncate">{wf.trigger.value || 'None'}</div>
                    </div>

                    <div className="flex justify-center text-neutral-600">
                      <ArrowRight className="w-4 h-4 hidden md:block" />
                    </div>

                    <div className="p-2 border border-dashed border-white/5 rounded text-center">
                      <div className="text-[8px] opacity-40">GATE LOGIC</div>
                      {wf.condition ? (
                        <>
                          <div className="font-bold text-purple-400">{wf.condition.field}</div>
                          <div className="text-[8px] opacity-50">{wf.condition.operator} "{wf.condition.value}"</div>
                        </>
                      ) : (
                        <div className="font-bold text-neutral-500 uppercase">PASS THROUGH</div>
                      )}
                    </div>

                    <div className="flex justify-center text-neutral-600">
                      <ArrowRight className="w-4 h-4 hidden md:block" />
                    </div>

                    <div className="col-span-1 md:col-span-2 p-2 border border-dashed border-white/5 rounded">
                      <div className="text-[8px] opacity-40 text-center mb-1">SEQUENTIAL ACTIONS DISPATCH</div>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {wf.actions.map((act: any, idx: number) => (
                          <div key={act.id} className="flex items-center gap-1 bg-black/30 px-2 py-0.5 border border-white/5 rounded">
                            <span className="opacity-30">#{idx + 1}</span>
                            <span className="text-emerald-400 font-bold uppercase">{act.service}</span>
                            <span className="opacity-40">({act.actionType})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* LIVE TERMINAL OR LAST EXECUTION */}
                  {isRunning && (
                    <div className="bg-[#050505] p-4 rounded-lg border border-neutral-800 font-mono text-[10px] space-y-1 text-neutral-400 select-text max-h-48 overflow-y-auto">
                      <div className="text-[#fbbf24] flex items-center gap-1">
                        <TermIcon className="w-3.5 h-3.5 animate-pulse" />
                        <span>CORTEX WORKFLOW PIPELINE INTERPRETER STATUS - RUNNING</span>
                      </div>
                      {workflowLogs.map((log, i) => (
                        <div key={i} className="pl-4 opacity-80 border-l border-white/10">{log}</div>
                      ))}
                    </div>
                  )}

                  {!isRunning && lastExecution && (
                    <div className="space-y-2">
                      <div
                        onClick={() => setSelectedWorkflow(selectedWorkflow?.id === wf.id ? null : wf)}
                        className="text-[10px] font-mono cursor-pointer flex items-center gap-1 text-neutral-400 hover:text-white"
                      >
                        <ChevronRight className={`w-3.5 h-3.5 transform transition-transform ${selectedWorkflow?.id === wf.id ? 'rotate-90' : ''}`} />
                        <span>Last Execution: {lastExecution.timestamp} (Status: <span className="text-emerald-400 font-bold">SUCCESS</span>)</span>
                      </div>
                      {selectedWorkflow?.id === wf.id && (
                        <div className="bg-[#050505] p-3 rounded-lg border border-neutral-800 font-mono text-[9px] text-neutral-400 select-text space-y-1">
                          {lastExecution.logs.map((log: string, i: number) => (
                            <div key={i} className="opacity-70">{log}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* UNIFIED SEARCH TAB */}
      {activeSubTab === 'search' && (
        <div className="space-y-6 animate-fade-in select-none">
          <div>
            <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Cortex Unified Search Gateway</h3>
            <p className="text-xs opacity-50">Deep query and vector-retrieve indexed data across repositories, knowledge bases, email threads, Slack and Jira cards.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index keywords (e.g. theme, PR, leak, config, schema)..."
                className={`w-full pl-10 pr-4 py-2 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className={`px-4 py-2 rounded text-xs font-mono font-bold tracking-wider ${
                isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isSearching ? 'SEARCHING...' : 'DISPATCH'}
            </button>
          </form>

          {/* SEARCH RESULTS */}
          <div className="space-y-3">
            {searchResults.length === 0 ? (
              searchQuery && !isSearching ? (
                <div className="text-center py-8 text-xs opacity-50 italic">No corresponding indexed vectors matched the query parameter.</div>
              ) : null
            ) : (
              searchResults.map((result, idx) => (
                <div key={idx} className={`p-4 border rounded-xl space-y-1.5 animate-fade-in ${isDark ? 'bg-neutral-900/30 border-white/5' : 'bg-white border-black/5'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        result.source === 'repositories' ? 'bg-[#4ade80]/10 text-[#4ade80]' :
                        result.source === 'documents' ? 'bg-[#38bdf8]/10 text-[#38bdf8]' :
                        result.source === 'emails' ? 'bg-[#f87171]/10 text-[#f87171]' :
                        result.source === 'slack' ? 'bg-[#a78bfa]/10 text-[#a78bfa]' :
                        result.source === 'notion' ? 'bg-[#fbbf24]/10 text-[#fbbf24]' :
                        result.source === 'jira' ? 'bg-[#60a5fa]/10 text-[#60a5fa]' : 'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        {result.source.toUpperCase()}
                      </span>
                      <h4 className="text-xs font-bold font-mono tracking-wide">{result.title}</h4>
                    </div>
                    <span className="text-[9px] font-mono opacity-40">{result.timestamp}</span>
                  </div>

                  <p className="text-[11px] opacity-60 leading-relaxed font-sans">{result.excerpt}</p>

                  <div className="pt-2 flex justify-end">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9px] font-mono font-bold text-neutral-400 hover:text-white flex items-center gap-0.5"
                    >
                      <span>BROWSE PATH</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* DETAILED INTERACTION PANEL (MODAL/DRAWER) */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-4xl max-h-[85vh] overflow-y-auto border rounded-xl shadow-2xl p-6 flex flex-col space-y-5 animate-fade-in ${
            isDark ? 'bg-neutral-950 border-white/10 text-white' : 'bg-white border-black/10 text-black'
          }`}>
            <div className="flex justify-between items-start border-b border-neutral-800/40 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${isDark ? 'bg-white/2' : 'bg-black/2'}`}>
                  {renderConnectorIcon(selectedIntegration.id, 'w-6 h-6')}
                </div>
                <div>
                  <h3 className="text-sm font-bold font-mono tracking-wider">{selectedIntegration.name} Integration</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono opacity-50">SYNC RATE:</span>
                    <select
                      value={selectedIntegration.syncMode}
                      onChange={(e) => handleConfigure(selectedIntegration.id, e.target.value as any)}
                      className={`text-[10px] font-mono font-bold bg-transparent border-b focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                    >
                      <option value="manual">MANUAL ONLY</option>
                      <option value="automatic">AUTOMATIC SYNC</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedIntegration(null)}
                className="p-1 rounded hover:bg-white/5 opacity-50 hover:opacity-100 transition-all text-xs font-mono font-bold"
              >
                CLOSE
              </button>
            </div>

            {/* DYNAMIC CONNECTOR METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-4 border rounded-xl ${isDark ? 'bg-white/2 border-white/5' : 'bg-black/2 border-black/5'}`}>
                <div className="text-[10px] font-mono opacity-50 uppercase">Sync Operations</div>
                <div className="text-xl font-bold font-display mt-1">{selectedIntegration.usageStatistics?.syncsCount || 0}</div>
                <div className="text-[9px] font-mono opacity-40 mt-1">Total delta runs completed</div>
              </div>
              <div className={`p-4 border rounded-xl ${isDark ? 'bg-white/2 border-white/5' : 'bg-black/2 border-black/5'}`}>
                <div className="text-[10px] font-mono opacity-50 uppercase">Data Transferred</div>
                <div className="text-xl font-bold font-display mt-1">{(selectedIntegration.usageStatistics?.dataTransferredKB || 0)} KB</div>
                <div className="text-[9px] font-mono opacity-40 mt-1">Indexed vectors storage footprints</div>
              </div>
              <div className={`p-4 border rounded-xl ${isDark ? 'bg-white/2 border-white/5' : 'bg-black/2 border-black/5'}`}>
                <div className="text-[10px] font-mono opacity-50 uppercase">Gateway API Calls</div>
                <div className="text-xl font-bold font-display mt-1">{selectedIntegration.usageStatistics?.apiCallsCount || 0}</div>
                <div className="text-[9px] font-mono opacity-40 mt-1">Cortex API rate quota usage</div>
              </div>
            </div>

            {/* ERROR HISTORY / TELEMETRY LOGS */}
            {selectedIntegration.errorHistory && selectedIntegration.errorHistory.length > 0 && (
              <div className="space-y-2 bg-red-950/10 border border-red-900/30 p-4 rounded-xl">
                <h4 className="text-[10px] font-mono font-bold tracking-widest text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> REUSABLE SYNC ADAPTER DEGRADATION LOGS
                </h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {selectedIntegration.errorHistory.map((err: any, idx: number) => (
                    <div key={idx} className="text-[9px] font-mono flex justify-between gap-4 text-red-300">
                      <span>[{err.code}] {err.message}</span>
                      <span className="opacity-40">{new Date(err.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LIVE CONNECTOR PLAYGROUND (DASHBOARD ACTIONS) */}
            <div className="space-y-3 pt-2">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Interactive Integration Workspace</h4>

              {/* GITHUB PLAYGROUND */}
              {selectedIntegration.id === 'github' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-mono font-bold text-neutral-400 flex items-center gap-1.5"><GitBranch className="w-3.5 h-3.5" /> REPOSITORIES</h5>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selectedIntegration.data?.repositories?.map((repo: any) => (
                        <div key={repo.id} className="p-2 bg-black/15 border border-white/5 rounded-lg flex items-center justify-between text-xs font-mono">
                          <span>{repo.name} ({repo.privacy})</span>
                          <span className="text-[10px] opacity-50">★ {repo.stars}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-mono font-bold text-neutral-400 flex items-center gap-1.5"><GitPullRequest className="w-3.5 h-3.5" /> OPEN PULL REQUESTS</h5>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selectedIntegration.data?.pullRequests?.map((pr: any) => (
                        <div key={pr.id} className="p-2 bg-black/15 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                          <div className="flex justify-between">
                            <span className="font-bold truncate">{pr.title}</span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 rounded">{pr.status}</span>
                          </div>
                          <div className="text-[10px] opacity-40">Branch: {pr.branch} | Author: {pr.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DRIVE PLAYGROUND */}
              {selectedIntegration.id === 'drive' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">INDEXED WORKSPACE DOCUMENTS</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.files?.map((file: any) => (
                      <div key={file.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs font-mono flex items-center justify-between">
                        <div>
                          <div className="font-bold truncate">{file.name}</div>
                          <div className="text-[10px] opacity-40">Size: {file.size} | Editor: {file.modifiedBy}</div>
                        </div>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GMAIL PLAYGROUND */}
              {selectedIntegration.id === 'gmail' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">INBOX MESSAGES (AI SUMMARIZER ENABLED)</h5>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.emails?.map((msg: any) => (
                      <div key={msg.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-300">{msg.from}</span>
                          <span className="text-[9px] opacity-40">{msg.date}</span>
                        </div>
                        <div className="font-bold">{msg.subject}</div>
                        <div className="text-[10px] opacity-50 leading-relaxed truncate">{msg.body}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CALENDAR PLAYGROUND */}
              {selectedIntegration.id === 'calendar' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">UPCOMING CALENDAR SCHEDULES</h5>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.events?.map((evt: any) => (
                      <div key={evt.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                        <div className="font-bold">{evt.summary}</div>
                        <div className="text-[10px] text-pink-300 flex justify-between">
                          <span>{new Date(evt.startTime).toLocaleString()}</span>
                          <span className="opacity-40">{evt.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SLACK PLAYGROUND */}
              {selectedIntegration.id === 'slack' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">MONITORED CHANNELS & ACTIVITY</h5>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.messages?.map((msg: any) => (
                      <div key={msg.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                        <div className="flex justify-between text-[10px] opacity-50">
                          <span className="text-purple-400">#{msg.channelId === 'chan_1' ? 'ops-alerts' : 'cortex-dev'}</span>
                          <span>{msg.timestamp}</span>
                        </div>
                        <div><span className="font-bold">{msg.user}:</span> {msg.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NOTION PLAYGROUND */}
              {selectedIntegration.id === 'notion' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">INGESTED DATABASE RECORDS</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.pages?.map((page: any) => (
                      <div key={page.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs font-mono">
                        <div className="font-bold">{page.title}</div>
                        <div className="text-[10px] opacity-40 mt-1">Words: {page.wordsCount} | Editor: {page.lastEditedBy}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* JIRA PLAYGROUND */}
              {selectedIntegration.id === 'jira' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">SPRINT ISSUES TRACKER</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.issues?.map((issue: any) => (
                      <div key={issue.id} className="p-3 bg-black/15 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                        <div className="flex justify-between text-[10px] opacity-40">
                          <span className="text-blue-300 font-bold">{issue.id}</span>
                          <span>{issue.priority}</span>
                        </div>
                        <div className="font-bold leading-tight line-clamp-2">{issue.summary}</div>
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-[10px] opacity-50 truncate">{issue.assignee}</span>
                          <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.2 rounded font-bold uppercase">{issue.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FILESYSTEM PLAYGROUND */}
              {selectedIntegration.id === 'filesystem' && (
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono font-bold text-neutral-400">WATCHED FILE DIRECTORIES</h5>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedIntegration.data?.watchedFiles?.map((file: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-black/15 border border-white/5 rounded-lg text-xs font-mono flex items-center justify-between">
                        <div>
                          <span className="font-bold">{file.path}</span>
                          <div className="text-[10px] opacity-40">Size: {file.size} | Last Watch Sync: {file.lastSynced}</div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          file.status === 'modified' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {file.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DATABASE HUB INTERACTIVE TERMINAL */}
              {selectedIntegration.id === 'database' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono opacity-50">ENGINE ARCHITECTURE:</span>
                      <select
                        value={selectedDbEngine}
                        onChange={(e) => setSelectedDbEngine(e.target.value)}
                        className={`text-[10px] font-mono font-bold bg-transparent border-b focus:outline-none ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                      >
                        {selectedIntegration.data?.engines?.map((eng: string) => (
                          <option key={eng} value={eng}>{eng.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="text-[9px] font-mono text-neutral-400">
                      Schemas detected: <span className="text-emerald-400 font-bold">{dbSchemas ? dbSchemas.length : 0} tables</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Schema Column */}
                    <div className="md:col-span-4 bg-black/15 p-3 rounded-lg border border-white/5 max-h-60 overflow-y-auto text-[10px] font-mono space-y-3">
                      <div className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Schema Explorer</div>
                      {dbSchemas ? (
                        dbSchemas.map((tbl: any, idx: number) => (
                          <div key={idx} className="space-y-1">
                            <div className="text-emerald-300 font-bold">📂 {tbl.table}</div>
                            <div className="pl-3 opacity-60 space-y-0.5">
                              {tbl.columns.map((col: any, i: number) => (
                                <div key={i}>• {col.name} <span className="opacity-40 font-normal">({col.type})</span></div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="opacity-40 italic">Loading database schemas...</p>
                      )}
                    </div>

                    {/* Query Console Column */}
                    <div className="md:col-span-8 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold opacity-60">INTERACTIVE SQL TERMINAL</label>
                        <div className="relative">
                          <textarea
                            value={sqlQuery}
                            onChange={(e) => setSqlQuery(e.target.value)}
                            rows={3}
                            className="w-full bg-[#050505] border border-neutral-800 rounded-lg p-3 font-mono text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 select-text"
                          />
                          <button
                            onClick={handleRunSQL}
                            className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-bold transition-all"
                          >
                            <Code className="w-3.5 h-3.5" />
                            EXECUTE SQL
                          </button>
                        </div>
                      </div>

                      {/* SQL results table */}
                      {sqlError && (
                        <div className="bg-red-950/20 border border-red-900/40 text-red-400 p-3 rounded-lg text-xs font-mono flex items-start gap-2 select-text">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{sqlError}</span>
                        </div>
                      )}

                      {sqlResults && (
                        <div className="bg-[#050505] border border-neutral-800 rounded-lg p-3 max-h-40 overflow-auto select-text font-mono text-[10px] space-y-2">
                          <div className="text-neutral-500 font-bold">Query Results Statement:</div>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-neutral-800 text-neutral-400">
                                {Object.keys(sqlResults[0] || {}).map((k) => (
                                  <th key={k} className="pb-1 pr-4">{k.toUpperCase()}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {sqlResults.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-neutral-900 last:border-0 hover:bg-white/2 text-neutral-300">
                                  {Object.values(row).map((v: any, cIdx) => (
                                    <td key={cIdx} className="py-1.5 pr-4 truncate max-w-xs" title={typeof v === 'object' ? JSON.stringify(v) : v}>
                                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
