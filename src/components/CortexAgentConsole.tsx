import { useState, useRef, useEffect } from 'react';
import { Project, LogEntry, SystemMetric } from '../types';
import { Cpu, Send, Sparkles, AlertTriangle, ExternalLink, RefreshCw, Terminal, Search } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metrics?: {
    promptTokens: number;
    generationTokens: number;
    reasoningTokens: number;
    totalTokens: number;
    latencyMs: number;
    costUsd: number;
    routingReason: string;
  };
  sources?: Array<{ title: string; url: string }>;
  isError?: boolean;
}

interface CortexAgentConsoleProps {
  activeProject: Project;
  onAddLog: (log: LogEntry) => void;
  onUpdateMetrics: (update: Partial<SystemMetric>) => void;
  isDark: boolean;
}

export default function CortexAgentConsole({
  activeProject,
  onAddLog,
  onUpdateMetrics,
  isDark,
}: CortexAgentConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### SYSTEM CONSOLE ACTIVE

Welcome to **Warborn Cortex** — AI intelligence operating layer for the Warborn ecosystem.

I am connected to the server dispatch router. I can process developer prompts, manage memory blocks, run multi-stage workflows, and execute tool grounding lookups.

Configure your hyperparameters and select a task template below to initiate.`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [searchGrounding, setSearchGrounding] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load project defaults on selection
  useEffect(() => {
    if (activeProject) {
      setSelectedModel(activeProject.model);
      setTemperature(activeProject.temperature || 0.5);
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'ROUTER',
        message: `Project Context Switch: Mounted '${activeProject.name}' workspace parameters.`,
      });
    }
  }, [activeProject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'AGENT',
      message: `Prompt queued for execution: "${textToSend.substring(0, 45)}${textToSend.length > 45 ? '...' : ''}"`,
    });

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'trace',
      module: 'ROUTER',
      message: `Analyzing complexity. Forwarding dispatch to [${selectedModel}] with Temp: ${temperature}, SearchGrounding: ${searchGrounding}.`,
    });

    try {
      const historyPayload = messages
        .filter((m) => m.id !== 'welcome' && !m.isError)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const { cortex } = await import('../lib/cortexClient');
      const data = await cortex.dispatchAgent({
        message: textToSend,
        history: historyPayload,
        model: selectedModel,
        systemInstruction: activeProject.customInstruction || 'You are Warborn Cortex.',
        useSearch: searchGrounding,
        temperature: temperature,
      });

      let sources: Array<{ title: string; url: string }> = [];
      if (data.groundingMetadata?.groundingChunks) {
        sources = data.groundingMetadata.groundingChunks
          .map((chunk: any) => {
            const web = chunk.web;
            if (web) {
              return { title: web.title || 'Source Reference', url: web.uri };
            }
            return null;
          })
          .filter(Boolean);
      }

      const assistantMsg: Message = {
        id: `msg_asst_${Date.now()}`,
        role: 'assistant',
        content: data.text,
        timestamp: new Date().toISOString(),
        metrics: data.metrics,
        sources: sources.length > 0 ? sources : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Update telemetry dashboard state
      if (data.metrics) {
        onUpdateMetrics({
          totalCost: data.metrics.costUsd,
          totalTokens: data.metrics.totalTokens,
          promptTokens: data.metrics.promptTokens,
          generationTokens: data.metrics.generationTokens,
          reasoningTokens: data.metrics.reasoningTokens,
          latencyAvg: data.metrics.latencyMs,
          requestCount: 1, // incremental modifier handled by parent App
        });

        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'ROUTER',
          message: `Dispatch complete. ${data.metrics.totalTokens} tokens processed in ${data.metrics.latencyMs}ms. Cost: $${data.metrics.costUsd.toFixed(5)}`,
        });
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `**CRITICAL TERMINAL DISPATCH ERROR**\n\n${error.message || 'The server rejected or failed to process the request. Verify network status.'}`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        module: 'ROUTER',
        message: `Dispatch failed: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sampleBlueprints = [
    {
      title: 'Ground Search',
      prompt: 'Summarize latest technology specs of low-latency microkernels.',
      badge: 'GROUNDING',
      useSearch: true,
    },
    {
      title: 'Analyze Code',
      prompt: 'Audit standard socket buffer channels in Warborn OS for memory leaks.',
      badge: 'ANALYSIS',
      useSearch: false,
    },
    {
      title: 'Episodic Memory',
      prompt: 'Remember for future audits that Warborn OS core processes route using AES-GCM-256 tokens.',
      badge: 'MEM-STORE',
      useSearch: false,
    },
  ];

  return (
    <div className={`flex flex-col h-[520px] border rounded-xl overflow-hidden transition-all duration-300 ${
      isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
    }`}>
      {/* Console Top Bar */}
      <div
        className={`flex flex-wrap items-center justify-between px-4 py-2 border-b select-none ${
          isDark ? 'bg-[#0C0C0C] border-white/5' : 'bg-neutral-50 border-black/5'
        }`}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-xs font-semibold tracking-wider mono-text opacity-70">
            CORTEX CORE RUNTIME TERMINAL
          </span>
        </div>

        {/* Hyperparameters Config */}
        <div className="flex items-center gap-4 text-[11px] mono-text mt-1.5 sm:mt-0">
          <div className="flex items-center gap-1.5">
            <span className="opacity-50">DISPATCH MODEL:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`px-2 py-0.5 rounded border bg-transparent text-xs focus:outline-none ${
                isDark ? 'border-neutral-800 text-[#EDEDED]' : 'border-neutral-300 text-[#18181B]'
              }`}
            >
              <option value="gemini-3.5-flash" className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                gemini-3.5-flash
              </option>
              <option value="gemini-3.1-pro-preview" className={isDark ? 'bg-[#141414]' : 'bg-white'}>
                gemini-3.1-pro-preview
              </option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="opacity-50">TEMP:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-16 h-1 accent-neutral-400 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            />
            <span className="opacity-60">{temperature}</span>
          </div>

          <button
            onClick={() => setSearchGrounding(!searchGrounding)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] tracking-wide transition-colors cursor-pointer ${
              searchGrounding
                ? 'bg-neutral-800 text-white border-neutral-700'
                : 'opacity-55 hover:opacity-100 border-transparent'
            }`}
          >
            <Search className="w-3 h-3 text-neutral-400" />
            GROUNDING
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div
        className={`flex-1 overflow-y-auto p-4 space-y-4 ${
          isDark ? 'bg-[#0A0A0A]' : 'bg-white'
        }`}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            {/* Meta tags for model traces */}
            {msg.role === 'assistant' && msg.metrics && (
              <div className="flex items-center gap-1.5 text-[9px] mono-text opacity-40 mb-1 select-none">
                <Cpu className="w-2.5 h-2.5 text-neutral-400" />
                <span>
                  {msg.metrics.routingReason} — {msg.metrics.latencyMs}ms | {msg.metrics.totalTokens}t | ${msg.metrics.costUsd.toFixed(5)}
                </span>
              </div>
            )}

            {/* Bubble Panel */}
            <div
              className={`p-3.5 rounded-lg border text-sm transition-all duration-300 ${
                msg.isError
                  ? 'bg-red-950/20 border-red-900/40 text-red-300'
                  : msg.role === 'user'
                  ? isDark
                    ? 'bg-[#141414] border-[rgba(255,255,255,0.06)] text-white'
                    : 'bg-neutral-100 border-neutral-300/50 text-neutral-900'
                  : isDark
                  ? 'bg-[#0C0C0C]/50 border-neutral-900 text-[#EDEDED]'
                  : 'bg-neutral-50/50 border-neutral-200/60 text-neutral-800'
              }`}
            >
              {/* Message text parser */}
              <div className="space-y-2 leading-relaxed">
                {msg.content.split('\n\n').map((paragraph, pIdx) => {
                  // Render Code Sandbox blocks
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const code = lines.slice(1, -1).join('\n');
                    return (
                      <pre key={pIdx} className="p-3 bg-neutral-950 text-neutral-300 rounded font-mono text-[11px] overflow-x-auto border border-neutral-800/65">
                        <code>{code}</code>
                      </pre>
                    );
                  }

                  // Standard subheadings
                  if (paragraph.startsWith('###')) {
                    return (
                      <h4 key={pIdx} className="text-xs font-bold uppercase tracking-wider text-neutral-400 mono-text pt-1">
                        {paragraph.replace('###', '').trim()}
                      </h4>
                    );
                  }

                  // Bullet lists
                  if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
                    return (
                      <ul key={pIdx} className="list-disc pl-5 space-y-1 text-sm opacity-90">
                        {paragraph.split('\n').map((item, iIdx) => (
                          <li key={iIdx}>{item.substring(2)}</li>
                        ))}
                      </ul>
                    );
                  }

                  return <p key={pIdx} className="text-sm opacity-90 font-sans">{paragraph}</p>;
                })}
              </div>

              {/* Grounded Web Sources References */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="border-t border-neutral-800/35 mt-3 pt-2.5">
                  <span className="text-[10px] mono-text opacity-40 select-none block mb-1.5 uppercase font-semibold">
                    GROUNDED KNOWLEDGE SOURCING:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded border border-neutral-800 hover:border-neutral-700 bg-neutral-950/40 text-neutral-400 transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[150px] font-medium">{src.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamps */}
            <span className="text-[9px] opacity-30 mt-1 mono-text select-none">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-neutral-500 font-mono pl-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400" />
            <span>Computing dynamic cortex routing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Blueprints panel */}
      {messages.length < 3 && (
        <div
          className={`px-4 py-2.5 border-t select-none flex flex-wrap items-center gap-2.5 ${
            isDark ? 'bg-[#0B0B0B] border-white/5' : 'bg-neutral-50/50 border-black/5'
          }`}
        >
          <span className="text-[10px] font-bold mono-text opacity-40 uppercase">
            QUICK Blueprints:
          </span>
          {sampleBlueprints.map((blueprint, index) => (
            <button
              key={index}
              onClick={() => {
                setInputValue(blueprint.prompt);
                setSearchGrounding(blueprint.useSearch);
              }}
              className={`text-xs px-2.5 py-1 rounded border transition-all duration-300 cursor-pointer text-left ${
                isDark
                  ? 'border-neutral-800 hover:border-neutral-700 bg-[#121212] text-neutral-300 hover:bg-[#161616]'
                  : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <span className="font-semibold block text-[9px] text-neutral-400 uppercase tracking-wider mb-0.5 mono-text">
                {blueprint.badge}
              </span>
              <span className="truncate block max-w-[200px] font-sans">{blueprint.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input panel bar */}
      <div
        className={`p-3.5 border-t flex gap-3 items-center ${
          isDark ? 'bg-[#0C0C0C] border-white/5' : 'bg-white border-black/5'
        }`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage(inputValue);
          }}
          disabled={isLoading}
          placeholder="Dispatch prompt instructions to Cortex node..."
          className={`flex-1 px-3.5 py-2 rounded-lg border text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
            isDark
              ? 'border-neutral-800 text-[#EDEDED] placeholder-neutral-600'
              : 'border-neutral-300 text-[#18181B] placeholder-neutral-400'
          }`}
        />
        <button
          onClick={() => handleSendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className={`p-2.5 rounded-lg border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            isLoading || !inputValue.trim()
              ? 'opacity-40 border-neutral-800 text-neutral-600'
              : 'border-neutral-600 hover:border-neutral-300 text-neutral-300 hover:bg-neutral-800/25'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
