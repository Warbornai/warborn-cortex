import { useState, useRef, useEffect } from 'react';
import { LogEntry } from '../types';
import { Terminal, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

interface TraceLogsProps {
  logs: LogEntry[];
  onClear: () => void;
  isDark: boolean;
}

export default function TraceLogs({ logs, onClear, isDark }: TraceLogsProps) {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const modules = Array.from(new Set(logs.map((log) => log.module)));
  const levels = ['info', 'warn', 'error', 'trace'];

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesLevel && matchesModule;
  });

  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-950/30 border-red-900/45';
      case 'warn':
        return 'text-amber-400 bg-amber-950/30 border-amber-900/45';
      case 'trace':
        return 'text-sky-400 bg-sky-950/30 border-sky-900/45';
      default:
        return 'text-neutral-400 bg-neutral-900/30 border-neutral-800/45';
    }
  };

  return (
    <div
      id="observability-trace-console"
      className={`border rounded-xl p-6 flex flex-col h-[320px] transition-all duration-300 ${
        isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
      }`}
    >
      {/* Console Header */}
      <div className={`flex flex-wrap items-center justify-between border-b pb-4 mb-4 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <Terminal className="w-4 h-4 text-neutral-400" />
          <span className="text-xs font-bold tracking-wider uppercase mono-text text-neutral-400">
            SYSTEM TRACE OBSERVABILITY BUFFER
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] mono-text">
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">LEVEL:</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={`px-2 py-1 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
              }`}
            >
              <option value="all" className={isDark ? 'bg-[#141414]' : 'bg-white'}>ALL</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl} className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                  {lvl.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="opacity-50">MODULE:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className={`px-2 py-1 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
              }`}
            >
              <option value="all" className={isDark ? 'bg-[#141414]' : 'bg-white'}>ALL</option>
              {modules.map((mod) => (
                <option key={mod} value={mod} className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                  {mod.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onClear}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              isDark
                ? 'border-neutral-800 hover:bg-neutral-950 text-neutral-400'
                : 'border-neutral-300 hover:bg-neutral-200 text-neutral-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            CLEAR
          </button>
        </div>
      </div>

      {/* Logs output */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 pr-2">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-1.5">
            <CheckCircle2 className="w-5 h-5 opacity-40" />
            <span>Trace observability buffer is empty or no matches exist.</span>
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 py-0.5 border-b border-transparent hover:bg-neutral-800/10 rounded px-1"
            >
              <span className="opacity-40 select-none">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={`px-1 rounded text-[9px] font-bold border leading-3 select-none ${getLevelBadgeClass(
                  log.level
                )}`}
              >
                {log.level.toUpperCase()}
              </span>
              <span className="text-neutral-400 font-semibold select-none">
                [{log.module}]
              </span>
              <span className={`break-all ${log.level === 'error' ? 'text-red-400 font-medium' : isDark ? 'text-neutral-300' : 'text-neutral-800'}`}>
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}
