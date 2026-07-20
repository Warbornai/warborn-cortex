import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Terminal as TermIcon, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  Clock, 
  Play, 
  Hammer, 
  Network, 
  Bug, 
  UserCheck, 
  Zap, 
  Coins, 
  HelpCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { LogEntry } from '../types';
import { AgentRole, AgentCapability, Mission, TaskStep, AgentBusEvent } from '../lib/agentRuntime';

interface MultiAgentRuntimeDashboardProps {
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function MultiAgentRuntimeDashboard({ onAddLog, isDark }: MultiAgentRuntimeDashboardProps) {
  // Navigation tabs for the Multi-Agent component
  const [activeSubTab, setActiveSubTab] = useState<'missions' | 'agents' | 'bus' | 'tests'>('missions');

  // Agent registry
  const [agents, setAgents] = useState<AgentCapability[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);

  // Mission list & execution state
  const [customPrompt, setCustomPrompt] = useState('Build complete multi-user SaaS collaborative dashboard');
  const [presetPrompts] = useState([
    { title: 'SaaS Platform Deconstruct', prompt: 'Build complex SaaS dashboard with full PostgreSQL backend and analytics flow' },
    { title: 'Full Credentials & Memory Audit', prompt: 'Perform complete platform review for memory leaks and secure variables' },
    { title: 'Research & Draft API Specs', prompt: 'Draft complete sequential API specification for deep grounding' },
    { title: 'Rapid Standard Query', prompt: 'Resolve standard intelligence inquiry regarding decentralized nodes' }
  ]);
  const [isSpawning, setIsSpawning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionLogs, setMissionLogs] = useState<string[]>([]);
  const [missionEvents, setMissionEvents] = useState<AgentBusEvent[]>([]);

  // Testing suite states
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [testStats, setTestStats] = useState<any | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  // Fetch agents list
  const fetchAgents = async () => {
    setLoadingAgents(true);
    try {
      const response = await fetch('/api/cortex/multiagent/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (e) {
      console.error('Failed to load agents:', e);
    } finally {
      setLoadingAgents(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Handle spawn & execution of multi-agent mission
  const spawnMission = async (promptText: string) => {
    if (!promptText.trim()) return;
    setIsSpawning(true);
    try {
      const response = await fetch('/api/cortex/multiagent/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) {
        throw new Error(`Failed to map mission: ${response.statusText}`);
      }

      const data = await response.json();
      const mission: Mission = data.mission;
      setActiveMissions(prev => [mission, ...prev]);
      setSelectedMission(mission);
      setMissionLogs([`Mission ${mission.id} scheduled. Mode: ${mission.executionMode}`]);
      setMissionEvents([]);
      
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'ORCHESTRATOR',
        message: `Scheduled multi-agent mission (${mission.id}) with mode: ${mission.executionMode}`
      });
    } catch (e: any) {
      console.error(e);
      setMissionLogs(prev => [...prev, `Spawning failure: ${e.message}`]);
    } finally {
      setIsSpawning(false);
    }
  };

  const executeActiveMission = async () => {
    if (!selectedMission || isExecuting) return;
    setIsExecuting(true);
    setMissionLogs(prev => [...prev, 'Spinning up container runtime environment...', 'Synchronizing agent bus connection...']);

    try {
      const response = await fetch('/api/cortex/multiagent/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId: selectedMission.id })
      });

      if (!response.ok) {
        throw new Error(`Execution error: ${response.statusText}`);
      }

      const data = await response.json();
      const updatedMission: Mission = data.mission;
      
      // Update local state lists
      setSelectedMission(updatedMission);
      setActiveMissions(prev => prev.map(m => m.id === updatedMission.id ? updatedMission : m));
      setMissionEvents(data.events || []);
      setMissionLogs(prev => [...prev, ...(data.logs || []), `Mission finished. Confidence: ${(updatedMission.confidenceScore * 100).toFixed(1)}%`]);

      // Refresh agents metrics because execution occurred
      fetchAgents();

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'ORCHESTRATOR',
        message: `Completed multi-agent mission ${updatedMission.id} in ${updatedMission.durationMs}ms. Confidence score: ${(updatedMission.confidenceScore * 100).toFixed(1)}%.`
      });
    } catch (e: any) {
      console.error(e);
      setMissionLogs(prev => [...prev, `Execution failure: ${e.message}`]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Run automated multi-agent suite
  const runAgentTests = async () => {
    setIsTesting(true);
    setTestResults([]);
    setTestStats(null);
    setTestLogs(['Deploying temporary Agent Sandbox context...', 'Handshaking with Agent Bus...', 'Commencing stress benchmarks...']);

    try {
      const response = await fetch('/api/cortex/multiagent/tests', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Test pipeline failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTestResults(data.results || []);
      setTestStats(data.metrics || null);
      setTestLogs(data.logs || []);

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'SWARM_TEST',
        message: `Multi-agent validation completed. Passed: ${data.metrics?.passed}/${data.metrics?.total || 0} checks.`
      });
    } catch (e: any) {
      console.error(e);
      setTestLogs(prev => [...prev, `STRESS TEST ANOMALY: ${e.message}`]);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper overview header */}
      <div className={`p-6 border rounded-xl transition-all duration-300 ${
        isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 select-none">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-neutral-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                Warborn Multi-Agent Runtime OS
              </h3>
            </div>
            <p className="text-xs opacity-50 mt-1 leading-relaxed max-w-[700px]">
              Orchestrate, coordinate, and supervise highly collaborative specialized agent cells. 
              Deploy temporary pipelines to fulfill complex engineering tasks, and monitor active heartbeat telemetry.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('missions')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider cursor-pointer transition-all ${
                activeSubTab === 'missions'
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Missions Planner
            </button>
            <button
              onClick={() => {
                setActiveSubTab('agents');
                fetchAgents();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider cursor-pointer transition-all ${
                activeSubTab === 'agents'
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Agent Registry
            </button>
            <button
              onClick={() => setActiveSubTab('bus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider cursor-pointer transition-all ${
                activeSubTab === 'bus'
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Agent Communication Bus
            </button>
            <button
              onClick={() => setActiveSubTab('tests')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider cursor-pointer transition-all ${
                activeSubTab === 'tests'
                  ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                  : isDark ? 'bg-neutral-950 text-neutral-400 hover:bg-neutral-900' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              Validation & Swarms
            </button>
          </div>
        </div>

        {/* Global Operating System telemetry specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/20 select-none">
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">ORCHESTRATOR STATUS</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-neutral-200 font-display">NOMINAL MULTI-CELL ACTIVE</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">SPAWNED SPEC CELL LABELS</span>
            <span className="text-sm font-bold font-display text-sky-400">14 REGISTERED ROLES</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">BUS LATENCY HANDSHAKE</span>
            <span className="text-sm font-bold font-display text-purple-400">&lt; 0.15ms</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">SECURITY ENVELOPE</span>
            <span className="text-sm font-bold font-display text-emerald-400">RESTRICTED SANDBOX</span>
          </div>
        </div>
      </div>

      {/* Main Tab Panel execution router */}

      {/* TAB 1: MISSION PLANNER AND TIMELINE */}
      {activeSubTab === 'missions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left panel: Spawn options & Preset controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`p-6 border rounded-xl flex flex-col transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
            }`}>
              <div className="flex items-center gap-2 border-b border-neutral-800/15 pb-4 mb-4 select-none">
                <Network className="w-4 h-4 text-neutral-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                  SPAWN MISSION ORCHESTRATION
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold mono-text opacity-45 uppercase block mb-1.5 select-none">
                    ENTER AUTONOMOUS PROMPT DIRECTIVE
                  </label>
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Enter engineering instructions..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs bg-transparent focus:outline-none transition-all ${
                      isDark ? 'border-white/10 text-neutral-200 focus:border-white/20' : 'border-black/10 text-neutral-800 focus:border-black/20'
                    }`}
                  />
                </div>

                <button
                  onClick={() => spawnMission(customPrompt)}
                  disabled={isSpawning || !customPrompt.trim()}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white text-black hover:bg-neutral-200 transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isSpawning ? 'Deconstructing Request...' : 'Schedule & Plan Mission'}
                </button>
              </div>

              {/* Preset prompt templates */}
              <div className="mt-6 pt-6 border-t border-neutral-800/15">
                <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-3 select-none">
                  PRESET MISSION TEMPLATES
                </span>
                <div className="space-y-2">
                  {presetPrompts.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCustomPrompt(preset.prompt);
                        spawnMission(preset.prompt);
                      }}
                      className="p-2.5 border border-neutral-800/20 rounded-lg cursor-pointer hover:border-neutral-700/50 bg-[#0c0c0c]/30 hover:bg-[#0f0f0f]/50 transition-all flex items-center justify-between gap-3 text-left"
                    >
                      <div>
                        <span className="text-xs font-semibold text-neutral-300 block">{preset.title}</span>
                        <span className="text-[10px] text-neutral-500 block truncate max-w-[280px] mt-0.5">{preset.prompt}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Missions List history queue */}
            {activeMissions.length > 0 && (
              <div className={`p-6 border rounded-xl transition-all duration-300 ${
                isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
              }`}>
                <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-3 select-none">
                  MISSION DEPLOYMENT QUEUE
                </span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {activeMissions.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setSelectedMission(m);
                        setMissionLogs([`Selected mission ${m.id}`]);
                        setMissionEvents([]);
                      }}
                      className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        selectedMission?.id === m.id
                          ? 'border-neutral-400 bg-neutral-900/10'
                          : 'border-neutral-800/30 bg-transparent hover:border-neutral-700/40'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[9px] mono-text opacity-40 font-bold block">{m.id}</span>
                        <span className="text-xs font-semibold text-neutral-300 truncate block mt-0.5">{m.prompt}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                        m.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40'
                          : m.status === 'running'
                            ? 'bg-sky-950/40 text-sky-400 border border-sky-900/40 animate-pulse'
                            : 'bg-neutral-800/40 text-neutral-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel: Step Trace timeline and final consensus result */}
          <div className="lg:col-span-7 space-y-6">
            {selectedMission ? (
              <div className={`p-6 border rounded-xl flex flex-col transition-all duration-300 ${
                isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/15 pb-4 mb-5">
                  <div>
                    <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">ORCHESTRATED BLUEPRINT</span>
                    <h4 className="text-sm font-bold tracking-wide text-neutral-200 mt-1">
                      {selectedMission.id} &mdash; <span className="text-purple-400">{selectedMission.executionMode}</span>
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    {selectedMission.status === 'planning' && (
                      <button
                        onClick={executeActiveMission}
                        disabled={isExecuting}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {isExecuting ? 'SPAWNING SWARM...' : 'EXECUTE ACTIVE CELL'}
                      </button>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      selectedMission.status === 'completed' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-neutral-900 text-neutral-400'
                    }`}>
                      {selectedMission.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      STATUS: {selectedMission.status}
                    </span>
                  </div>
                </div>

                {/* Subtask tree timeline */}
                <div className="space-y-4">
                  <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-1">
                    DECOMPOSED MISSION SEQUENCE
                  </span>

                  <div className="relative border-l border-neutral-800/50 ml-3 pl-6 space-y-5">
                    {selectedMission.steps.map((step, idx) => (
                      <div key={step.id} className="relative group">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border transition-all ${
                          step.status === 'completed'
                            ? 'bg-emerald-400 border-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                            : step.status === 'executing'
                              ? 'bg-sky-400 border-sky-400 animate-pulse'
                              : 'bg-neutral-800 border-neutral-700'
                        }`} />

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-200">{step.title}</span>
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-800/80 text-purple-400 font-semibold uppercase">
                                {step.assignedRole}
                              </span>
                            </div>
                            {step.outputSummary && (
                              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed bg-black/25 p-2 rounded border border-white/5 font-mono">
                                {step.outputSummary}
                              </p>
                            )}
                          </div>
                          {step.durationMs > 0 && (
                            <span className="text-[10px] mono-text opacity-40 font-bold shrink-0">{step.durationMs}ms</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consensus payload block */}
                {selectedMission.finalOutput && (
                  <div className="mt-6 pt-6 border-t border-neutral-800/15 space-y-3">
                    <div className="flex items-center justify-between select-none">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-[9px] font-bold mono-text opacity-40 uppercase">
                          CONSENSUS MERGED OUTPUT
                        </span>
                      </div>
                      <span className="text-[10px] mono-text font-bold text-sky-400">
                        CONFIDENCE: {(selectedMission.confidenceScore * 100).toFixed(1)}%
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-900/15 bg-emerald-950/5 text-xs text-neutral-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[220px]">
                      {selectedMission.finalOutput}
                    </div>
                  </div>
                )}

                {/* Micro-telemetry details */}
                {selectedMission.totalTokens > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800/15 select-none">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold mono-text opacity-40 block uppercase">MISSION LATENCY</span>
                      <span className="text-xs font-bold text-neutral-200">{selectedMission.durationMs}ms</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold mono-text opacity-40 block uppercase">TOTAL CONTEXT TOKENS</span>
                      <span className="text-xs font-bold text-neutral-200">{selectedMission.totalTokens}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold mono-text opacity-40 block uppercase">ACCUMULATED COST</span>
                      <span className="text-xs font-bold text-neutral-200">${selectedMission.totalCostUsd.toFixed(6)} USD</span>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className={`p-12 border rounded-xl flex flex-col items-center justify-center text-center opacity-40 select-none h-full min-h-[400px] transition-all duration-300 ${
                isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
              }`}>
                <Users className="w-10 h-10 mb-3 stroke-1" />
                <p className="text-xs font-bold uppercase tracking-wider font-display">NO ACTIVE MISSION SELECTED</p>
                <p className="text-[10px] lowercase max-w-[320px] mt-1 leading-relaxed">
                  select a template or type custom specifications, then schedule to deconstruct and allocate autonomous subtask workers.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: AGENT REGISTRY */}
      {activeSubTab === 'agents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800/15 pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-neutral-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                REGISTERED AGENT CELL REPOSITORIES
              </h4>
            </div>
            <button
              onClick={fetchAgents}
              disabled={loadingAgents}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800/80 text-[10px] font-bold uppercase tracking-wider hover:border-neutral-700/85 text-neutral-400 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAgents ? 'animate-spin' : ''}`} />
              Refresh Metrics
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.role}
                className={`p-5 border rounded-xl flex flex-col justify-between transition-all duration-300 ${
                  isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800/10 pb-3 mb-3 select-none">
                    <div>
                      <span className="text-[9px] mono-text opacity-40 font-bold block uppercase">ROLE VERSION: {agent.version}</span>
                      <h5 className="text-xs font-bold tracking-wide text-neutral-200 mt-0.5">{agent.name}</h5>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      agent.healthStatus === 'nominal' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-yellow-950/40 text-yellow-400'
                    }`}>
                      {agent.healthStatus}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed min-h-[48px]">
                    {agent.description}
                  </p>

                  <div className="mt-4 space-y-2 select-none">
                    <div className="flex flex-wrap gap-1">
                      {agent.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800/80 text-[8px] font-bold uppercase font-mono text-neutral-500"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Metrics footer for this agent card */}
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-neutral-800/10 select-none">
                  <div>
                    <span className="text-[9px] font-bold mono-text opacity-40 block uppercase">TASKS DONE</span>
                    <span className="text-xs font-bold text-neutral-300">{agent.metrics.tasksCompleted} specs</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold mono-text opacity-40 block uppercase">SUCCESS RATE</span>
                    <span className="text-xs font-bold text-emerald-400">{(agent.metrics.successRate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="col-span-2 pt-1">
                    <div className="flex justify-between text-[9px] mono-text opacity-40 uppercase font-bold">
                      <span>TOKENS: {agent.metrics.tokensConsumed}</span>
                      <span>LATENCY: {agent.metrics.totalLatencyMs}ms</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AGENT COMMUNICATION BUS */}
      {activeSubTab === 'bus' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Instructions */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-6 border rounded-xl transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
            }`}>
              <div className="flex items-center gap-2 border-b border-neutral-800/15 pb-4 mb-4 select-none">
                <Clock className="w-4 h-4 text-neutral-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                  AGENT COMMUNICATION BUS
                </h4>
              </div>
              <p className="text-[11px] opacity-50 leading-relaxed">
                The Agent Bus represents the decentralized, secure communication pipeline holding absolute 
                sandboxed boundaries. No agent can bypass the bus to call adjacent workers.
              </p>
              <ul className="text-[11px] opacity-40 mt-4 space-y-2 list-disc pl-4 leading-relaxed font-mono">
                <li>Event broadcast isolation</li>
                <li>Audit trails with cryptographic handshakes</li>
                <li>Zero permission escapes or privilege escalations</li>
              </ul>
            </div>
          </div>

          {/* Event stream list */}
          <div className="lg:col-span-8 flex flex-col">
            <div className={`p-6 border rounded-xl flex flex-col h-[520px] transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
            }`}>
              <div className="flex items-center gap-2 border-b border-neutral-800/15 pb-4 mb-4 select-none">
                <TermIcon className="w-4 h-4 text-neutral-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                  REAL-TIME BUS EVENT TRACER
                </h4>
              </div>

              <div className="flex-1 bg-[#070707] rounded-lg p-4 font-mono text-[10px] leading-relaxed text-emerald-500 overflow-y-auto space-y-2 select-text scrollbar-thin">
                {missionEvents.length === 0 ? (
                  <span className="opacity-35 select-none block text-center py-12">
                    Bus idle. Deploy or run an engineering mission to stream secure heartbeats, tasks, and achievements here.
                  </span>
                ) : (
                  missionEvents.map((evt) => (
                    <div key={evt.eventId} className="border-b border-neutral-900/80 pb-2 mb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center justify-between gap-3 text-neutral-400 select-none">
                        <span className="font-bold text-sky-400">
                          {evt.type.toUpperCase()}
                        </span>
                        <span className="opacity-30">{evt.timestamp}</span>
                      </div>
                      <p className="text-neutral-300 mt-1 leading-relaxed">
                        <span className="text-purple-400">[{evt.senderRole} &rarr; {evt.recipientRole}]</span> {evt.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: SWARM TESTING SUITE */}
      {activeSubTab === 'tests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left spec trigger */}
          <div className="lg:col-span-7 flex flex-col h-[560px]">
            <div className={`p-6 border rounded-xl flex flex-col h-full transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/15 pb-4 mb-4 select-none">
                <div className="flex items-center gap-2">
                  <Bug className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                    AUTOMATED AGENT SWARM TEST SUITE
                  </h4>
                </div>

                <button
                  onClick={runAgentTests}
                  disabled={isTesting}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-black hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isTesting ? 'BENCHMARKING...' : 'RUN VERIFICATIONS'}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {testResults.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none py-12">
                    <Activity className="w-8 h-8 mb-2 stroke-1 text-purple-400" />
                    <p className="text-xs font-medium uppercase tracking-wider mono-text">NO SWARM TEST SUITES ACTIVE</p>
                    <p className="text-[10px] lowercase max-w-[280px] mt-0.5 leading-relaxed">
                      click "Run Verifications" to execute multi-agent unit tests, parallel stress tests, and isolated sandbox validation scripts.
                    </p>
                  </div>
                ) : (
                  testResults.map((test) => (
                    <div
                      key={test.id}
                      className={`border rounded-lg p-3 transition-all duration-200 ${
                        test.status === 'passed'
                          ? 'bg-emerald-950/5 border-emerald-900/15'
                          : 'bg-rose-950/5 border-rose-900/15'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 select-none">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {test.status === 'passed' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800/40 text-neutral-400 font-bold mono-text uppercase mr-2 font-mono">
                              {test.category}
                            </span>
                            <span className="text-xs font-semibold tracking-wide text-neutral-300">{test.name}</span>
                          </div>
                        </div>
                        <span className="text-[10px] mono-text opacity-40 font-bold shrink-0">
                          {test.durationMs}ms
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-neutral-800/15 text-[10px] mono-text text-neutral-400 space-y-1 bg-black/30 p-2.5 rounded overflow-x-auto select-text">
                        {test.logs.map((logLine: string, idx: number) => (
                          <div key={idx}>
                            <span className="opacity-30 mr-2">[{idx + 1}]</span>
                            {logLine}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Stats cumulative footer */}
              {testStats && (
                <div className="mt-4 pt-4 border-t border-neutral-800/15 flex items-center justify-between text-[11px] mono-text select-none">
                  <div className="flex gap-4">
                    <span>PASSED: <span className="text-emerald-400 font-bold">{testStats.passed}</span></span>
                    <span>FAILED: <span className="text-rose-400 font-bold">{testStats.failed}</span></span>
                  </div>
                  <span className="opacity-45">ELAPSED TIME: {testStats.durationMs}ms</span>
                </div>
              )}
            </div>
          </div>

          {/* Right spec logs */}
          <div className="lg:col-span-5 flex flex-col h-[560px]">
            <div className={`p-6 border rounded-xl flex flex-col h-full transition-all duration-300 ${
              isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
            }`}>
              <div className="flex items-center gap-2 border-b border-neutral-800/15 pb-4 mb-4 select-none">
                <TermIcon className="w-4 h-4 text-neutral-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                  STRESS LOGGER OUTPUT
                </h4>
              </div>

              <div className="flex-1 bg-[#070707] rounded-lg p-4 font-mono text-[10px] leading-relaxed text-emerald-500 overflow-y-auto space-y-1 select-text scrollbar-thin">
                {testLogs.length === 0 ? (
                  <span className="opacity-30 select-none">Terminal idle. Waiting for diagnostics suite invoke...</span>
                ) : (
                  testLogs.map((log, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      <span className="text-neutral-600 select-none">cortex-sys # </span>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
