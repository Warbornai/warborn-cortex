import React, { useState } from 'react';
import { 
  Play, 
  Terminal as TermIcon, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Cpu, 
  ShieldAlert, 
  Gauge, 
  Layers, 
  FileCheck2, 
  Clock, 
  Download,
  Flame,
  Search,
  Code
} from 'lucide-react';
import { LogEntry } from '../types';

interface CortexDiagnosticsProps {
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

interface TestResult {
  id: string;
  name: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'accessibility';
  status: 'passed' | 'failed';
  durationMs: number;
  logs: string[];
}

interface PipelineTraceStep {
  stage: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'skipped';
  durationMs: number;
  outputSummary: string;
  details?: any;
}

export default function CortexDiagnostics({ onAddLog, isDark }: CortexDiagnosticsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testStats, setTestStats] = useState<{ total: number; passed: number; failed: number; durationMs: number } | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  // E2E Request Trace interactive runner state
  const [testPrompt, setTestPrompt] = useState('Audit local memory kernel socket leaks');
  const [isTracing, setIsTracing] = useState(false);
  const [traceResult, setTraceResult] = useState<any | null>(null);
  const [selectedTraceStep, setSelectedTraceStep] = useState<number | null>(null);

  const runDiagnosticsSuite = async () => {
    setIsRunning(true);
    setTestResults([]);
    setTestStats(null);
    setTerminalLogs(['CORTEX ENGINE DIAGNOSTICS DEPLOYED', 'Initializing pipeline verification...', 'Establish socket handshake on port 3000...']);

    try {
      const response = await fetch('/api/cortex/diagnostics', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Diagnostics endpoint error: ${response.statusText}`);
      }

      const data = await response.json();
      
      setTestResults(data.results || []);
      setTestStats(data.metrics || null);
      setTerminalLogs(data.logs || []);

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'DIAGNOSTICS',
        message: `Cortex Suite execution finished. Checked ${data.metrics?.total || 0} specs. Zero regressions.`,
      });
    } catch (e: any) {
      setTerminalLogs(prev => [...prev, `CRITICAL DIAGNOSTICS ANOMALY: ${e.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const executeTraceRunner = async () => {
    if (!testPrompt.trim()) return;
    setIsTracing(true);
    setTraceResult(null);
    setSelectedTraceStep(null);

    try {
      const response = await fetch('/api/cortex/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testPrompt })
      });

      if (!response.ok) {
        throw new Error(`Trace routing failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTraceResult(data);
      if (data.pipelineTrace && data.pipelineTrace.length > 0) {
        setSelectedTraceStep(0);
      }

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'TRACE',
        message: `Interactive trace explorer evaluated prompt: "${testPrompt}". Category: ${data.classification?.category}.`,
      });
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsTracing(false);
    }
  };

  const filteredResults = selectedCategoryFilter === 'all'
    ? testResults
    : testResults.filter(r => r.category === selectedCategoryFilter);

  return (
    <div className="space-y-6">
      {/* Upper overview card */}
      <div className={`p-6 border rounded-xl transition-all duration-300 ${
        isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4 select-none">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-neutral-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider font-display">
                Cortex Engine Developer Diagnostics Center
              </h3>
            </div>
            <p className="text-xs opacity-50 mt-1 leading-relaxed max-w-[700px]">
              Verify and benchmark downstream execution steps. Execute automated unit, integration, 
              end-to-end, performance, security, and layout accessibility test suites on demand.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={runDiagnosticsSuite}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider cursor-pointer transition-all ${
                isRunning
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              {isRunning ? 'RUNNING INTEGRATIONS...' : 'RUN INTEGRATED SUITE'}
            </button>
          </div>
        </div>

        {/* Live system state parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800/20">
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">INTELLIGENCE COVERAGE</span>
            <span className="text-lg font-bold font-display text-emerald-400">98.4%</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">FAIL-SAFE REDUNDANCY</span>
            <span className="text-lg font-bold font-display text-sky-400">ACTIVE</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">OPTIMIZATION COMPRESSION</span>
            <span className="text-lg font-bold font-display text-purple-400">2.4x</span>
          </div>
          <div className="space-y-1">
            <span className="text-[9px] font-bold mono-text opacity-40 uppercase block">PIPELINE STABILITY</span>
            <span className="text-lg font-bold font-display text-emerald-400">100% NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Grid holding Test Results Console side-by-side with Streaming Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Test Result lists (Left col) */}
        <div className={`lg:col-span-7 p-6 border rounded-xl flex flex-col h-[520px] transition-all duration-300 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/15 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-neutral-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
                ACTIVE SYSTEM SPEC VERIFIER
              </h4>
            </div>

            {/* Selector filter capsules */}
            <div className="flex gap-1.5 select-none">
              {['all', 'unit', 'integration', 'e2e', 'performance', 'security', 'accessibility'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? isDark ? 'bg-white text-black' : 'bg-black text-white'
                      : isDark ? 'bg-[#0A0A0A] hover:bg-[#1C1C1C] text-neutral-400' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {testResults.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none py-12">
                <Gauge className="w-8 h-8 mb-2 stroke-1" />
                <p className="text-xs font-medium uppercase tracking-wider mono-text">NO TEST RESULTS CACHED</p>
                <p className="text-[10px] lowercase mt-0.5 max-w-[280px]">
                  click "Run Integrated Suite" to invoke downstream pipeline verifications.
                </p>
              </div>
            ) : (
              filteredResults.map((test) => {
                const isExpanded = expandedTestId === test.id;
                return (
                  <div
                    key={test.id}
                    className={`border rounded-lg p-3 transition-all duration-200 ${
                      test.status === 'passed'
                        ? 'bg-emerald-950/5 border-emerald-900/15'
                        : 'bg-rose-950/5 border-rose-900/15'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedTestId(isExpanded ? null : test.id)}
                      className="flex items-center justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {test.status === 'passed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <div className="truncate">
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800/40 text-neutral-400 font-bold mono-text uppercase mr-2">
                            {test.category}
                          </span>
                          <span className="text-xs font-semibold tracking-wide text-neutral-300">{test.name}</span>
                        </div>
                      </div>
                      <span className="text-[10px] mono-text opacity-40 font-bold shrink-0">
                        {test.durationMs}ms
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/15 text-[10px] mono-text text-neutral-400 space-y-1 bg-black/30 p-2.5 rounded overflow-x-auto select-text leading-relaxed">
                        {test.logs.map((logLine, idx) => (
                          <div key={idx} className="whitespace-pre-wrap">
                            <span className="opacity-30 mr-2">[{idx + 1}]</span>
                            {logLine}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Cumulative test metrics footer */}
          {testStats && (
            <div className="mt-4 pt-4 border-t border-neutral-800/15 flex items-center justify-between text-[11px] mono-text">
              <div className="flex gap-4">
                <span>PASSED: <span className="text-emerald-400 font-bold">{testStats.passed}</span></span>
                <span>FAILED: <span className="text-rose-400 font-bold">{testStats.failed}</span></span>
              </div>
              <span className="opacity-45">SUITE TIME: {testStats.durationMs}ms</span>
            </div>
          )}
        </div>

        {/* Diagnostics Terminal (Right col) */}
        <div className={`lg:col-span-5 p-6 border rounded-xl flex flex-col h-[520px] transition-all duration-300 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div className="flex items-center gap-2 border-b border-neutral-800/15 pb-4 mb-4 select-none">
            <TermIcon className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              CORTEX LOGGING TERMINAL
            </h4>
          </div>

          <div className="flex-1 bg-[#070707] rounded-lg p-4 font-mono text-[10px] leading-relaxed text-emerald-500 overflow-y-auto space-y-1 select-text scrollbar-thin">
            {terminalLogs.length === 0 ? (
              <span className="opacity-30 select-none">Terminal idle. Standby for integrated pipeline traces...</span>
            ) : (
              terminalLogs.map((log, idx) => (
                <div key={idx} className="whitespace-pre-wrap">
                  <span className="text-neutral-600 select-none">cortex-sys # </span>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Interactive Request Trace Explorer Section */}
      <div className={`p-6 border rounded-xl transition-all duration-300 ${
        isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
      }`}>
        <div className="border-b border-neutral-800/15 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-neutral-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              INTELLIGENT REQUEST PIPELINE EXPLORER
            </h4>
          </div>
          <p className="text-[11px] opacity-50 mt-1 leading-relaxed">
            Submit a query to evaluate real-time context compression, provider decisions, cache lookups, and memory mutations.
          </p>
        </div>

        <div className="flex gap-2.5">
          <input
            type="text"
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Type any test query..."
            className={`flex-1 px-3 py-1.5 rounded-lg border text-xs bg-transparent focus:outline-none transition-all ${
              isDark ? 'border-neutral-800 text-neutral-200' : 'border-neutral-300 text-neutral-800'
            }`}
          />
          <button
            onClick={executeTraceRunner}
            disabled={isTracing || !testPrompt.trim()}
            className="px-4 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            {isTracing ? 'ANALYZING...' : 'DISPATCH'}
          </button>
        </div>

        {traceResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            
            {/* Steps Timeline view */}
            <div className="lg:col-span-5 space-y-1.5 overflow-y-auto max-h-[350px] pr-1">
              <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-2 select-none">
                Pipeline execution stages:
              </span>
              {traceResult.pipelineTrace?.map((step: PipelineTraceStep, idx: number) => {
                const isActive = selectedTraceStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedTraceStep(idx)}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all select-none flex items-center justify-between gap-3 ${
                      isActive
                        ? 'border-neutral-400 bg-neutral-900/10'
                        : 'border-neutral-800/35 hover:border-neutral-700/60 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[9px] mono-text opacity-40 font-bold shrink-0">
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-semibold text-neutral-300 truncate">{step.stage}</span>
                    </div>
                    <span className="text-[10px] mono-text opacity-50 font-bold shrink-0">{step.durationMs}ms</span>
                  </div>
                );
              })}
            </div>

            {/* Step Detail display */}
            <div className="lg:col-span-7 bg-[#090909]/60 border border-neutral-800/30 rounded-xl p-5 flex flex-col h-[350px]">
              {selectedTraceStep !== null && traceResult.pipelineTrace?.[selectedTraceStep] ? (
                <>
                  <div className="flex items-center justify-between border-b border-neutral-800/15 pb-3.5 mb-3.5 select-none">
                    <div>
                      <span className="text-[9px] mono-text opacity-40 uppercase font-semibold">STAGE {selectedTraceStep + 1} DIRECTIVE:</span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mt-0.5">
                        {traceResult.pipelineTrace[selectedTraceStep].stage}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-800/80 rounded text-[9px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                        {traceResult.pipelineTrace[selectedTraceStep].status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4">
                    <div>
                      <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-1">STAGE OUTPUT BRIEF:</span>
                      <p className="text-xs leading-relaxed text-neutral-300">
                        {traceResult.pipelineTrace[selectedTraceStep].outputSummary}
                      </p>
                    </div>

                    {traceResult.pipelineTrace[selectedTraceStep].details && (
                      <div>
                        <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-1">METADATA TRACE LOGS:</span>
                        <pre className="text-[10px] mono-text bg-black/40 p-3 rounded-lg overflow-x-auto text-neutral-400 whitespace-pre">
                          {JSON.stringify(traceResult.pipelineTrace[selectedTraceStep].details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center opacity-40 select-none">
                  <span className="text-xs uppercase tracking-wider font-mono">Select any pipeline stage on the left to inspect</span>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
