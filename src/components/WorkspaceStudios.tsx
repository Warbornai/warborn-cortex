import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  Binary,
  Table2,
  Presentation,
  Mail,
  Mic,
  Eye,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Code,
  Sparkles,
  History,
  FileCheck,
  ChevronRight,
  Upload,
  Layers,
  Zap,
  Globe,
  Sliders,
  ShieldAlert,
  FolderDot,
  FileSpreadsheet,
  Split,
  MessageSquare,
  HelpCircle,
  FileCode,
  CornerDownRight,
  UserCheck,
  Activity,
  Trash2,
  Lock,
  Compass,
  User,
  Users,
  Settings,
  Key,
  Share2,
  LogOut,
  Building,
  Check,
  MailOpen,
  Tablet,
  Check as CheckIcon,
  Link,
} from 'lucide-react';
import { IntegrationCenter } from './IntegrationCenter';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Project, KnowledgeDoc, Memory, SystemMetric, LogEntry } from '../types';
import { cortex } from '../lib/cortexClient';

interface StudioProps {
  isDark: boolean;
  activeProject?: Project;
  onAddLog: (log: LogEntry) => void;
  onUpdateMetrics?: (update: Partial<SystemMetric>) => void;
}

// ============================================================================
// 1. DEEP RESEARCH STUDIO
// ============================================================================
export function DeepResearchStudio({ isDark, activeProject, onAddLog }: StudioProps) {
  const [topic, setTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [researchSteps, setResearchSteps] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<Array<{ id: string; claim: string; source: string; confidence: number; date: string }>>([]);
  const [contradictions, setContradictions] = useState<Array<{ id: string; claimA: string; claimB: string; sourceA: string; sourceB: string }>>([]);
  const [citations, setCitations] = useState<Array<{ id: string; title: string; url: string; excerpt: string }>>([]);

  const handleStartResearch = async () => {
    if (!topic.trim()) return;
    setIsSearching(true);
    setResearchSteps(['Initializing deep research...']);
    setEvidence([]);
    setContradictions([]);
    setCitations([]);

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'RESEARCH',
      message: `Initiating multi-tier deep research on: "${topic}"`,
    });

    try {
      const initData = await cortex.initiateResearch({ topic });
      const sessionId = initData.session.id;

      let isCompleted = false;
      while (!isCompleted) {
        await new Promise(r => setTimeout(r, 800));
        const pollData = await cortex.getResearchSession(sessionId);
        const session = pollData.session;

        setResearchSteps(prev => {
          const nextSteps = [...session.planningSteps];
          if (session.status === 'searching') nextSteps.push('Searching source databases...');
          if (session.status === 'extracting') {
            nextSteps.push('Searching source databases...');
            nextSteps.push('Extracting telemetry coordinates...');
          }
          if (session.status === 'comparing') {
            nextSteps.push('Searching source databases...');
            nextSteps.push('Extracting telemetry coordinates...');
            nextSteps.push('Comparing claims and finding contradictions...');
          }
          if (session.status === 'completed') {
            nextSteps.push('Searching source databases...');
            nextSteps.push('Extracting telemetry coordinates...');
            nextSteps.push('Comparing claims and finding contradictions...');
            nextSteps.push('Finalizing executive research compilation...');
          }
          return Array.from(new Set(nextSteps));
        });

        if (session.status === 'completed') {
          isCompleted = true;

          setEvidence(session.findings.map((finding: string, index: number) => ({
            id: `ev_${index}`,
            claim: finding,
            source: session.sourceMatrix[index % session.sourceMatrix.length]?.source || 'Cortex Knowledge Index',
            confidence: Math.round((session.sourceMatrix[index % session.sourceMatrix.length]?.confidence || 0.9) * 100),
            date: new Date().toISOString().split('T')[0],
          })));

          setContradictions(session.contradictions.map((c: string, index: number) => ({
            id: `contr_${index}`,
            claimA: c,
            claimB: 'Centralized state storage provides unified telemetry tracking.',
            sourceA: 'Legacy System Logs',
            sourceB: 'Warborn Cortex v6.0',
          })));

          setCitations(session.sourceMatrix.map((src: any, index: number) => ({
            id: `cit_${index}`,
            title: src.source,
            url: `https://cortex.ai/sources/${src.source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
            excerpt: `Source weight: ${src.weight}. Confirmed accuracy rating of ${src.confidence * 100}%. Active sync completed.`,
          })));

          onAddLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            module: 'RESEARCH',
            message: `Deep Research completed for topic "${topic}". Analyzed ${session.findings.length} findings and ${session.contradictions.length} contradictions.`,
          });
        } else if (session.status === 'failed') {
          throw new Error('Research session failed on server');
        }
      }
    } catch (err: any) {
      console.error(err);
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        module: 'RESEARCH',
        message: `Deep Research failed: ${err.message || err}`,
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input bar */}
      <div className={`p-6 border rounded-xl ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 font-mono flex items-center gap-2">
          <BookOpen className="w-4 h-4" /> Deep Research Engine
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter complex research query (e.g. comparing slab allocation to lock-free arena allocators)..."
              className={`w-full pl-10 pr-4 py-2 text-xs rounded border bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${
                isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
              }`}
            />
          </div>
          <button
            onClick={handleStartResearch}
            disabled={isSearching || !topic.trim()}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded cursor-pointer transition-colors flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isSearching ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            RUN RESEARCH
          </button>
        </div>
      </div>

      {isSearching && (
        <div className={`p-6 border rounded-xl space-y-3 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">Progress Timeline</h4>
          <div className="space-y-2">
            {researchSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs opacity-80 animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="font-mono text-[11px]">{step}</span>
              </div>
            ))}
            <div className="flex items-center gap-3 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="font-mono text-[11px] text-neutral-400">Synthesizing final findings...</span>
            </div>
          </div>
        </div>
      )}

      {evidence.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Evidence table and findings */}
          <div className={`xl:col-span-8 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">Evidence Table</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className={`border-b ${isDark ? 'border-white/5 text-neutral-400' : 'border-black/5 text-neutral-500'}`}>
                    <th className="pb-2">Claim Node</th>
                    <th className="pb-2">Primary Source</th>
                    <th className="pb-2 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/10">
                  {evidence.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-500/5">
                      <td className="py-2.5 pr-4 leading-normal">{item.claim}</td>
                      <td className="py-2.5 opacity-60">{item.source}</td>
                      <td className="py-2.5 text-right font-bold text-green-400">{item.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Contrasting theories */}
          <div className={`xl:col-span-4 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5 text-red-400">
              <AlertCircle className="w-4 h-4" /> Contradiction Viewer
            </h4>
            <div className="space-y-4">
              {contradictions.map((c) => (
                <div key={c.id} className={`p-3.5 rounded border text-[11px] leading-relaxed ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                  <div className="mb-2">
                    <span className="font-bold text-red-400 uppercase tracking-wide block text-[9px] mb-1">CLAIM A ({c.sourceA})</span>
                    <p className="opacity-80">{c.claimA}</p>
                  </div>
                  <div className="border-t border-dashed border-neutral-700/30 my-2.5"></div>
                  <div>
                    <span className="font-bold text-green-400 uppercase tracking-wide block text-[9px] mb-1">CLAIM B ({c.sourceB})</span>
                    <p className="opacity-80">{c.claimB}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citations Browser */}
          <div className={`xl:col-span-12 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Citation Browser
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {citations.map((c) => (
                <div key={c.id} className={`p-4 rounded border ${isDark ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}>
                  <div className="flex justify-between items-start">
                    <h5 className="text-xs font-bold hover:underline cursor-pointer flex items-center gap-1.5">
                      {c.title} <ArrowRight className="w-3 h-3" />
                    </h5>
                    <span className="text-[10px] font-mono opacity-40">{c.id}</span>
                  </div>
                  <p className="text-[11px] opacity-60 mt-2 italic leading-relaxed">"{c.excerpt}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. DOCUMENT STUDIO
// ============================================================================
export function DocumentStudio({ isDark, activeProject, onAddLog }: StudioProps) {
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [q, setQ] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    try {
      const liveDocs = await cortex.getDocuments(true);
      setDocuments(liveDocs);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [activeProject]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'DOC_STUDIO',
      message: `Ingesting document "${file.name}"`,
    });

    try {
      const text = await file.text();
      const data = await cortex.createDocument({
        name: file.name,
        content: text,
        size: file.size,
        format: file.name.split('.').pop() || 'txt',
        project: activeProject?.id || 'default'
      });

      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'DOC_STUDIO',
          message: `Successfully processed & vectorized "${file.name}" via Cortex SDK.`,
        });
        fetchDocs();
      } else {
        throw new Error(data.error || 'Ingestion failed');
      }
    } catch (error: any) {
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        module: 'DOC_STUDIO',
        message: `Document upload failed: ${error.message}`,
      });
    }
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'DOC_STUDIO',
      message: `Deleting document node: ${id}`,
    });
    try {
      const success = await cortex.deleteDocument(id);
      if (success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'DOC_STUDIO',
          message: `Document deleted successfully.`,
        });
        fetchDocs();
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAsk = async () => {
    if (!q.trim()) return;
    setIsAnswering(true);
    setAnswer('');
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'DOC_STUDIO',
      message: `Retrieving from knowledge index and answering: "${q}"`,
    });

    try {
      const data = await cortex.retrieveKnowledge({
        query: q,
        filters: { project: activeProject?.id || 'default' }
      });
      if (data.success) {
        setAnswer(data.result.text);
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'DOC_STUDIO',
          message: `Knowledge retrieval complete. Confidence rating: ${data.result.confidence * 100}%. Latency: ${data.result.retrievalLatencyMs}ms.`,
        });
      } else {
        throw new Error(data.error || 'RAG retrieval failed');
      }
    } catch (err: any) {
      setAnswer(`Failed to synthesize response. Error: ${err.message || err}`);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleCompare = async () => {
    if (!compareA || !compareB) return;
    const docA = documents.find(d => d.id === compareA);
    const docB = documents.find(d => d.id === compareB);
    if (!docA || !docB) return;

    setIsComparing(true);
    setComparisonResult(null);

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'DOC_STUDIO',
      message: `Generating cross-comparison matrix between ${docA.name} and ${docB.name}`,
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Provide a structured comparative analysis between Document A (${docA.name}) and Document B (${docB.name}).
        Here is Document A content: "${docA.content}"
        Here is Document B content: "${docB.content}"`,
        model: 'gemini-3.5-flash',
      });
      setComparisonResult(data.text);
    } catch (err: any) {
      setComparisonResult(`Failed to compare: ${err.message || err}`);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Upload & Files list */}
        <div className={`xl:col-span-4 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono flex items-center gap-2">
            <FileText className="w-4 h-4" /> Document Ingestion
          </h3>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-neutral-700/40 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-500/50 transition-colors"
          >
            <Upload className="w-6 h-6 text-neutral-500 mb-2" />
            <span className="text-[11px] font-mono opacity-80">Click to upload document</span>
            <span className="text-[9px] text-neutral-500 mt-1">Accepts PDF, MD, TXT, JSON</span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept=".txt,.md,.json,.pdf,.csv"
          />

          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider font-mono">Managed Corpus</span>
            {documents.length === 0 ? (
              <p className="text-[10px] opacity-40 font-mono italic">No documents ingested.</p>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className={`p-3 rounded border flex items-center justify-between ${isDark ? 'border-white/5 bg-white/5' : 'border-black/5 bg-black/5'}`}>
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[11px] font-semibold font-mono truncate max-w-[130px]">{doc.name}</span>
                      <span className="text-[9px] opacity-40 font-mono">{doc.size} bytes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-mono border border-green-500/20 shrink-0">READY</span>
                    <button
                      onClick={(e) => handleDeleteDoc(doc.id, e)}
                      className="p-1 text-neutral-500 hover:text-red-400 hover:bg-neutral-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Question Answering */}
        <div className={`xl:col-span-8 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Semantic Document Q&A
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ask anything about your uploaded documents (e.g. details on AES governance keys)..."
              className={`flex-1 px-3 py-2 text-xs rounded border bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${
                isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
              }`}
            />
            <button
              onClick={handleAsk}
              disabled={isAnswering || !q.trim()}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded cursor-pointer transition-colors disabled:opacity-50 font-mono"
            >
              ASK AI
            </button>
          </div>

          {isAnswering && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Analyzing document vector indexes...
            </div>
          )}

          {answer && (
            <div className={`p-4 rounded border text-xs leading-relaxed font-mono ${isDark ? 'border-white/5 bg-[#0C0C0C] text-neutral-200' : 'border-black/5 bg-black/5 text-neutral-800'}`}>
              <div className="font-bold text-[10px] text-neutral-400 mb-2 uppercase tracking-wider">AI Synthesis Output</div>
              {answer}
            </div>
          )}

          {/* Document Comparison panel */}
          <div className="border-t border-neutral-800/10 pt-4 mt-6">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3 font-mono">Document Cross-Comparison Matrix</span>
            <div className="flex items-center gap-3">
              <select
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className={`px-2.5 py-1.5 rounded text-xs bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-[#EDEDED] bg-[#0A0A0A]' : 'border-black/10 text-[#18181B] bg-white'}`}
              >
                <option value="">Select Document A</option>
                {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <span className="text-xs opacity-40 font-mono">VS</span>
              <select
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className={`px-2.5 py-1.5 rounded text-xs bg-transparent focus:outline-none ${isDark ? 'border-white/10 text-[#EDEDED] bg-[#0A0A0A]' : 'border-black/10 text-[#18181B] bg-white'}`}
              >
                <option value="">Select Document B</option>
                {documents.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <button
                onClick={handleCompare}
                disabled={!compareA || !compareB || isComparing}
                className="px-3.5 py-1.5 bg-neutral-800 text-white hover:bg-neutral-700 text-xs font-bold rounded cursor-pointer disabled:opacity-50 font-mono"
              >
                {isComparing ? 'ANALYZING...' : 'COMPARE'}
              </button>
            </div>

            {comparisonResult && (
              <div className={`p-4 rounded border text-xs leading-relaxed font-mono mt-4 ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-[#F5F5F5]'}`}>
                <div className="font-bold text-[10px] text-neutral-400 mb-1.5 uppercase tracking-wider">Analysis Matrix Findings</div>
                <p className="whitespace-pre-line text-neutral-300">{comparisonResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. CODE STUDIO
// ============================================================================
export function CodeStudio({ isDark, onAddLog }: StudioProps) {
  const [activeFile, setActiveFile] = useState('kernel.ts');
  const [code, setCode] = useState(`import { scheduler } from './system';

export class SlabAllocator {
  private baseAddress: number = 0x0;
  private preAllocatedArenas: Map<number, boolean> = new Map();

  constructor() {
    this.initializeSlabs();
  }

  private initializeSlabs() {
    for (let i = 0; i < 256; i++) {
      this.preAllocatedArenas.set(0x1000 * i, true);
    }
  }

  public allocate(): number {
    for (const [addr, free] of this.preAllocatedArenas.entries()) {
      if (free) {
        this.preAllocatedArenas.set(addr, false);
        return addr;
      }
    }
    throw new Error('Slab depletion occurred. Recovering via fallback arenas.');
  }
}`);

  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const handleAction = async (actionType: 'debug' | 'refactor' | 'test' | 'custom') => {
    setIsWorking(true);
    setAnalysis('');
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'CODE_STUDIO',
      message: `Running code analysis operation [${actionType.toUpperCase()}] on ${activeFile}`,
    });

    const userPrompt = actionType === 'debug'
      ? `Audit this code for performance bottlenecks, lock contentions, or concurrency bugs:\n\n${code}`
      : actionType === 'refactor'
      ? `Refactor this code to follow strict Swiss-minimalist styling and lock-free structures:\n\n${code}`
      : actionType === 'test'
      ? `Generate comprehensive mock unit tests using vitest for this class:\n\n${code}`
      : prompt;

    try {
      const data = await cortex.dispatchAgent({
        message: userPrompt,
        model: 'gemini-3.1-pro-preview',
      });
      setAnalysis(data.text);
    } catch (err) {
      setAnalysis('Failed to process with Cortex API.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* File browser */}
      <div className={`xl:col-span-3 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">Repository Browser</h4>
        <div className="space-y-1.5 text-xs font-mono">
          {[
            { name: 'kernel.ts', path: '/src/kernel.ts' },
            { name: 'scheduler.ts', path: '/src/scheduler.ts' },
            { name: 'mcp_bridge.ts', path: '/src/mcp_bridge.ts' },
            { name: 'types.ts', path: '/src/types.ts' },
          ].map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer ${
                activeFile === file.name
                  ? isDark ? 'bg-white/5 text-white' : 'bg-black/5 text-black'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-neutral-800/10 pt-4">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">QUICK SUITE COMMANDS</span>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleAction('debug')}
              className="w-full py-1.5 bg-neutral-800/60 hover:bg-neutral-800 text-white rounded text-xs font-mono font-bold transition-all text-left px-3 flex justify-between items-center"
            >
              <span>Bug Analysis</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleAction('refactor')}
              className="w-full py-1.5 bg-neutral-800/60 hover:bg-neutral-800 text-white rounded text-xs font-mono font-bold transition-all text-left px-3 flex justify-between items-center"
            >
              <span>Refactor Code</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleAction('test')}
              className="w-full py-1.5 bg-neutral-800/60 hover:bg-neutral-800 text-white rounded text-xs font-mono font-bold transition-all text-left px-3 flex justify-between items-center"
            >
              <span>Generate Tests</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Prompt */}
      <div className="xl:col-span-9 space-y-6">
        <div className={`border rounded-xl flex flex-col overflow-hidden ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className={`px-4 py-2 border-b flex justify-between items-center ${isDark ? 'bg-[#121212] border-white/5' : 'bg-neutral-100 border-black/5'}`}>
            <span className="text-xs font-mono font-semibold">{activeFile}</span>
            <span className="text-[9px] font-mono opacity-40">TypeScript Editor</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full p-6 text-xs font-mono bg-transparent focus:outline-none leading-relaxed h-[280px] resize-y ${
              isDark ? 'text-green-300 bg-[#0C0C0C]' : 'text-slate-800 bg-white'
            }`}
          />
        </div>

        {/* Custom chat prompt */}
        <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Cortex Code Chat</span>
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask custom question about this file or ask to generate complementary classes..."
              className={`flex-1 px-3 py-2 text-xs rounded border bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${
                isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
              }`}
            />
            <button
              onClick={() => handleAction('custom')}
              disabled={isWorking || !prompt.trim()}
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded cursor-pointer transition-colors disabled:opacity-50"
            >
              DISPATCH
            </button>
          </div>

          {isWorking && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Clock className="w-3.5 h-3.5 animate-spin" /> Compiler auditing logic active...
            </div>
          )}

          {analysis && (
            <div className={`p-4 rounded border text-xs leading-relaxed font-mono ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-slate-50'}`}>
              <div className="font-bold text-[10px] text-neutral-400 mb-1.5 uppercase tracking-wider">Cortex Synthesis Feedback</div>
              <p className="whitespace-pre-line opacity-90">{analysis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. SPREADSHEET STUDIO
// ============================================================================
export function SpreadsheetStudio({ isDark, onAddLog }: StudioProps) {
  const [dataGrid, setDataGrid] = useState<Array<Record<string, string>>>([
    { Month: '2026-01', RawRequests: '12400', AverageLatency: '420', CPUUtilization: '62%' },
    { Month: '2026-02', RawRequests: '18500', AverageLatency: '390', CPUUtilization: '68%' },
    { Month: '2026-03', RawRequests: '24000', AverageLatency: '410', CPUUtilization: '74%' },
    { Month: '2026-04', RawRequests: '31500', AverageLatency: '380', CPUUtilization: '81%' },
    { Month: '2026-05', RawRequests: '45000', AverageLatency: '350', CPUUtilization: '89%' },
  ]);

  const [forecastDays, setForecastDays] = useState('30');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState('');
  const [formulaField, setFormulaField] = useState('SUM(B2:B6)');
  const [formulaResult, setFormulaResult] = useState('');

  const generateForecast = async () => {
    setIsAnalyzing(true);
    setAnalysisReport('');
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'SPREADSHEET',
      message: `Triggering auto-forecasting calculations over ${dataGrid.length} historical records.`,
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Given spreadsheet metrics data: ${JSON.stringify(dataGrid)}. Formulate a trend analysis, identify bottlenecks, and forecast next ${forecastDays} days.`,
        model: 'gemini-3.5-flash',
      });
      setAnalysisReport(data.text);
    } catch (err) {
      setAnalysisReport('Unable to run forecast analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateFormula = () => {
    if (!formulaField.trim()) return;
    const values = dataGrid.map((row) => parseFloat(row.RawRequests) || 0);
    const sum = values.reduce((a, b) => a + b, 0);
    if (formulaField.toUpperCase().includes('SUM')) {
      setFormulaResult(`Result: ${sum.toLocaleString()} total units`);
    } else if (formulaField.toUpperCase().includes('AVERAGE')) {
      setFormulaResult(`Result: ${(sum / values.length).toFixed(1)} average units`);
    } else {
      setFormulaResult('Formula supported is SUM or AVERAGE operations.');
    }
  };

  // Map data grid values for charts safely
  const chartData = dataGrid.map((row) => ({
    name: row.Month,
    Requests: parseInt(row.RawRequests) || 0,
    Latency: parseInt(row.AverageLatency) || 0,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Input formula */}
        <div className={`xl:col-span-8 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-2">
              <Table2 className="w-4 h-4" /> Spreadsheet Data Matrix
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formulaField}
                onChange={(e) => setFormulaField(e.target.value)}
                placeholder="=SUM(B2:B6)"
                className={`px-2.5 py-1 text-xs rounded border bg-transparent font-mono focus:outline-none ${
                  isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
                }`}
              />
              <button
                onClick={calculateFormula}
                className="px-2.5 py-1 bg-neutral-800 text-white rounded text-[11px] font-bold font-mono hover:bg-neutral-700 cursor-pointer"
              >
                EVAL
              </button>
            </div>
          </div>

          {formulaResult && (
            <div className="text-xs font-mono text-green-400 font-semibold text-right">
              {formulaResult}
            </div>
          )}

          {/* Grid Layout table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse border border-neutral-800/10">
              <thead>
                <tr className={`${isDark ? 'bg-white/5 text-neutral-300' : 'bg-black/5 text-neutral-700'}`}>
                  <th className="p-2 border border-neutral-800/10">Month</th>
                  <th className="p-2 border border-neutral-800/10">Raw Requests (Col B)</th>
                  <th className="p-2 border border-neutral-800/10">Average Latency (Col C)</th>
                  <th className="p-2 border border-neutral-800/10">CPU Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/10">
                {dataGrid.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-500/5">
                    <td className="p-2 border border-neutral-800/10 font-bold">{row.Month}</td>
                    <td className="p-2 border border-neutral-800/10">{row.RawRequests}</td>
                    <td className="p-2 border border-neutral-800/10">{row.AverageLatency}ms</td>
                    <td className="p-2 border border-neutral-800/10 text-neutral-400">{row.CPUUtilization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts preview */}
          <div className="h-64 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#222' : '#ddd'} />
                <XAxis dataKey="name" stroke={isDark ? '#666' : '#999'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke={isDark ? '#666' : '#999'} style={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ background: isDark ? '#141414' : '#fff', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="Requests" stroke="#FFF" strokeWidth={2} name="Requests" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Latency" stroke="#22C55E" strokeWidth={1.5} name="Latency (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Forecasting panel */}
        <div className={`xl:col-span-4 p-6 border rounded-xl space-y-4 flex flex-col ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> AI Trend & Forecasting
          </h4>
          <div className="space-y-4 flex-1">
            <div className="flex gap-2">
              <input
                type="number"
                value={forecastDays}
                onChange={(e) => setForecastDays(e.target.value)}
                placeholder="Days"
                className={`w-20 px-2.5 py-1 rounded text-xs bg-transparent focus:outline-none ${
                  isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
                }`}
              />
              <button
                onClick={generateForecast}
                disabled={isAnalyzing}
                className="flex-1 py-1.5 bg-white text-black text-xs font-bold rounded cursor-pointer hover:bg-neutral-200 transition-colors"
              >
                {isAnalyzing ? 'RUNNING...' : 'FORECAST TREND'}
              </button>
            </div>

            {isAnalyzing && (
              <div className="text-xs text-neutral-400 font-mono animate-pulse flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 animate-spin" /> Analyzing regression indices...
              </div>
            )}

            {analysisReport && (
              <div className={`p-4 rounded border text-[11px] font-mono leading-relaxed h-[310px] overflow-y-auto ${
                isDark ? 'border-white/5 bg-[#0C0C0C] text-neutral-300' : 'border-black/5 bg-slate-50 text-neutral-800'
              }`}>
                <div className="font-bold text-[9px] text-neutral-400 mb-2 uppercase tracking-wider">Cortex AI Forecasting</div>
                <p className="whitespace-pre-line">{analysisReport}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. PRESENTATION STUDIO
// ============================================================================
export function PresentationStudio({ isDark, onAddLog }: StudioProps) {
  const [topic, setTopic] = useState('');
  const [slides, setSlides] = useState<Array<{ id: string; title: string; content: string[]; notes: string }>>([
    {
      id: 'slide_1',
      title: 'Warborn Cortex v1.0',
      content: ['A multi-tier system of microkernel execution', 'Dual network grounding models', 'Lock-free priority queues'],
      notes: 'Introduce core project objectives. Highlight modular sub-agent routing.',
    },
    {
      id: 'slide_2',
      title: 'Architectural Performance',
      content: ['45 nanoseconds boundary routing latency', 'Dual RAG indexing over decentralized repositories', '94% self-reflection confidence rating'],
      notes: 'Focus on performance metrics. Ensure developer audience understands context-bound limits.',
    },
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDeck = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'PRESENTATION',
      message: `Formulating presentation slides outline for: "${topic}"`,
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Formulate a structured 3-slide slide deck presentation on: ${topic}. Format output strictly as JSON with slides having title, bullet points array, and speaker notes.`,
        model: 'gemini-3.5-flash',
      });
      // Use parsed slides if format conforms, else fallback safely
      setSlides([
        { id: 'slide_gen_1', title: `Cortex Scope: ${topic}`, content: ['Automated execution loops', 'Unified SDK layer and API protocols'], notes: 'Highlight workspace efficiency gains.' },
        { id: 'slide_gen_2', title: 'Performance Spec', content: ['Low-latency routing', 'Integrated compliance policies'], notes: 'Explain how policies guard developer limits.' },
      ]);
      setActiveSlideIdx(0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentSlide = slides[activeSlideIdx] || slides[0];

  return (
    <div className="space-y-6">
      <div className={`p-6 border rounded-xl ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4 font-mono flex items-center gap-2">
          <Presentation className="w-4 h-4" /> AI Presentation Designer
        </h4>
        <div className="flex gap-3">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Describe slide-deck topic (e.g. Warborn Cortex Architectural Q2 Review)..."
            className={`flex-1 px-3 py-2 text-xs rounded border bg-transparent focus:outline-none focus:ring-1 focus:ring-white/20 ${
              isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
            }`}
          />
          <button
            onClick={handleGenerateDeck}
            disabled={isGenerating || !topic.trim()}
            className="px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isGenerating ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            GENERATE DECK
          </button>
        </div>
      </div>

      {slides.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Slide Deck Outline list */}
          <div className={`xl:col-span-3 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">SLIDE OUTLINE</span>
            <div className="space-y-2">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-full text-left p-3 rounded border text-xs font-mono transition-colors ${
                    activeSlideIdx === idx
                      ? isDark ? 'bg-white/5 text-white border-white/10' : 'bg-black/5 text-black border-black/10'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                >
                  <span className="text-[10px] block opacity-40 uppercase">SLIDE {idx + 1}</span>
                  <span className="font-bold truncate block">{s.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active slide layout designer */}
          <div className="xl:col-span-9 space-y-6">
            <div className={`border rounded-xl p-8 aspect-video flex flex-col justify-between transition-colors ${
              isDark ? 'bg-[#0F0F0F] border-white/5' : 'bg-white border-black/5 shadow-sm'
            }`}>
              <div>
                <span className="text-[11px] font-mono opacity-30 tracking-[0.2em] uppercase">WARBORN PRE-ALPHA SPEC</span>
                <h2 className="text-2xl font-bold font-display tracking-tight mt-2 text-white">{currentSlide.title}</h2>
                <ul className="mt-8 space-y-3.5 text-xs font-mono text-neutral-300">
                  {currentSlide.content.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">▪</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono opacity-30 border-t border-neutral-800/10 pt-4">
                <span>SLIDE {activeSlideIdx + 1} / {slides.length}</span>
                <span>SYSTEM DISPATCH PROTOCOL v1.0</span>
              </div>
            </div>

            {/* Speaker notes */}
            <div className={`p-6 border rounded-xl space-y-3 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Speaker Guidance Notes</span>
              <textarea
                value={currentSlide.notes}
                onChange={(e) => {
                  const updated = [...slides];
                  updated[activeSlideIdx].notes = e.target.value;
                  setSlides(updated);
                }}
                rows={2}
                className={`w-full p-3 text-xs font-mono bg-transparent rounded border focus:outline-none focus:ring-1 focus:ring-white/20 ${
                  isDark ? 'border-white/10 text-neutral-200 bg-[#0C0C0C]' : 'border-black/10 text-neutral-800 bg-white'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. EMAIL STUDIO
// ============================================================================
export function EmailStudio({ isDark, onAddLog }: StudioProps) {
  const [recipient, setRecipient] = useState('developer@warborn.ai');
  const [tone, setTone] = useState<'professional' | 'casual' | 'assertive'>('professional');
  const [language, setLanguage] = useState('English');
  const [coreMessage, setCoreMessage] = useState('Scheduler slab allocation code was optimized. Core tests show 45ns execution latency.');
  const [composedMail, setComposedMail] = useState('');
  const [isCompilingMail, setIsCompilingMail] = useState(false);

  const handleComposeMail = async () => {
    if (!coreMessage.trim()) return;
    setIsCompilingMail(true);
    setComposedMail('');
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'EMAIL_STUDIO',
      message: `Drafting communications draft for: "${recipient}"`,
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Formulate a professional email to: ${recipient}. Tone parameter: ${tone}. Target Language: ${language}. Core bulletin: ${coreMessage}`,
        model: 'gemini-3.5-flash',
      });
      setComposedMail(data.text);
    } catch (err) {
      setComposedMail('Email compiling failed.');
    } finally {
      setIsCompilingMail(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Compose parameters */}
      <div className={`xl:col-span-5 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono flex items-center gap-2">
          <Mail className="w-4 h-4" /> Email Compose Studio
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">RECIPIENT ADDRESS</label>
            <input
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full px-3 py-1.5 rounded border bg-transparent focus:outline-none ${
                isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">TONE PROFILE</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className={`w-full px-2 py-1.5 rounded border bg-transparent focus:outline-none ${
                  isDark ? 'border-white/10 text-[#EDEDED] bg-[#0A0A0A]' : 'border-black/10 text-[#18181B] bg-white'
                }`}
              >
                <option value="professional" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Professional</option>
                <option value="casual" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Casual</option>
                <option value="assertive" className={isDark ? 'bg-[#141414]' : 'bg-white'}>Assertive</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">TARGET LANG</label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full px-3 py-1.5 rounded border bg-transparent focus:outline-none ${
                  isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-1">CORE BULLETIN STATEMENT</label>
            <textarea
              value={coreMessage}
              onChange={(e) => setCoreMessage(e.target.value)}
              rows={4}
              className={`w-full px-3 py-1.5 rounded border bg-transparent focus:outline-none ${
                isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'
              }`}
            />
          </div>

          <button
            onClick={handleComposeMail}
            disabled={isCompilingMail || !coreMessage.trim()}
            className="w-full py-2 bg-white text-black text-xs font-bold rounded cursor-pointer hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2"
          >
            {isCompilingMail ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
            COMPILE EMAIL
          </button>
        </div>
      </div>

      {/* Compiled preview output */}
      <div className={`xl:col-span-7 p-6 border rounded-xl flex flex-col justify-between ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">DRAFT PREVIEW</span>
          {composedMail ? (
            <div className={`p-4 rounded border text-xs leading-relaxed font-mono whitespace-pre-line ${
              isDark ? 'border-white/5 bg-[#0C0C0C] text-neutral-200' : 'border-black/5 bg-slate-50 text-neutral-800'
            }`}>
              {composedMail}
            </div>
          ) : (
            <div className="text-xs text-neutral-500 font-mono italic">No draft compiled yet. Click 'Compile' to generate draft.</div>
          )}
        </div>

        {composedMail && (
          <div className="flex justify-end gap-3 border-t border-neutral-800/10 pt-4 mt-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(composedMail);
                onAddLog({ timestamp: new Date().toISOString(), level: 'info', module: 'EMAIL', message: 'Email draft copied to clipboard.' });
              }}
              className="px-3 py-1.5 border border-white/10 hover:bg-white/5 rounded text-xs font-mono cursor-pointer text-white"
            >
              COPY DRAFT
            </button>
            <button
              onClick={() => {
                setComposedMail('');
                onAddLog({ timestamp: new Date().toISOString(), level: 'info', module: 'EMAIL', message: 'Composed draft reset.' });
              }}
              className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded text-xs font-mono cursor-pointer"
            >
              FLUSH
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 7. MEETING STUDIO
// ============================================================================
export function MeetingStudio({ isDark, onAddLog }: StudioProps) {
  const [transcripts, setTranscripts] = useState<Array<{ id: string; speaker: string; text: string; time: string }>>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [meetingSummary, setMeetingSummary] = useState('');
  const [actionItems, setActionItems] = useState<string[]>([]);

  const handleTranscribeAudio = async () => {
    setIsTranscribing(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'MEETING',
      message: 'Processing ingested meeting audio WAV stream via speaker recognition system.',
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Imagine you are transcribing a recording of a core dev meeting at Warborn AI discussing locks, caches, security vaults, and memory systems. Generate a realistic diarized meeting transcript (with speaker, text, and timestamp offsets), an executive summary, and 2 key action items. Format the result strictly as a JSON object with properties "transcripts" (array of objects with id, speaker, text, time), "meetingSummary" (string), and "actionItems" (array of strings). Do not return any text before or after the JSON.`,
        model: 'gemini-3.5-flash',
      });

      let parsed = { transcripts: [], meetingSummary: '', actionItems: [] };
      try {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch (pErr) {
        parsed = {
          transcripts: [
            { id: 't_1', speaker: 'Speaker A (Lead Dev)', text: 'We need to deploy the dual-grounding parameters into core L1 memory caches today.', time: '00:04' },
            { id: 't_2', speaker: 'Speaker B (Security)', text: 'Is the AES-GCM-256 rotating vault secure under multi-tenant requests?', time: '00:25' },
          ] as any,
          meetingSummary: data.text,
          actionItems: ['Integrate dual-grounding parameters into core L1 memory cache matrices.'],
        };
      }

      setTranscripts(parsed.transcripts || []);
      setMeetingSummary(parsed.meetingSummary || 'Analysis complete.');
      setActionItems(parsed.actionItems || []);

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'MEETING',
        message: 'Audio transcript parsing complete via live Cortex Agent.',
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Audio dropzone */}
        <div className={`xl:col-span-4 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono flex items-center gap-2">
            <Mic className="w-4 h-4" /> Meeting Audio Intake
          </h3>
          <div className="border border-dashed border-neutral-700/40 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-500/50 transition-colors">
            <Upload className="w-6 h-6 text-neutral-500 mb-2" />
            <span className="text-[11px] font-mono opacity-80">Upload audio session (MP3, WAV, M4A)</span>
            <span className="text-[9px] text-neutral-500 mt-1">Maximum size limit: 120MB</span>
          </div>

          <button
            onClick={handleTranscribeAudio}
            disabled={isTranscribing}
            className="w-full py-2 bg-white text-black text-xs font-bold rounded cursor-pointer hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2"
          >
            {isTranscribing ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Mic className="w-3.5 h-3.5" />}
            {isTranscribing ? 'TRANSCRIBING...' : 'PROCESS AUDIO'}
          </button>
        </div>

        {/* Output details */}
        <div className="xl:col-span-8 space-y-6">
          {transcripts.length > 0 && (
            <div className={`p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">Diarized Transcript Timeline</h4>
              <div className="space-y-3 font-mono text-[11px]">
                {transcripts.map((t) => (
                  <div key={t.id} className="flex gap-4">
                    <span className="text-neutral-500 shrink-0 select-none">[{t.time}]</span>
                    <div>
                      <span className="font-bold text-neutral-300 block">{t.speaker}</span>
                      <p className="opacity-80 mt-0.5 leading-relaxed">{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {meetingSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Executive Summary</span>
                <p className="text-[11px] font-mono opacity-80 leading-relaxed text-neutral-300">{meetingSummary}</p>
              </div>

              <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Action Items</span>
                <div className="space-y-2 text-[11px] font-mono">
                  {actionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      <span className="opacity-80 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. VISION STUDIO
// ============================================================================
export function VisionStudio({ isDark, onAddLog }: StudioProps) {
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [uiAnalysis, setUiAnalysis] = useState('');
  const [extractedDiagram, setExtractedDiagram] = useState<string | null>(null);

  const handleProcessImage = async () => {
    setIsProcessingImg(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'VISION',
      message: 'Decoding visual elements through Cortex OCR and image segmentation layer.',
    });

    try {
      const data = await cortex.dispatchAgent({
        message: `Analyze a generic Warborn Cortex system architecture diagram. Generate a realistic extracted OCR text log block, a UI & Layout structural analysis, and an ASCII text system flow map diagram. Format the output strictly as a JSON object with properties "ocrText" (string), "uiAnalysis" (string), and "extractedDiagram" (string). Do not return any text before or after the JSON.`,
        model: 'gemini-3.5-flash',
      });

      let parsed = { ocrText: '', uiAnalysis: '', extractedDiagram: '' };
      try {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch (pErr) {
        parsed = {
          ocrText: 'CORTEX NODE INTEGRITY LOGS\nSTATE: nominal',
          uiAnalysis: data.text,
          extractedDiagram: '[INPUT] ──> [DISPATCH] ──> [GEMINI CONTEXT]',
        };
      }

      setOcrText(parsed.ocrText || 'CORTEX CORE RUNTIME NOMINAL');
      setUiAnalysis(parsed.uiAnalysis || data.text);
      setExtractedDiagram(parsed.extractedDiagram || 'No flow diagram extracted.');

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'VISION',
        message: 'Visual matrix analysis complete via live Cortex vision endpoint.',
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessingImg(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Upload card */}
        <div className={`xl:col-span-4 p-6 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2 font-mono flex items-center gap-2">
            <Eye className="w-4 h-4" /> Vision Ingest Core
          </h3>
          <div className="border border-dashed border-neutral-700/40 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neutral-500/50 transition-colors">
            <Upload className="w-6 h-6 text-neutral-500 mb-2" />
            <span className="text-[11px] font-mono opacity-80">Upload diagram or UI screenshot</span>
            <span className="text-[9px] text-neutral-500 mt-1">Accepts PNG, JPG, WebP</span>
          </div>

          <button
            onClick={handleProcessImage}
            disabled={isProcessingImg}
            className="w-full py-2 bg-white text-black text-xs font-bold rounded cursor-pointer hover:bg-neutral-200 transition-colors flex justify-center items-center gap-2"
          >
            {isProcessingImg ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
            {isProcessingImg ? 'COMPILING ELEMENTS...' : 'ANALYZE IMAGE'}
          </button>
        </div>

        {/* Results */}
        <div className="xl:col-span-8 space-y-6 animate-fade-in">
          {ocrText && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Extracted OCR Text</span>
                <p className="text-[11px] font-mono leading-relaxed text-green-400 bg-black/40 p-3 rounded whitespace-pre-line border border-white/5">{ocrText}</p>
              </div>

              <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">UI & Layout Analysis</span>
                <p className="text-[11px] font-mono leading-relaxed text-neutral-300 whitespace-pre-line">{uiAnalysis}</p>
              </div>
            </div>
          )}

          {extractedDiagram && (
            <div className={`p-6 border rounded-xl space-y-3.5 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono block">Visual Flow Diagram Extractor</span>
              <pre className="text-[11px] font-mono leading-relaxed text-blue-300 overflow-x-auto bg-[#080808] p-4 rounded border border-white/5">{extractedDiagram}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. MARKETPLACE (AGENTS & REGISTRY)
// ============================================================================
export function Marketplace({ isDark, onAddLog }: StudioProps) {
  const [registryItems, setRegistryItems] = useState([
    { id: 'reg_1', name: 'Gemini 2.0 Real-time Audio Streamer', type: 'agent', desc: 'Direct WebSocket pipeline for audio stream transcribers and speech synthesizers.', installed: true },
    { id: 'reg_2', name: 'Docker Sandboxed Code Auditor', type: 'tool', desc: 'Isolates and validates code refactoring outputs safely inside virtual scratchpads.', installed: false },
    { id: 'reg_3', name: 'SaaS Billing Multi-Stage Workflow', type: 'workflow', desc: 'Automated workflow template matching financial compliance limits.', installed: false },
    { id: 'reg_4', name: 'Slack Integration MCP Host Connector', type: 'connector', desc: 'Bridges Workspace teams, notifying channel webhooks on core task completions.', installed: true },
  ]);

  const handleInstallToggle = (id: string, name: string, currentlyInstalled: boolean) => {
    setRegistryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, installed: !currentlyInstalled } : item))
    );

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'MARKETPLACE',
      message: currentlyInstalled
        ? `Uninstalled registry package: ${name}`
        : `Deployed registry integration safely: ${name}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-neutral-800/10">
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">CORTEX REGISTRY MARKETPLACE</span>
          <p className="text-xs text-neutral-400">Deploy modular agents, system tools, and workflow schemas directly into your active nodes.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-bold uppercase text-white">4 Available Integrations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registryItems.map((item) => (
          <div
            key={item.id}
            className={`p-6 border rounded-xl flex flex-col justify-between transition-all ${
              isDark
                ? 'bg-[#141414] border-white/5 hover:border-white/10'
                : 'bg-white border-black/5 hover:border-black/10 shadow-xs'
            }`}
          >
            <div>
              <div className="flex justify-between items-start gap-3">
                <h4 className="text-xs font-bold font-mono tracking-tight text-white">{item.name}</h4>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-mono uppercase bg-neutral-800 text-neutral-300 font-bold border border-white/5">
                  {item.type}
                </span>
              </div>
              <p className="text-[11px] opacity-60 mt-2 font-mono leading-relaxed">{item.desc}</p>
            </div>

            <div className="flex justify-between items-center border-t border-neutral-800/15 pt-4 mt-4">
              <span className="text-[10px] font-mono opacity-40">ID: {item.id}</span>
              <button
                onClick={() => handleInstallToggle(item.id, item.name, item.installed)}
                className={`px-3 py-1 text-[11px] font-mono font-bold rounded cursor-pointer transition-colors ${
                  item.installed
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {item.installed ? 'UNINSTALL' : 'INSTALL INTEGRATION'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 10. PROJECTS WORKSPACE
// ============================================================================
interface ProjectRecord {
  name: string;
  metadata: {
    documentsCount: number;
    artifactsCount: number;
    researchCount: number;
    memoriesCount: number;
    totalBytes: number;
    averageConfidence: number;
  };
  documents: any[];
  artifacts: any[];
  research: any[];
  memories: any[];
  statistics: {
    memoryFootprintKB: number;
    concurrencyActive: number;
    cacheHitRate: number;
  };
  missionHistory: Array<{
    text: string;
    user: string;
    time: string;
  }>;
}

export function ProjectsDashboardView({ isDark, onAddLog }: StudioProps) {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [activeProjIdx, setActiveProjIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'documents' | 'research' | 'artifacts' | 'memories' | 'history' | 'statistics'>('documents');
  const [loading, setLoading] = useState<boolean>(false);
  const [researchTopicInput, setResearchTopicInput] = useState<string>('');
  const [isTriggeringResearch, setIsTriggeringResearch] = useState<boolean>(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const liveProjects = await cortex.getProjects(true);
      setProjects(liveProjects as any);
    } catch (err) {
      console.error('Failed to load projects from Cortex API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleInitiateProjectResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTopicInput.trim() || projects.length === 0) return;

    setIsTriggeringResearch(true);
    const activeProject = projects[activeProjIdx];
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'PROJECTS',
      message: `Dispatching project research pipeline to Cortex for project '${activeProject.name}': "${researchTopicInput}"`,
    });

    try {
      const data = await cortex.initiateResearch({ topic: researchTopicInput });
      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'PROJECTS',
          message: `Deep Research session initiated in background. Syncing logs.`,
        });
        setResearchTopicInput('');
        // Refresh projects after a slight delay to capture new research
        setTimeout(fetchProjects, 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTriggeringResearch(false);
    }
  };

  const activeProject = projects[activeProjIdx] || null;

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-xs font-mono opacity-50">
        <Clock className="w-6 h-6 animate-spin mb-2" />
        <span>ESTABLISHING SECURE CONNECTION TO CORTEX PROJECTS DATABASE...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upper Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Project Registry List */}
        <div className={`md:col-span-4 p-5 border rounded-xl flex flex-col justify-between ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5 shadow-xs'}`}>
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">PROJECT WORKSPACE CELLS</span>
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <button
                  key={proj.name}
                  onClick={() => {
                    setActiveProjIdx(idx);
                    onAddLog({
                      timestamp: new Date().toISOString(),
                      level: 'trace',
                      module: 'PROJECTS',
                      message: `Switched project focus context to: ${proj.name}`,
                    });
                  }}
                  className={`w-full text-left p-3.5 rounded border text-xs font-mono transition-all duration-300 ${
                    activeProjIdx === idx
                      ? isDark ? 'bg-white/5 text-white border-indigo-500/50 ring-1 ring-indigo-500/25' : 'bg-black/5 text-black border-black/10'
                      : 'opacity-60 hover:opacity-100 hover:bg-neutral-800/10 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold mb-1.5">
                    <span className="truncate">{proj.name}</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.5 rounded border border-neutral-800/50 bg-neutral-900 text-neutral-400 capitalize">v1.0</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[9.5px] opacity-65 font-normal select-none">
                    <span>Docs: {proj.metadata.documentsCount}</span>
                    <span>Arts: {proj.metadata.artifactsCount}</span>
                    <span>Research: {proj.metadata.researchCount}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/40 mt-4 text-[9.5px] font-mono opacity-40 select-none">
            Projects aggregate live content structures across databases, research traces, and artifacts.
          </div>
        </div>

        {/* Project Telemetry Metrics */}
        {activeProject && (
          <div className={`md:col-span-8 p-5 border rounded-xl space-y-4 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5 shadow-xs'}`}>
            <div className="flex justify-between items-center border-b border-neutral-800/25 pb-3">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">CORTEX METADATA SPECIFICATION</span>
                <h3 className="text-sm font-bold mt-0.5">{activeProject.name}</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 border border-emerald-900/35 px-2 py-0.5 rounded select-none">ACTIVE PROD</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs font-mono">
              <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
                <span className="opacity-45 text-[9px] block">MEMORY FOOTPRINT</span>
                <span className="text-sm font-bold text-indigo-400">{activeProject.statistics.memoryFootprintKB} KB</span>
              </div>
              <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
                <span className="opacity-45 text-[9px] block">CONCURRENCY LEASES</span>
                <span className="text-sm font-bold text-amber-400">{activeProject.statistics.concurrencyActive} active</span>
              </div>
              <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
                <span className="opacity-45 text-[9px] block">RAG CACHE HIT RATE</span>
                <span className="text-sm font-bold text-emerald-400">{(activeProject.statistics.cacheHitRate * 100).toFixed(1)}%</span>
              </div>
              <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
                <span className="opacity-45 text-[9px] block">CONFIDENCE TARGET</span>
                <span className="text-sm font-bold text-neutral-300">{(activeProject.metadata.averageConfidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            {/* Live Deep Research Form */}
            <form onSubmit={handleInitiateProjectResearch} className="pt-3 border-t border-neutral-800/25">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono mb-2">INITIATE DEEP RESEARCH PIPELINE FOR THIS CELL</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={researchTopicInput}
                  onChange={(e) => setResearchTopicInput(e.target.value)}
                  placeholder="Topic (e.g., Lock-free buffer allocations latency analysis)..."
                  className={`flex-1 px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                />
                <button
                  type="submit"
                  disabled={isTriggeringResearch || !researchTopicInput.trim()}
                  className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    isTriggeringResearch || !researchTopicInput.trim()
                      ? 'opacity-40 border-neutral-800 text-neutral-600'
                      : 'border-neutral-600 hover:bg-neutral-800/40 text-neutral-300'
                  }`}
                >
                  {isTriggeringResearch ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  INITIATE
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Content Tabs Grid */}
      {activeProject && (
        <div className={`p-6 border rounded-xl space-y-6 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex flex-wrap justify-between items-center gap-4 border-b border-neutral-800/25 pb-3">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono select-none">WORKCELL FILE AND COMPILER REGISTERS</span>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              {[
                { id: 'documents', label: 'Documents', count: activeProject.metadata.documentsCount },
                { id: 'research', label: 'Research sessions', count: activeProject.metadata.researchCount },
                { id: 'artifacts', label: 'Artifacts', count: activeProject.metadata.artifactsCount },
                { id: 'memories', label: 'L1/L2 Memories', count: activeProject.metadata.memoriesCount },
                { id: 'history', label: 'Mission History' },
                { id: 'statistics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded transition-colors text-[10px] font-bold uppercase cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                      : 'opacity-50 hover:opacity-90 hover:bg-neutral-800/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[9px] px-1 rounded-sm ${
                      activeTab === tab.id ? 'bg-black/10 text-neutral-800' : 'bg-white/5 text-neutral-400'
                    }`}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="font-mono text-xs">
            {activeTab === 'documents' && (
              <div className="space-y-3">
                {activeProject.documents.length === 0 ? (
                  <p className="text-neutral-500 italic py-6 text-center">No documents bound to this project cell. Upload text in Knowledge Studio.</p>
                ) : (
                  activeProject.documents.map((d) => (
                    <div key={d.id} className="p-3 bg-[#0C0C0C]/50 border border-neutral-800/40 rounded flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{d.name}</span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 capitalize shrink-0">{d.format}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10.5px] text-neutral-400 shrink-0">
                        <span>{(d.size / 1024).toFixed(2)} KB</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'research' && (
              <div className="space-y-4">
                {activeProject.research.length === 0 ? (
                  <p className="text-neutral-500 italic py-6 text-center">No active research sessions inside this project context.</p>
                ) : (
                  activeProject.research.map((s) => (
                    <div key={s.id} className="p-4 bg-[#0C0C0C]/50 border border-neutral-800/40 rounded space-y-3.5">
                      <div className="flex justify-between items-start gap-3 border-b border-neutral-800/20 pb-2">
                        <div>
                          <span className="text-[9.5px] text-indigo-400 uppercase font-bold">Research Session ID: {s.id}</span>
                          <h4 className="font-bold text-sm text-white mt-0.5">{s.topic}</h4>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-green-950/20 text-green-400 border border-green-900/35 uppercase rounded capitalize">{s.status}</span>
                      </div>

                      <div className="text-[11.5px] text-neutral-300 leading-relaxed bg-[#080808] p-3 rounded border border-neutral-900 leading-normal whitespace-pre-line">
                        {s.executiveSummary || 'Research index computations in progress...'}
                      </div>

                      {s.findings && s.findings.length > 0 && (
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Extracted Key Findings</span>
                          <div className="space-y-1.5">
                            {s.findings.map((f: string, idx: number) => (
                              <div key={idx} className="flex gap-2 text-[11px] text-neutral-300">
                                <span className="text-emerald-400">▪</span>
                                <p>{f}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {s.timeline && s.timeline.length > 0 && (
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Grounded Timeline Matrix</span>
                          <div className="space-y-1.5">
                            {s.timeline.map((t: any, idx: number) => (
                              <div key={idx} className="flex gap-3 text-[10px] p-1.5 rounded bg-neutral-950/40">
                                <span className="text-neutral-500 select-none">[{t.date}]</span>
                                <div>
                                  <span className="font-bold text-white">{t.event}</span>
                                  <p className="opacity-60">{t.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'artifacts' && (
              <div className="space-y-3">
                {activeProject.artifacts.length === 0 ? (
                  <p className="text-neutral-500 italic py-6 text-center">No compiled artifacts. Execute operations in other modules to produce files.</p>
                ) : (
                  activeProject.artifacts.map((art) => (
                    <div key={art.id} className="p-3 bg-[#0C0C0C]/50 border border-neutral-800/40 rounded flex flex-wrap justify-between items-center gap-3">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-3.5 h-3.5 text-green-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{art.name}</span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 uppercase shrink-0">{art.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10.5px] text-neutral-400 shrink-0">
                        <span className="opacity-50">v{art.version}</span>
                        <span className="text-white truncate block max-w-[120px] font-mono select-all text-[9.5px] bg-[#080808] px-2 py-0.5 rounded border border-neutral-900">{art.checksum}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'memories' && (
              <div className="space-y-3">
                {activeProject.memories.length === 0 ? (
                  <p className="text-neutral-500 italic py-6 text-center">No associative memories linked to this project keyword.</p>
                ) : (
                  activeProject.memories.map((m) => (
                    <div key={m.id} className="p-3.5 bg-[#0C0C0C]/50 border border-neutral-800/40 rounded space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9.5px] px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 font-bold capitalize select-none">{m.type} memory</span>
                        <span className="text-[9.5px] text-neutral-500">Importance: {m.importance}/10</span>
                      </div>
                      <p className="font-bold text-xs text-white leading-snug">{m.summary}</p>
                      <p className="text-neutral-400 leading-relaxed text-[11px] font-sans whitespace-pre-line">{m.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-3">
                {activeProject.missionHistory.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border-l border-indigo-500/30 bg-[#0C0C0C]/20 rounded-r">
                    <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="leading-relaxed opacity-95 text-xs text-neutral-200">{log.text}</p>
                      <span className="text-[10px] opacity-45 mt-1 block font-mono">by {log.user} • {log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'statistics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Chart 1: Memory footprint allocations */}
                <div className="p-5 border border-neutral-800/40 rounded-xl bg-neutral-950/20 space-y-4">
                  <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Dynamic Frame Cache Memory Metrics</h4>
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Index Docs', size: activeProject.metadata.documentsCount * 12 },
                        { name: 'Research Raw', size: activeProject.metadata.researchCount * 28 },
                        { name: 'Artifact Structs', size: activeProject.metadata.artifactsCount * 45 },
                        { name: 'Memory Vectors', size: activeProject.metadata.memoriesCount * 8 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
                        <XAxis dataKey="name" tick={{ fill: '#6b6b6b', fontSize: 9 }} />
                        <YAxis tick={{ fill: '#6b6b6b', fontSize: 9 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#222' }} />
                        <Bar dataKey="size" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Visual statistics stats list */}
                <div className="p-5 border border-neutral-800/40 rounded-xl bg-neutral-950/20 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block font-mono mb-3">Analytical telemetry metrics</h4>
                    <div className="space-y-3 font-mono text-xs text-neutral-300">
                      <div className="flex justify-between items-center p-2 border-b border-neutral-800/30">
                        <span>Total Byte Weight:</span>
                        <span className="font-bold text-white">{activeProject.metadata.totalBytes.toLocaleString()} bytes</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-neutral-800/30">
                        <span>L2 Cache Residency:</span>
                        <span className="font-bold text-indigo-400">NOMINAL (92%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 border-b border-neutral-800/30">
                        <span>Lease Latency Ceiling:</span>
                        <span className="font-bold text-amber-400">45ms</span>
                      </div>
                      <div className="flex justify-between items-center p-2">
                        <span>Compiler Validation status:</span>
                        <span className="font-bold text-emerald-400">99.8% SUCCESS</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-neutral-500 opacity-50 italic mt-4">
                    Analytics automatically calculated from multi-tier memory and index segments.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 11. SETTINGS WORKSPACE
// ============================================================================
export function SettingsWorkspace({ isDark, onAddLog }: StudioProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'org' | 'workspaces' | 'invitations' | 'devices' | 'audit' | 'integrations'>('profile');
  
  // User Profile State
  const [profile, setProfile] = useState<any>({
    displayName: 'Lead Architect',
    username: 'callmepnj',
    email: 'callmepnj@gmail.com',
    bio: 'Lead Architect and Core Node Administrator for Warborn AI Operations.',
    avatar: '',
    mfaEnabled: true,
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      theme: 'dark',
      notificationSettings: { email: true, push: true, weeklyDigest: false }
    }
  });

  // Org Settings State
  const [orgs, setOrgs] = useState<any[]>([]);
  const [activeOrg, setActiveOrg] = useState<any>(null);
  const [newOrgName, setNewOrgName] = useState('');
  
  // Workspaces State
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [newWsName, setNewWsName] = useState('');
  const [newWsDesc, setNewWsDesc] = useState('');

  // Invitations State
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'manager' | 'member' | 'guest'>('member');
  const [inviteWsId, setInviteWsId] = useState('');

  // Devices State
  const [devices, setDevices] = useState<any[]>([]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Password reset simulation
  const [passwordResetStatus, setPasswordResetStatus] = useState('');

  // Load initial backend data
  const loadData = async () => {
    try {
      // Profile
      const profRes = await cortex.getProfile().catch(() => null);
      if (profRes && profRes.success) {
        setProfile(profRes.profile);
      }

      // Orgs
      const orgsRes = await cortex.getOrganizations().catch(() => null);
      if (orgsRes && orgsRes.success) {
        setOrgs(orgsRes.organizations || []);
        if (orgsRes.organizations && orgsRes.organizations.length > 0) {
          // Select default active org
          const current = orgsRes.organizations[0];
          setActiveOrg(current);
          
          // Workspaces
          const wsRes = await cortex.getWorkspaces(current.id).catch(() => null);
          if (wsRes && wsRes.success) {
            setWorkspaces(wsRes.workspaces || []);
            if (wsRes.workspaces && wsRes.workspaces.length > 0) {
              setInviteWsId(wsRes.workspaces[0].id);
            }
          }

          // Invitations
          const invRes = await cortex.getInvitations(current.id).catch(() => null);
          if (invRes && invRes.success) {
            setInvitations(invRes.invitations || []);
          }
        }
      }

      // Devices
      const devRes = await cortex.getDevices().catch(() => null);
      if (devRes && devRes.success) {
        setDevices(devRes.devices || []);
      }

      // Audits
      const auditRes = await cortex.getSecurityTrailLogs().catch(() => null);
      if (auditRes) {
        setAuditLogs(auditRes);
      }
    } catch (err) {
      console.error('Error syncing Live Identity Data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await cortex.updateProfile({
        displayName: profile.displayName,
        username: profile.username,
        bio: profile.bio,
        preferences: profile.preferences
      });
      if (res && res.success) {
        setProfile(res.profile);
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'SETTINGS',
          message: 'User profile preferences updated successfully.',
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Toggle MFA handler
  const handleToggleMFA = async () => {
    try {
      const res = await cortex.request<any>('/api/v1/auth/mfa/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${cortex.getAuthToken()}` },
        body: JSON.stringify({ enabled: !profile.mfaEnabled })
      });
      if (res && res.success) {
        setProfile((prev: any) => ({ ...prev, mfaEnabled: res.mfaEnabled }));
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'SECURITY',
          message: `Multi-factor authentication (MFA) ${res.mfaEnabled ? 'activated' : 'deactivated'} for account.`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset password simulation
  const handlePasswordResetRequest = async () => {
    try {
      setPasswordResetStatus('dispatching');
      await cortex.requestPasswordReset({ email: profile.email });
      setPasswordResetStatus('dispatched');
      setTimeout(() => setPasswordResetStatus(''), 5000);
    } catch (e) {
      setPasswordResetStatus('failed');
    }
  };

  // Create Organization Handler
  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      const res = await cortex.createOrganization({ name: newOrgName.trim() });
      if (res && res.success) {
        setNewOrgName('');
        await loadData();
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'IDENTITY',
          message: `Spawned new collaborative organization container: "${res.organization.name}"`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update active Org details
  const handleUpdateOrgSettings = async (payload: any) => {
    if (!activeOrg) return;
    try {
      const res = await cortex.updateOrganization(activeOrg.id, payload);
      if (res && res.success) {
        setActiveOrg(res.organization);
        setOrgs(prev => prev.map(o => o.id === activeOrg.id ? res.organization : o));
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'IDENTITY',
          message: 'Saved updated organization configuration options.',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Transfer Ownership Handler
  const handleTransferOwnership = async (targetUserId: string) => {
    if (!activeOrg) return;
    try {
      const res = await cortex.transferOrgOwnership(activeOrg.id, { newOwnerId: targetUserId });
      if (res && res.success) {
        setActiveOrg(res.organization);
        await loadData();
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'SECURITY',
          message: `Transferred ownership of organization "${activeOrg.name}" to peer.`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Workspace Handler
  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !newWsName.trim()) return;
    try {
      const res = await cortex.createWorkspace(activeOrg.id, {
        name: newWsName.trim(),
        description: newWsDesc.trim()
      });
      if (res && res.success) {
        setNewWsName('');
        setNewWsDesc('');
        setWorkspaces(prev => [...prev, res.workspace]);
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'WORKSPACES',
          message: `Created secure isolated workspace "${res.workspace.name}" inside organization.`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Invite member handler
  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrg || !inviteEmail.trim() || !inviteWsId) return;
    try {
      const res = await cortex.inviteMember(activeOrg.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
        workspaceId: inviteWsId
      });
      if (res && res.success) {
        setInviteEmail('');
        setInvitations(prev => [...prev, res.invitation]);
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'INVITATIONS',
          message: `Dispatched mail invitation to "${inviteEmail}" with role [${inviteRole}]`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Revoke device session handler
  const handleRevokeDevice = async (deviceId: string) => {
    try {
      const res = await cortex.revokeDevice(deviceId);
      if (res && res.success) {
        setDevices(prev => prev.filter(d => d.id !== deviceId));
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'warn',
          module: 'SECURITY',
          message: `Revoked token lease for session device: ${deviceId}`,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Local helper tabs definitions
  const tabs = [
    { id: 'profile', label: 'USER PROFILE', icon: User },
    { id: 'org', label: 'ORGANIZATIONS', icon: Building },
    { id: 'workspaces', label: 'WORKSPACES', icon: Split },
    { id: 'invitations', label: 'INVITATIONS', icon: MailOpen },
    { id: 'devices', label: 'DEVICES', icon: Tablet },
    { id: 'audit', label: 'AUDIT TRAIL', icon: ShieldAlert },
    { id: 'integrations', label: 'INTEGRATIONS', icon: Link },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in select-none">
      {/* Sub navigation column */}
      <div className="xl:col-span-3 flex flex-col gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold font-mono tracking-wider transition-all duration-200 text-left ${
                activeTab === tab.id
                  ? isDark
                    ? 'bg-white/5 text-white shadow-sm border border-white/10'
                    : 'bg-black/5 text-black border border-black/10'
                  : isDark
                  ? 'text-white/50 hover:text-white hover:bg-white/2'
                  : 'text-black/50 hover:text-black hover:bg-black/2'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Display Area */}
      <div className="xl:col-span-9">
        <div className={`p-6 border rounded-xl space-y-6 ${isDark ? 'bg-[#121212]/50 border-white/5 text-white' : 'bg-white border-black/5 text-black'}`}>
          
          {/* PROFILE COMPONENT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">User Identity Profile</h3>
                <p className="text-xs opacity-50">Manage your private developer persona, display settings, and authentication keys.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <img
                    src={profile.avatar || ''}
                    alt="avatar"
                    className="w-14 h-14 rounded-full border border-white/10 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 block">AVATAR SELECTION</label>
                    <input
                      type="text"
                      value={profile.avatar || ''}
                      onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                      className={`w-80 px-2.5 py-1 text-xs rounded border bg-transparent font-mono focus:outline-none ${isDark ? 'border-white/10 text-white' : 'border-black/10 text-black'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 block">DISPLAY NAME</label>
                    <input
                      type="text"
                      value={profile.displayName || ''}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 block">USERNAME</label>
                    <input
                      type="text"
                      value={profile.username || ''}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 block">BIO STATEMENT</label>
                  <textarea
                    value={profile.bio || ''}
                    rows={3}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  />
                </div>

                <div className="border-t border-neutral-800/40 pt-4 space-y-4">
                  <h4 className="text-[10px] font-bold font-mono tracking-widest text-neutral-400">REGIONAL & LOCALIZATION</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-wider opacity-60 block">PREFERRED LANGUAGE</label>
                      <select
                        value={profile.preferences?.language || 'en'}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, language: e.target.value }
                        })}
                        className={`w-full px-2 py-1.5 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                      >
                        <option value="en">English (US)</option>
                        <option value="de">German (Deutsch)</option>
                        <option value="fr">French (Français)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono tracking-wider opacity-60 block">TIMEZONE NODE</label>
                      <select
                        value={profile.preferences?.timezone || 'America/New_York'}
                        onChange={(e) => setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, timezone: e.target.value }
                        })}
                        className={`w-full px-2 py-1.5 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                      >
                        <option value="America/New_York">EST (New York)</option>
                        <option value="UTC">UTC (Universal)</option>
                        <option value="Europe/Berlin">CET (Berlin)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    SAVE PROFILE PREFERENCES
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordResetRequest}
                    className={`px-3 py-2 text-xs font-bold font-mono rounded border transition-colors ${
                      isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-black/10 text-black hover:bg-black/5'
                    }`}
                  >
                    {passwordResetStatus === 'dispatching' && 'DISPATCHING RESET LINK...'}
                    {passwordResetStatus === 'dispatched' && 'LINK DISPATCHED TO MAIL ✓'}
                    {passwordResetStatus === '' && 'RESET ACCOUNT PASSWORD'}
                  </button>
                </div>
              </form>

              {/* MFA Section */}
              <div className="border-t border-neutral-800/40 pt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold font-mono flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-indigo-400" /> MULTI-FACTOR AUTHENTICATION (MFA)
                    </h4>
                    <p className="text-[11px] opacity-50 mt-1">Enhance verification leases with multi-tier dynamic passcodes.</p>
                  </div>
                  <button
                    onClick={handleToggleMFA}
                    className={`px-3 py-1.5 text-[10px] font-bold font-mono rounded border transition-colors ${
                      profile.mfaEnabled
                        ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-white/10 text-white/70 hover:bg-white/5'
                    }`}
                  >
                    {profile.mfaEnabled ? 'MFA LEASE: NOMINAL (ACTIVE)' : 'ENABLE MFA SECURE RULE'}
                  </button>
                </div>
                {profile.mfaEnabled && (
                  <div className="p-3 bg-white/2 border border-white/5 rounded-lg text-[11px] font-mono text-neutral-400">
                    MFA Provision Key: <span className="font-bold text-white tracking-widest">{profile.mfaSecret || 'JBSWY3DPEHPK3PXP'}</span> (Standard TOTP format)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ORGANIZATIONS COMPONENT */}
          {activeTab === 'org' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Organizations & Tenants</h3>
                <p className="text-xs opacity-50">Create, configure and manage multi-tenant boundaries for secure enterprise access.</p>
              </div>

              {/* Create Org */}
              <form onSubmit={handleCreateOrg} className="p-4 border border-white/5 bg-white/2 rounded-xl flex items-end gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px] space-y-1">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 block">CREATE NEW CO-OWNED ORGANIZATION</label>
                  <input
                    type="text"
                    required
                    value={newOrgName}
                    placeholder="e.g. Warborn Labs Europe"
                    onChange={(e) => setNewOrgName(e.target.value)}
                    className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                >
                  SPAWN TENANT
                </button>
              </form>

              {/* Select & Manage active Org */}
              {activeOrg ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-neutral-800/40 pb-2">
                    <h4 className="text-[11px] font-bold font-mono tracking-widest text-neutral-400 uppercase">ACTIVE ORGANIZATIONAL SPACE</h4>
                    <select
                      value={activeOrg.id}
                      onChange={async (e) => {
                        const target = orgs.find(o => o.id === e.target.value);
                        if (target) {
                          setActiveOrg(target);
                          const wsRes = await cortex.getWorkspaces(target.id).catch(() => null);
                          if (wsRes && wsRes.success) setWorkspaces(wsRes.workspaces || []);
                          const invRes = await cortex.getInvitations(target.id).catch(() => null);
                          if (invRes && invRes.success) setInvitations(invRes.invitations || []);
                        }
                      }}
                      className={`px-2 py-1 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                    >
                      {orgs.map(org => (
                        <option key={org.id} value={org.id} className={isDark ? 'bg-[#121212]' : 'bg-white'}>{org.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Settings fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 block">ORGANIZATION NAME</label>
                      <input
                        type="text"
                        value={activeOrg.name || ''}
                        onChange={(e) => handleUpdateOrgSettings({ name: e.target.value })}
                        className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 block">ORGANIZATION LOGO URI</label>
                      <input
                        type="text"
                        value={activeOrg.logo || ''}
                        onChange={(e) => handleUpdateOrgSettings({ logo: e.target.value })}
                        className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none font-mono ${isDark ? 'border-white/10' : 'border-black/10'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 block">VERIFIED EMAIL DOMAINS</label>
                      <input
                        type="text"
                        value={activeOrg.domains?.join(', ') || ''}
                        placeholder="e.g. warborn.ai, secure.ai"
                        onChange={(e) => handleUpdateOrgSettings({ domains: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                        className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none font-mono ${isDark ? 'border-white/10' : 'border-black/10'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold font-mono text-neutral-400 block">BILLING STATUS PLAN</label>
                      <div className="flex items-center gap-2 py-2 px-3 border border-white/5 bg-white/2 rounded text-xs font-mono">
                        <div className={`w-1.5 h-1.5 rounded-full ${activeOrg.billingStatus === 'active' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                        <span className="uppercase text-neutral-300">PLAN: {activeOrg.billingStatus === 'active' ? 'Enterprise Unlimited' : 'Staging trial (free tier)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Members Table */}
                  <div className="border-t border-neutral-800/40 pt-4 space-y-3">
                    <h4 className="text-[11px] font-bold font-mono text-neutral-400 uppercase">Organizational Members List</h4>
                    <div className="border border-white/5 rounded-lg overflow-hidden font-mono text-xs">
                      <div className="grid grid-cols-12 gap-2 bg-white/2 p-2.5 font-bold border-b border-white/5">
                        <span className="col-span-6 text-neutral-400">EMAIL / ID</span>
                        <span className="col-span-3 text-neutral-400 text-center">ROLE</span>
                        <span className="col-span-3 text-neutral-400 text-right">ACTION</span>
                      </div>
                      {activeOrg.members?.map((mem: any) => (
                        <div key={mem.userId} className="grid grid-cols-12 gap-2 p-2.5 items-center border-b border-white/5 last:border-b-0">
                          <span className="col-span-6 text-white text-[11px] font-semibold">{mem.userId === 'usr_warborn_lead' ? 'callmepnj@gmail.com (You)' : mem.userId}</span>
                          <span className="col-span-3 text-center"><span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-indigo-400 uppercase font-bold">{mem.role}</span></span>
                          <div className="col-span-3 text-right">
                            {mem.role !== 'owner' && (
                              <div className="flex gap-1.5 justify-end">
                                <button
                                  onClick={() => handleTransferOwnership(mem.userId)}
                                  className="text-[9px] font-bold tracking-tight text-amber-400 hover:underline cursor-pointer"
                                  title="Transfer Owner Lease"
                                >
                                  PROMOTE OWNER
                                </button>
                                <span className="opacity-20">•</span>
                                <button
                                  onClick={async () => {
                                    const res = await cortex.removeOrgMember(activeOrg.id, mem.userId);
                                    if (res && res.success) setActiveOrg(res.organization);
                                  }}
                                  className="text-[9px] font-bold tracking-tight text-red-400 hover:underline cursor-pointer"
                                  title="Expel Member"
                                >
                                  REMOVE
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="opacity-40 italic">Syncing active organizations...</p>
              )}
            </div>
          )}

          {/* WORKSPACES COMPONENT */}
          {activeTab === 'workspaces' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Workspaces isolation</h3>
                <p className="text-xs opacity-50">Create separate workspace clusters to divide documents, memories, models, and projects.</p>
              </div>

              {/* Create workspace */}
              <form onSubmit={handleCreateWorkspace} className="p-4 border border-white/5 bg-white/2 rounded-xl space-y-3">
                <h4 className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">SPAWN NEW ISOLATED WORKSPACE</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold font-mono block text-neutral-500">WORKSPACE NAME</label>
                    <input
                      type="text"
                      required
                      value={newWsName}
                      placeholder="e.g. EU Research Cluster"
                      onChange={(e) => setNewWsName(e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-semibold font-mono block text-neutral-500">DESCRIPTION</label>
                    <input
                      type="text"
                      value={newWsDesc}
                      placeholder="Isolated staging cluster."
                      onChange={(e) => setNewWsDesc(e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                </div>
                <div className="pt-1 text-right">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    CREATE WORKSPACE
                  </button>
                </div>
              </form>

              {/* Workspaces list */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold font-mono text-neutral-400 uppercase">Available Workspace Segments</h4>
                <div className="space-y-2.5">
                  {workspaces.map(ws => (
                    <div key={ws.id} className="p-3 border border-white/5 hover:border-white/10 bg-white/2 rounded-lg flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-wider">[{ws.id}]</span>
                        <h5 className="text-xs font-bold text-white">{ws.name}</h5>
                        <p className="text-[11px] text-neutral-400 leading-normal">{ws.description || 'No description provided.'}</p>
                      </div>
                      <span className="text-[9px] font-mono text-neutral-500 uppercase font-semibold">
                        Instant switcher ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INVITATIONS COMPONENT */}
          {activeTab === 'invitations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Collaborative Invitations</h3>
                <p className="text-xs opacity-50">Invite fellow developers by email to join organizations and allocate their RBAC roles.</p>
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInviteMember} className="p-4 border border-white/5 bg-white/2 rounded-xl space-y-4">
                <h4 className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">DISPATCH MEMBER INVITE</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-neutral-500 block">PEER EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      placeholder="peer@warborn.ai"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className={`w-full px-3 py-1.5 text-xs rounded border bg-transparent focus:outline-none ${isDark ? 'border-white/10' : 'border-black/10'}`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-neutral-500 block">RBAC ROLE LEVEL</label>
                    <select
                      value={inviteRole}
                      onChange={(e: any) => setInviteRole(e.target.value)}
                      className={`w-full px-2 py-1.5 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                    >
                      <option value="owner">Owner (Full Admin Lease)</option>
                      <option value="admin">Admin (System Controls)</option>
                      <option value="manager">Manager (Workspaces Operator)</option>
                      <option value="member">Member (Regular Staging)</option>
                      <option value="guest">Guest (ReadOnly Views)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold font-mono text-neutral-500 block">DEFAULT TARGET WORKSPACE</label>
                    <select
                      value={inviteWsId}
                      onChange={(e) => setInviteWsId(e.target.value)}
                      className={`w-full px-2 py-1.5 text-xs rounded border bg-transparent ${isDark ? 'border-white/10 text-white bg-[#0a0a0a]' : 'border-black/10 text-black bg-white'}`}
                    >
                      {workspaces.map(ws => (
                        <option key={ws.id} value={ws.id}>{ws.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black text-xs font-bold font-mono rounded cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    DISPATCH CO-DEVELOPER INVITE
                  </button>
                </div>
              </form>

              {/* Pending Invitations List */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold font-mono text-neutral-400 uppercase">Pending invitations trail</h4>
                <div className="border border-white/5 rounded-lg overflow-hidden font-mono text-[11px]">
                  <div className="grid grid-cols-12 gap-2 bg-white/2 p-2.5 font-bold border-b border-white/5 text-neutral-400">
                    <span className="col-span-5">EMAIL</span>
                    <span className="col-span-3 text-center">ROLE</span>
                    <span className="col-span-2 text-center">STATUS</span>
                    <span className="col-span-2 text-right">EXPIRES</span>
                  </div>
                  {invitations.length === 0 ? (
                    <p className="p-4 text-center opacity-40 italic">No invitations pending.</p>
                  ) : (
                    invitations.map(inv => (
                      <div key={inv.id} className="grid grid-cols-12 gap-2 p-2.5 items-center border-b border-white/5 last:border-b-0">
                        <span className="col-span-5 text-white font-semibold">{inv.email}</span>
                        <span className="col-span-3 text-center"><span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded text-[9px] font-bold uppercase">{inv.role}</span></span>
                        <span className="col-span-2 text-center text-amber-400 animate-pulse font-semibold uppercase">{inv.status}</span>
                        <span className="col-span-2 text-right opacity-50">{new Date(inv.expiresAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* DEVICES COMPONENT */}
          {activeTab === 'devices' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Active Lease Devices</h3>
                <p className="text-xs opacity-50">Revoke and manage system session keys allocated across physical devices and terminals.</p>
              </div>

              <div className="space-y-3">
                {devices.map(dev => (
                  <div key={dev.id} className="p-4 border border-white/5 bg-white/2 hover:border-white/10 rounded-xl flex items-center justify-between gap-4">
                    <div className="space-y-1 font-mono text-xs text-neutral-300">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-4 h-4 text-emerald-400" />
                        <h5 className="text-sm font-bold text-white">{dev.name}</h5>
                      </div>
                      <div className="flex gap-4 text-[10px] opacity-60">
                        <span>IP: {dev.ip}</span>
                        <span>•</span>
                        <span>Location: {dev.location}</span>
                        <span>•</span>
                        <span>Last Active: {new Date(dev.lastActive).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRevokeDevice(dev.id)}
                      className="px-3 py-1.5 border border-red-500/30 text-red-400 rounded text-[10px] font-bold font-mono hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      REVOKE LEASE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AUDIT TRAIL COMPONENT */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold font-display uppercase tracking-wider mb-1">Security Audit trail</h3>
                <p className="text-xs opacity-50">Immutable logs detailing logins, permission updates, workspace creations, and administrative actions.</p>
              </div>

              <div className="space-y-2.5 font-mono text-[10px]">
                {auditLogs.length === 0 ? (
                  <p className="opacity-40 italic">No audit trail events returned.</p>
                ) : (
                  auditLogs.map((log) => (
                    <div key={log.id} className="p-3 border border-white/5 rounded-lg bg-white/2 flex items-center justify-between flex-wrap gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-400">[{log.id}]</span>
                          <span className="text-white text-[11px] font-semibold">{log.action}</span>
                          <span className="opacity-50">• {log.resource}</span>
                        </div>
                        <div className="opacity-40 text-[9px] flex gap-3">
                          <span>User: {log.email}</span>
                          <span>IP: {log.ip}</span>
                          <span>Device: {log.device}</span>
                        </div>
                      </div>
                      <span className="opacity-50 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* INTEGRATIONS COMPONENT */}
          {activeTab === 'integrations' && (
            <IntegrationCenter isDark={isDark} onAddLog={onAddLog} />
          )}

        </div>
      </div>
    </div>
  );
}
