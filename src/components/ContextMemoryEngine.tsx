import React, { useState, useEffect } from 'react';
import { LogEntry } from '../types';
import {
  Brain,
  Search,
  PlusCircle,
  Bookmark,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Pin,
  Trash2,
  Check,
  X,
  Edit2,
  AlertCircle,
  BarChart2,
  TrendingUp,
  GitBranch,
  Clock,
  Info,
  Activity,
  Zap,
  Cpu,
  FileText,
  Layers,
  Network,
  ListFilter
} from 'lucide-react';

export type HierarchicalMemoryType =
  | 'working'
  | 'conversation'
  | 'project'
  | 'user'
  | 'organization'
  | 'long_term'
  | 'archived';

interface MemoryNodeV2 {
  id: string;
  type: HierarchicalMemoryType;
  content: string;
  source: string;
  timestamp: string;
  confidence: number;
  importance: number; // 1 to 10
  owner: string;
  permissions: string[];
  relatedMemories: string[];
  summary: string;
  isPinned?: boolean;
  expiresAt?: string;
}

interface ContextMemoryEngineProps {
  memories: any[]; // fallback / unused
  onAddMemory: (mem: any) => void; // fallback / unused
  customInstruction: string;
  onUpdateInstruction: (text: string) => void;
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function ContextMemoryEngine({
  customInstruction,
  onUpdateInstruction,
  onAddLog,
  isDark,
}: ContextMemoryEngineProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newType, setNewType] = useState<HierarchicalMemoryType>('working');
  const [newImportance, setNewImportance] = useState<number>(5);
  const [newSource, setNewSource] = useState<string>('system-console');
  
  // Dynamic validation & Duplicate warning
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);

  // Live state from Cortex Server
  const [liveMemories, setLiveMemories] = useState<MemoryNodeV2[]>([]);
  const [verificationQueue, setVerificationQueue] = useState<MemoryNodeV2[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [memoryGraph, setMemoryGraph] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState<boolean>(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [editImportance, setEditImportance] = useState<number>(5);
  const [editType, setEditType] = useState<HierarchicalMemoryType>('working');

  // Display mode (TIMELINE, GRAPH, CLUSTERS, EVENT BUS, CONTEXT)
  const [displayMode, setDisplayMode] = useState<'timeline' | 'graph' | 'clusters' | 'eventbus' | 'context'>('timeline');

  // Extended features states
  const [clusters, setClusters] = useState<any[]>([]);
  const [eventsHistory, setEventsHistory] = useState<any[]>([]);
  const [triggers, setTriggers] = useState<any[]>([]);
  const [contextItems, setContextItems] = useState<any[]>([]);
  const [contextSummary, setContextSummary] = useState<any>(null);

  // Custom context link state
  const [newCtxSource, setNewCtxSource] = useState<string>('');
  const [newCtxTarget, setNewCtxTarget] = useState<string>('');
  const [newCtxRel, setNewCtxRel] = useState<string>('');

  // Event bus manual publish state
  const [pubTopic, setPubTopic] = useState<string>('system');
  const [pubType, setPubType] = useState<string>('DeveloperInteraction');
  const [pubSource, setPubSource] = useState<string>('console_ui');
  const [pubPriority, setPubPriority] = useState<'low' | 'normal' | 'high' | 'critical'>('normal');
  const [pubPayload, setPubPayload] = useState<string>('{"action": "clicked_tab"}');

  // Trigger setup state
  const [trgSource, setTrgSource] = useState<string>('');
  const [trgTarget, setTrgTarget] = useState<string>('');
  const [trgField, setTrgField] = useState<string>('');
  const [trgValue, setTrgValue] = useState<string>('');

  // Graph traversal / Pathfinding state
  const [travId, setTravId] = useState<string>('');
  const [travResult, setTravResult] = useState<any>(null);
  const [pathStart, setPathStart] = useState<string>('');
  const [pathEnd, setPathEnd] = useState<string>('');
  const [pathResult, setPathResult] = useState<any>(null);

  // Fetch all live data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Search memories
      const searchRes = await fetch(`/api/v1/intelligence/memory/search?q=${encodeURIComponent(searchTerm)}`);
      if (searchRes.ok) {
        const data = await searchRes.json();
        if (data.success) {
          setLiveMemories(data.memories || []);
        }
      }

      // 2. Fetch verification queue
      const approvalRes = await fetch('/api/v1/intelligence/memory/approval');
      if (approvalRes.ok) {
        const data = await approvalRes.json();
        if (data.success) {
          setVerificationQueue(data.queue || []);
        }
      }

      // 3. Fetch statistics
      const statsRes = await fetch('/api/v1/intelligence/memory/analytics');
      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) {
          setStats(data.analytics);
        }
      }

      // 4. Fetch memory graph
      const graphRes = await fetch('/api/v1/intelligence/memory/graph');
      if (graphRes.ok) {
        const data = await graphRes.json();
        if (data.success) {
          setMemoryGraph(data.graph || { nodes: [], edges: [] });
        }
      }

      // 5. Fetch clusters
      const clustersRes = await fetch('/api/v1/intelligence/memory/clusters');
      if (clustersRes.ok) {
        const data = await clustersRes.json();
        if (data.success) {
          setClusters(data.clusters || []);
        }
      }

      // 6. Fetch Event Bus logs
      const eventsRes = await fetch('/api/v1/intelligence/eventbus/history');
      if (eventsRes.ok) {
        const data = await eventsRes.json();
        if (data.success) {
          setEventsHistory(data.history || []);
        }
      }

      // 7. Fetch active dynamic Triggers
      const triggersRes = await fetch('/api/v1/intelligence/eventbus/triggers');
      if (triggersRes.ok) {
        const data = await triggersRes.json();
        if (data.success) {
          setTriggers(data.triggers || []);
        }
      }

      // 8. Fetch compiled Context Items
      const contextRes = await fetch('/api/v1/intelligence/context');
      if (contextRes.ok) {
        const data = await contextRes.json();
        if (data.success) {
          setContextItems(data.items || []);
        }
      }

      // 9. Fetch dynamic Context Summary
      const contextSummaryRes = await fetch('/api/v1/intelligence/context/summary');
      if (contextSummaryRes.ok) {
        const data = await contextSummaryRes.json();
        if (data.success) {
          setContextSummary(data);
        }
      }

    } catch (err) {
      console.error('Error fetching Cortex memory data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [searchTerm]);

  // Check duplicates on content change
  useEffect(() => {
    if (!newContent.trim()) {
      setIsDuplicate(false);
      return;
    }
    const match = liveMemories.some(
      m => m.content.toLowerCase().trim() === newContent.toLowerCase().trim()
    );
    setIsDuplicate(match);
  }, [newContent, liveMemories]);

  // Create Memory Node
  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'MEMORY',
      message: `Persisting new memory block to Cortex: "${newContent.substring(0, 35)}..."`,
    });

    try {
      const response = await fetch('/api/v1/intelligence/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          content: newContent.trim(),
          source: newSource,
          importance: newImportance,
          owner: 'developer',
          confidence: 0.95,
        }),
      });

      if (!response.ok) throw new Error('Cortex memory ingestion failed');
      const data = await response.json();

      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MEMORY',
          message: `Memory node saved successfully. ID: ${data.memory.id}${newImportance >= 9 ? ' (Pending verification queue)' : ''}`,
        });
        setNewContent('');
        setNewImportance(5);
        fetchAllData();
      }
    } catch (err: any) {
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        module: 'MEMORY',
        message: `Inward memory sync failed: ${err.message || err}`,
      });
    }
  };

  // Update Memory Node
  const handleUpdate = async (id: string) => {
    if (!editContent.trim()) return;

    try {
      const res = await fetch(`/api/v1/intelligence/memory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent.trim(),
          importance: editImportance,
          type: editType,
        }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MEMORY',
          message: `Memory node ${id} updated on live Cortex registry.`,
        });
        setEditingId(null);
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pin / Unpin Memory Node
  const handleTogglePin = async (id: string, currentlyPinned: boolean) => {
    try {
      const res = await fetch(`/api/v1/intelligence/memory/${id}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: !currentlyPinned }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'trace',
          module: 'MEMORY',
          message: `Memory ${id} pinning state set to ${!currentlyPinned}`,
        });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Memory Node
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to prune this memory cell from Cortex?')) return;

    try {
      const res = await fetch(`/api/v1/intelligence/memory/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MEMORY',
          message: `Pruned memory node ${id} from live Cortex index.`,
        });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve Memory Node
  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const res = await fetch(`/api/v1/intelligence/memory/approval/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approve }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'MEMORY',
          message: `Memory candidate ${id} was ${approve ? 'APPROVED' : 'REJECTED & PRUNED'}`,
        });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Event bus manual publish handler
  const handlePublishEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let parsedPayload = {};
      try {
        parsedPayload = JSON.parse(pubPayload);
      } catch (err) {
        parsedPayload = { text: pubPayload };
      }

      const res = await fetch('/api/v1/intelligence/eventbus/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: pubTopic,
          eventType: pubType,
          source: pubSource,
          payload: parsedPayload,
          priority: pubPriority,
        }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'EVENTBUS',
          message: `Manually published event to topic "${pubTopic}": ${pubType}`,
        });
        setPubPayload('{}');
        fetchAllData();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Add Dynamic Trigger Handler
  const handleAddTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trgSource || !trgTarget) return;

    try {
      const res = await fetch('/api/v1/intelligence/eventbus/triggers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceTopic: trgSource,
          targetTopic: trgTarget,
          conditionField: trgField || undefined,
          conditionValue: trgValue || undefined,
        }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'EVENTBUS',
          message: `Registered new reactive event trigger from "${trgSource}" to "${trgTarget}"`,
        });
        setTrgSource('');
        setTrgTarget('');
        setTrgField('');
        setTrgValue('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Dynamic Trigger Handler
  const handleDeleteTrigger = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/intelligence/eventbus/triggers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'EVENTBUS',
          message: `Deregistered reactive trigger ${id}`,
        });
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Context Link Handler
  const handleCreateContextLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCtxSource || !newCtxTarget || !newCtxRel) return;

    try {
      const res = await fetch('/api/v1/intelligence/context/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: newCtxSource,
          targetId: newCtxTarget,
          relationship: newCtxRel,
        }),
      });

      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'CONTEXT',
          message: `Linked context node "${newCtxSource}" to "${newCtxTarget}" as "${newCtxRel}"`,
        });
        setNewCtxSource('');
        setNewCtxTarget('');
        setNewCtxRel('');
        fetchAllData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Traverse live synapses
  const handleTraverseNode = async (id: string) => {
    setTravId(id);
    try {
      const res = await fetch(`/api/v1/intelligence/memory/${id}/traverse?depth=2`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTravResult(data.traversal);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Pathfind between memories
  const handleFindPath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pathStart || !pathEnd) return;

    try {
      const res = await fetch(`/api/v1/intelligence/memory/path?nodeId1=${pathStart}&nodeId2=${pathEnd}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPathResult({
            path: data.path,
            edges: data.edges,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getMemoryTypeBadge = (type: HierarchicalMemoryType) => {
    switch (type) {
      case 'working':
        return 'text-amber-400 bg-amber-950/20 border-amber-900/35';
      case 'conversation':
        return 'text-purple-400 bg-purple-950/20 border-purple-900/35';
      case 'project':
        return 'text-blue-400 bg-blue-950/20 border-blue-900/35';
      case 'user':
        return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/35';
      case 'organization':
        return 'text-pink-400 bg-pink-950/20 border-pink-900/35';
      case 'long_term':
        return 'text-cyan-400 bg-cyan-950/20 border-cyan-900/35';
      case 'archived':
        return 'text-neutral-400 bg-neutral-950/20 border-neutral-900/35';
      default:
        return 'text-neutral-400 bg-neutral-950/20 border-neutral-900/35';
    }
  };

  const startEdit = (m: MemoryNodeV2) => {
    setEditingId(m.id);
    setEditContent(m.content);
    setEditImportance(m.importance);
    setEditType(m.type);
  };

  const filteredMemories = liveMemories.filter((mem) => {
    const matchesTab = activeTab === 'all' || mem.type === activeTab;
    return matchesTab;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left panel: Context Tuning & Stats */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Dynamic Context Summary Node */}
        {contextSummary && (
          <div
            className={`p-6 border rounded-xl transition-all duration-300 ${
              isDark ? 'bg-gradient-to-r from-[#141414] to-[#1a1a1a] border-white/5' : 'bg-white border-black/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                Universal Context status
              </h3>
            </div>
            <p className="text-xs font-mono opacity-80 leading-relaxed mb-4">
              {contextSummary.summaryText}
            </p>
            <div className="space-y-1.5 border-t border-neutral-800/40 pt-3">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono block">Dynamic Workspace Integrity</span>
              <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {contextSummary.dynamicHealth}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Memory Statistics */}
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                Cortex Memory Metrics
              </h3>
            </div>
            <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded font-mono">LIVE SYNC</span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className={`p-3 rounded border text-center ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="text-[10px] block opacity-50 font-mono">TOTAL NODES</span>
              <span className="text-lg font-bold font-mono">{stats?.totalCount || liveMemories.length}</span>
            </div>
            <div className={`p-3 rounded border text-center ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="text-[10px] block opacity-50 font-mono">AVG IMPORTANCE</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {stats?.averageImportance ? stats.averageImportance.toFixed(1) : '5.0'}/10
              </span>
            </div>
            <div className={`p-3 rounded border text-center ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="text-[10px] block opacity-50 font-mono">PENDING APPRV</span>
              <span className="text-lg font-bold font-mono text-pink-400">
                {verificationQueue.length}
              </span>
            </div>
          </div>

          {stats?.typeDistribution && (
            <div className="border-t border-neutral-800/30 pt-3 space-y-1.5">
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">Type Distribution</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                {Object.entries(stats.typeDistribution).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center opacity-85">
                    <span className="capitalize">{type}:</span>
                    <span className="font-bold">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Custom Instructions Ingress */}
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-3.5">
            <ShieldCheck className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              ACTIVE CORTEX SYS_DIRECTIVES
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <textarea
                value={customInstruction}
                onChange={(e) => onUpdateInstruction(e.target.value)}
                placeholder="Declare active instructions for the orchestration agent..."
                rows={3}
                className={`w-full px-3 py-2 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-all duration-300 ${
                  isDark
                    ? 'border-neutral-800 text-[#EDEDED] placeholder-neutral-600'
                    : 'border-neutral-300 text-[#18181B] placeholder-neutral-400'
                }`}
              />
              <span className="text-[9px] mono-text opacity-40 mt-1 block leading-normal">
                Modifies baseline agent behaviors. Saves automatically onto the workspace parameters.
              </span>
            </div>
          </div>
        </div>

        {/* Add Memory Form */}
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-3.5">
            <PlusCircle className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              PERSIST MEMORY SYNAPSE
            </h3>
          </div>

          <form onSubmit={handleCreateMemory} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                SYNAPSE CONTENT
              </label>
              <textarea
                required
                value={newContent}
                rows={2}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Capture system rules, server configurations, design patterns, or context states..."
                className={`w-full px-3 py-2 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                  isDark ? 'border-neutral-800 text-[#EDEDED]' : 'border-neutral-300 text-[#18181B]'
                }`}
              />
              {isDuplicate && (
                <div className="flex items-center gap-1.5 text-[10px] text-amber-400 mt-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cortex detected duplicate synapse entry.</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                  MEMORY SYSTEM TYPE
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as HierarchicalMemoryType)}
                  className={`w-full px-2 py-1.5 rounded border bg-transparent text-xs focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                >
                  <option value="working" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Working Memory</option>
                  <option value="conversation" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Conversation</option>
                  <option value="project" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Project Context</option>
                  <option value="user" className={isDark ? 'bg-[#141414]' : 'bg-white'}>User Specific</option>
                  <option value="organization" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Organization</option>
                  <option value="long_term" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Long Term</option>
                  <option value="archived" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Archived</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                  IMPORTANCE RATING
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newImportance}
                    onChange={(e) => setNewImportance(parseInt(e.target.value))}
                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold w-6 text-center">{newImportance}</span>
                </div>
                <span className="text-[8.5px] text-neutral-500 font-mono">
                  {newImportance >= 9 ? '>= 9 triggers Verification Queue' : 'Auto-persists instantly'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                ORIGIN SOURCE REFERENCE
              </label>
              <input
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder="e.g. system-console, direct-dev"
                className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                  isDark ? 'border-neutral-800 text-[#EDEDED]' : 'border-neutral-300 text-[#18181B]'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isDuplicate}
              className={`w-full py-1.5 mt-2 rounded border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'border-neutral-700 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300 disabled:opacity-40'
                  : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 disabled:opacity-40'
              }`}
            >
              COMMIT CELL
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Right panel: Memory Cells View */}
      <div
        className={`lg:col-span-7 p-6 border rounded-xl flex flex-col transition-all duration-300 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}
      >
        {/* Memory Header with Tab Selectors */}
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 mb-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              CORTEX OPERATING SYSTEM RUNTIME
            </h3>
          </div>

          {/* Search bar */}
          <div className="relative w-44">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 opacity-40">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search live memories..."
              className={`w-full pl-8 pr-2 py-1 text-xs rounded border bg-transparent focus:outline-none ${
                isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
              }`}
            />
          </div>
        </div>

        {/* View Mode Selection */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 border-b border-neutral-800/40 pb-3">
          <div className="flex gap-1 flex-wrap text-[10px] tracking-wider font-semibold uppercase mono-text">
            {['all', 'working', 'project', 'user', 'organization', 'long_term'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  activeTab === tab
                    ? isDark
                      ? 'bg-neutral-800 text-white border-neutral-700'
                      : 'bg-neutral-200 text-neutral-900 border-neutral-300'
                    : 'opacity-50 hover:opacity-100 border-transparent'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 border border-neutral-800 rounded p-0.5 overflow-x-auto">
            <button
              onClick={() => setDisplayMode('timeline')}
              className={`px-2 py-1 text-[9px] font-mono rounded shrink-0 ${displayMode === 'timeline' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}
            >
              TIMELINE
            </button>
            <button
              onClick={() => setDisplayMode('graph')}
              className={`px-2 py-1 text-[9px] font-mono rounded shrink-0 ${displayMode === 'graph' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}
            >
              GRAPH & INTERMEDIARIES
            </button>
            <button
              onClick={() => setDisplayMode('clusters')}
              className={`px-2 py-1 text-[9px] font-mono rounded shrink-0 ${displayMode === 'clusters' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}
            >
              CLUSTERS
            </button>
            <button
              onClick={() => setDisplayMode('eventbus')}
              className={`px-2 py-1 text-[9px] font-mono rounded shrink-0 ${displayMode === 'eventbus' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}
            >
              EVENT BUS
            </button>
            <button
              onClick={() => setDisplayMode('context')}
              className={`px-2 py-1 text-[9px] font-mono rounded shrink-0 ${displayMode === 'context' ? 'bg-neutral-800 text-white' : 'opacity-40'}`}
            >
              CONTEXT
            </button>
          </div>
        </div>

        {/* Render Modes */}
        <div className="flex-1 overflow-y-auto max-h-[520px] space-y-4 pr-1.5">
          {loading && <p className="text-xs font-mono opacity-50 text-center py-8">Synchronizing platform telemetry...</p>}

          {/* Context Tab */}
          {displayMode === 'context' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-blue-950/10 border border-blue-900/30 rounded text-blue-400 text-xs font-mono flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>The Universal Context Engine compiles documents, memories, missions, research sessions, and telemetry live from all platform workspaces.</span>
              </div>

              {/* Linking form */}
              <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded">
                <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">Build Custom Cross-Context Links</span>
                <form onSubmit={handleCreateContextLink} className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Source ID (e.g. mem_ops)"
                    value={newCtxSource}
                    onChange={(e) => setNewCtxSource(e.target.value)}
                    className="p-1.5 bg-[#141414] border border-neutral-800 rounded text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Target ID (e.g. proj_omega)"
                    value={newCtxTarget}
                    onChange={(e) => setNewCtxTarget(e.target.value)}
                    className="p-1.5 bg-[#141414] border border-neutral-800 rounded text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Relation Type (e.g. binding)"
                    value={newCtxRel}
                    onChange={(e) => setNewCtxRel(e.target.value)}
                    className="p-1.5 bg-[#141414] border border-neutral-800 rounded text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors text-[10px] uppercase tracking-wider"
                  >
                    Establish Link
                  </button>
                </form>
              </div>

              {/* Items listing */}
              <div className="space-y-2">
                <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">Aggregated Context Items</span>
                {contextItems.length === 0 ? (
                  <p className="opacity-40 italic text-center py-4">No aggregated items found.</p>
                ) : (
                  contextItems.map((item) => (
                    <div key={item.id} className="p-3 bg-neutral-900/30 border border-neutral-800/60 rounded flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold uppercase">{item.category}</span>
                          <span className="font-bold text-neutral-200">{item.title}</span>
                          <span className="text-[9px] opacity-40">ID: {item.id}</span>
                        </div>
                        <p className="text-[11px] opacity-70 leading-normal">{item.summary}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.map((tag: string, idx: number) => (
                              <span key={idx} className="text-[8px] px-1 py-0.2 rounded border border-neutral-800 text-neutral-500 font-bold">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-amber-400 block">Importance: {item.importance}/10</span>
                        <span className="text-[8px] opacity-30 block">{new Date(item.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Event Bus Tab */}
          {displayMode === 'eventbus' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Manual Publish Event Form */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded space-y-2">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">Manual Event Broadcaster</span>
                  <form onSubmit={handlePublishEvent} className="space-y-2 text-[10px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="opacity-50">TOPIC:</span>
                        <select
                          value={pubTopic}
                          onChange={(e) => setPubTopic(e.target.value)}
                          className="w-full mt-0.5 p-1 bg-[#141414] border border-neutral-800 rounded text-white"
                        >
                          <option value="system">system</option>
                          <option value="security">security</option>
                          <option value="documents">documents</option>
                          <option value="notifications">notifications</option>
                          <option value="workflow">workflow</option>
                        </select>
                      </div>
                      <div>
                        <span className="opacity-50">PRIORITY:</span>
                        <select
                          value={pubPriority}
                          onChange={(e) => setPubPriority(e.target.value as any)}
                          className="w-full mt-0.5 p-1 bg-[#141414] border border-neutral-800 rounded text-white"
                        >
                          <option value="low">low</option>
                          <option value="normal">normal</option>
                          <option value="high">high</option>
                          <option value="critical">critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="opacity-50">EVENT TYPE:</span>
                        <input
                          type="text"
                          required
                          value={pubType}
                          onChange={(e) => setPubType(e.target.value)}
                          className="w-full mt-0.5 p-1 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <span className="opacity-50">SOURCE:</span>
                        <input
                          type="text"
                          required
                          value={pubSource}
                          onChange={(e) => setPubSource(e.target.value)}
                          className="w-full mt-0.5 p-1 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <span className="opacity-50">PAYLOAD (JSON / STRING):</span>
                      <textarea
                        value={pubPayload}
                        rows={2}
                        onChange={(e) => setPubPayload(e.target.value)}
                        className="w-full mt-0.5 p-1 bg-[#141414] border border-neutral-800 rounded text-white font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-1.5 bg-neutral-800 text-white rounded font-bold hover:bg-neutral-700 transition-colors uppercase tracking-wider text-[9px]"
                    >
                      Broadside Event Block
                    </button>
                  </form>
                </div>

                {/* Event Trigger Configuration Form */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded space-y-2">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">Reactive Trigger Setup</span>
                  <form onSubmit={handleAddTrigger} className="space-y-2 text-[10px]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="opacity-50">SOURCE TOPIC:</span>
                        <input
                          type="text"
                          placeholder="e.g. security"
                          required
                          value={trgSource}
                          onChange={(e) => setTrgSource(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <span className="opacity-50">TARGET TOPIC:</span>
                        <input
                          type="text"
                          placeholder="e.g. notifications"
                          required
                          value={trgTarget}
                          onChange={(e) => setTrgTarget(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="opacity-50">MATCH FIELD (OPTIONAL):</span>
                        <input
                          type="text"
                          placeholder="e.g. priority"
                          value={trgField}
                          onChange={(e) => setTrgField(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                      <div>
                        <span className="opacity-50">MATCH VALUE (OPTIONAL):</span>
                        <input
                          type="text"
                          placeholder="e.g. critical"
                          value={trgValue}
                          onChange={(e) => setTrgValue(e.target.value)}
                          className="w-full mt-0.5 p-1.5 bg-[#141414] border border-neutral-800 rounded text-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full p-1.5 bg-[#1e293b] text-blue-300 rounded border border-blue-900/40 font-bold hover:bg-[#334155] transition-colors uppercase tracking-wider text-[9px]"
                    >
                      Establish Reactive Rule
                    </button>
                  </form>
                </div>
              </div>

              {/* Display Triggers */}
              <div className="p-3 bg-neutral-900/20 border border-neutral-800 rounded">
                <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block mb-2">Registered Rule Triggers</span>
                {triggers.length === 0 ? (
                  <p className="opacity-40 italic">No triggers active.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {triggers.map((trg) => (
                      <div key={trg.id} className="p-2 bg-neutral-900/60 border border-neutral-800/80 rounded flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-200">Rule: {trg.id}</span>
                          <span className="block text-[9px] opacity-60">If {trg.sourceTopic} published ➔ Emit {trg.targetTopic}</span>
                          {trg.conditionField && (
                            <span className="block text-[8px] text-amber-500 font-bold">Filter: {trg.conditionField} == {trg.conditionValue}</span>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTrigger(trg.id)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Deregister Trigger"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Logs Timeline */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">Broadcasting Event History stream</span>
                  <span className="text-[9px] text-emerald-400 animate-pulse flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400" /> Active Bus Listener online
                  </span>
                </div>
                {eventsHistory.length === 0 ? (
                  <p className="opacity-40 italic text-center py-4">No events processed yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto border border-neutral-800 rounded p-2 bg-neutral-950/40">
                    {eventsHistory.map((e) => (
                      <div key={e.id} className="text-[11px] p-2 bg-neutral-900/20 hover:bg-neutral-900/50 rounded flex flex-col md:flex-row md:items-center justify-between gap-1 select-none">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-bold px-1 py-0.2 rounded border ${
                            e.priority === 'critical' ? 'text-red-400 bg-red-950/20 border-red-900/40 font-bold animate-pulse' :
                            e.priority === 'high' ? 'text-orange-400 bg-orange-950/20 border-orange-900/40' :
                            e.priority === 'low' ? 'text-neutral-500 bg-neutral-950 border-transparent' : 'text-blue-400 bg-blue-950/20 border-blue-900/40'
                          }`}>{e.priority}</span>
                          <span className="text-neutral-500">[{e.topic}]</span>
                          <span className="font-bold text-neutral-200">{e.eventType}</span>
                          <span className="text-[9px] opacity-40">({e.source})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9.5px] text-neutral-400 truncate max-w-[200px]">{JSON.stringify(e.payload)}</span>
                          <span className="text-[8px] opacity-30">{new Date(e.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Semantic Clusters Tab */}
          {displayMode === 'clusters' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-purple-950/10 border border-purple-900/30 rounded text-purple-400 text-xs font-mono flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Memories are clustered automatically in semantic spaces using topic seeds and multi-dimensional keyword mapping.</span>
              </div>

              {clusters.length === 0 ? (
                <p className="opacity-40 italic text-center py-8">No semantic clusters mapped yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clusters.map((cluster, idx) => (
                    <div key={idx} className="p-4 bg-[#0C0C0C] border border-neutral-800 rounded flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-200 uppercase">{cluster.theme}</span>
                          <span className="text-[9px] font-bold text-purple-400">{cluster.nodes.length} Synapses</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cluster.keywords.map((kw: string, i: number) => (
                            <span key={i} className="text-[8px] px-1 py-0.2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">#{kw}</span>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-neutral-800/40 pt-2 space-y-1">
                        <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">Group Node IDs</span>
                        <div className="flex flex-wrap gap-1.5">
                          {cluster.nodes.map((nodeId: string) => (
                            <span
                              key={nodeId}
                              onClick={() => {
                                setDisplayMode('timeline');
                                setSearchTerm(nodeId);
                              }}
                              className="text-[9px] px-1 py-0.5 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded font-bold cursor-pointer hover:bg-neutral-800"
                            >
                              {nodeId}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Verification Queue Mode */}
          {(displayMode as string) === 'queue' && (
            <div className="space-y-3">
              <div className="p-3 bg-pink-950/10 border border-pink-900/30 rounded text-pink-400 text-xs font-mono flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Memories created with high Importance (9 or 10) are routed here first. Direct agent approval is required before memory consolidation.</span>
              </div>
              {verificationQueue.length === 0 ? (
                <p className="text-xs font-mono opacity-40 italic text-center py-8">Verification queue is clean. No items pending.</p>
              ) : (
                verificationQueue.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded border ${isDark ? 'bg-[#0E0E0E] border-white/5' : 'bg-neutral-50 border-black/5'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 mr-2">PENDING</span>
                        <span className="text-[10px] font-mono opacity-50 capitalize">{item.type} • Importance: {item.importance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleApprove(item.id, true)}
                          className="p-1 text-green-400 hover:bg-green-500/10 rounded transition-colors"
                          title="Approve Memory Cell"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(item.id, false)}
                          className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Deny / Delete Candidate"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-mono leading-relaxed">{item.content}</p>
                    <span className="text-[9px] font-mono opacity-30 mt-2 block">Source: {item.source} • {new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Graph relationships Mode */}
          {displayMode === 'graph' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded border border-neutral-800 bg-[#0C0C0C]/50">
                <div className="flex items-center gap-1.5 text-neutral-400 mb-2 font-bold uppercase tracking-wider">
                  <GitBranch className="w-4 h-4 text-purple-400" /> Live Semantic Graph Mesh
                </div>
                {memoryGraph.nodes.length === 0 ? (
                  <p className="text-xs opacity-40 italic">No memories configured in graph.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {memoryGraph.nodes.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleTraverseNode(n.id)}
                          className={`p-2 border rounded flex items-center gap-2 cursor-pointer transition-colors ${
                            travId === n.id ? 'border-purple-500 bg-purple-950/20' : 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800'
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                          <div className="flex flex-col">
                            <span className="font-bold text-[11px] max-w-[150px] truncate">{n.label}</span>
                            <span className="text-[9px] opacity-40">Group: {n.group} • Val: {n.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {memoryGraph.edges.length > 0 && (
                      <div className="border-t border-neutral-800/40 pt-2.5">
                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-2">Inferred Synaptic Edges</span>
                        <div className="max-h-40 overflow-y-auto space-y-1 text-[10px] text-neutral-400">
                          {memoryGraph.edges.map((e, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className="font-bold text-neutral-200">{e.source}</span>
                              <span className="opacity-40">──({e.value})──&gt;</span>
                              <span className="font-bold text-neutral-200">{e.target}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dynamic tools: Traversal & Pathfinding */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Traversal Result */}
                <div className="p-4 bg-neutral-900/30 border border-neutral-800 rounded flex flex-col justify-between min-h-[160px]">
                  <div>
                    <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">Synaptic Graph Traversal</span>
                    <span className="text-[9px] text-neutral-500 block mb-3">Select a memory node above to compute reachable synapses and relationships.</span>
                    {travResult ? (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-purple-400 block">Reachable Nodes from {travId}</span>
                        <div className="space-y-1">
                          {travResult.nodes.map((node: any) => (
                            <div key={node.id} className="text-[10px] bg-neutral-950/60 p-1 rounded border border-neutral-800/40 flex justify-between">
                              <span>{node.summary}</span>
                              <span className="opacity-40">{node.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="opacity-40 italic text-[11px] py-4">No node currently selected for depth-traversal.</p>
                    )}
                  </div>
                </div>

                {/* 2. Pathfinding tool */}
                <div className="p-4 bg-neutral-900/30 border border-neutral-800 rounded space-y-3">
                  <span className="font-bold text-[10px] text-neutral-400 uppercase tracking-wider block">Find Related Paths</span>
                  <form onSubmit={handleFindPath} className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Start Node ID"
                        required
                        value={pathStart}
                        onChange={(e) => setPathStart(e.target.value)}
                        className="p-1 bg-[#141414] border border-neutral-800 rounded text-xs text-white"
                      />
                      <input
                        type="text"
                        placeholder="End Node ID"
                        required
                        value={pathEnd}
                        onChange={(e) => setPathEnd(e.target.value)}
                        className="p-1 bg-[#141414] border border-neutral-800 rounded text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full p-1 bg-neutral-800 text-white rounded font-bold hover:bg-neutral-700 transition-colors text-[10px]"
                    >
                      Find Connection Path
                    </button>
                  </form>
                  {pathResult && (
                    <div className="p-2 bg-neutral-950/80 rounded border border-neutral-800 space-y-1 text-[10px]">
                      {pathResult.path.length === 0 ? (
                        <p className="opacity-40 italic text-center">No connection path found.</p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {pathResult.path.map((node: string, index: number) => (
                            <React.Fragment key={index}>
                              <span className="font-bold text-purple-400">{node}</span>
                              {index < pathResult.path.length - 1 && (
                                <span className="opacity-30">➔ [{pathResult.edges[index]}] ➔</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline View Mode */}
          {displayMode === 'timeline' && (
            filteredMemories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-44 text-neutral-500 text-xs gap-1 opacity-50">
                <Bookmark className="w-5 h-5" />
                <span>No active Cortex memories align with filters.</span>
              </div>
            ) : (
              filteredMemories.map((mem) => (
                <div
                  key={mem.id}
                  className={`p-4 rounded border transition-all duration-300 relative ${
                    isDark ? 'bg-[#0C0C0C] border-white/5 hover:border-neutral-800' : 'bg-neutral-50 border-black/5 hover:border-neutral-200'
                  }`}
                >
                  {/* Editing Interface */}
                  {editingId === mem.id ? (
                    <div className="space-y-3 font-mono">
                      <div className="text-[10px] font-bold text-neutral-400 mb-1">EDITING CELL {mem.id}</div>
                      <textarea
                        value={editContent}
                        rows={2}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-2 text-xs bg-[#141414] border border-neutral-800 rounded font-mono text-white focus:outline-none"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-500">TYPE:</span>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as HierarchicalMemoryType)}
                            className="p-1 bg-[#141414] border border-neutral-800 text-[10px] rounded text-white"
                          >
                            <option value="working">Working</option>
                            <option value="conversation">Conversation</option>
                            <option value="project">Project</option>
                            <option value="user">User</option>
                            <option value="organization">Organization</option>
                            <option value="long_term">Long Term</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-500">IMPORTANCE:</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={editImportance}
                            onChange={(e) => setEditImportance(parseInt(e.target.value) || 5)}
                            className="w-12 p-0.5 bg-[#141414] border border-neutral-800 text-[10px] rounded text-center text-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-1.5">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-[10px] border border-neutral-800 rounded hover:bg-neutral-900"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleUpdate(mem.id)}
                          className="px-3 py-1 text-[10px] bg-white text-black font-bold rounded hover:bg-neutral-200"
                        >
                          SAVE
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Action Bar */}
                      <div className="absolute top-3.5 right-4 flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePin(mem.id, mem.isPinned || false)}
                          className={`p-1 rounded transition-colors ${
                            mem.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                          title={mem.isPinned ? 'Unpin from dashboard' : 'Pin to workspace dashboard'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => startEdit(mem)}
                          className="p-1 text-neutral-500 hover:text-white rounded transition-colors"
                          title="Modify details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(mem.id)}
                          className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors"
                          title="Prune memory node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Info header */}
                      <div className="flex items-center gap-2.5 mb-2 select-none">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border leading-3 uppercase mono-text ${getMemoryTypeBadge(
                            mem.type
                          )}`}
                        >
                          {mem.type}
                        </span>
                        <div className="flex items-center gap-1 opacity-40 text-[9.5px] mono-text">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(mem.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-40 text-[9.5px] mono-text">
                          <span>• Source: <span className="font-bold">{mem.source}</span></span>
                        </div>
                        <div className="flex items-center gap-1 text-[9.5px] font-mono text-amber-400/80">
                          <span>• Importance: {mem.importance}/10</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-45 text-[9.5px] mono-text">
                          <span>• ID: <span className="font-bold select-all">{mem.id}</span></span>
                        </div>
                      </div>

                      {/* Content block */}
                      <p className={`text-xs leading-relaxed font-mono ${isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                        {mem.content}
                      </p>

                      {mem.summary && mem.summary !== mem.content && (
                        <div className="mt-2 text-[10px] text-neutral-500 italic font-mono leading-relaxed border-l-2 border-neutral-800 pl-2">
                          <span className="font-bold not-italic text-[9px] uppercase tracking-wider block opacity-70">Synthesized Summary</span>
                          {mem.summary}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
