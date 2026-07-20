import React, { useState } from 'react';
import { Tool, MCPConnector, LogEntry } from '../types';
import { Hammer, Server, ToggleLeft, ToggleRight, Radio, Link, PlusCircle, Globe, Shield } from 'lucide-react';

interface ToolMcpManagerProps {
  tools: Tool[];
  onToggleTool: (id: string) => void;
  connectors: MCPConnector[];
  onAddConnector: (conn: MCPConnector) => void;
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function ToolMcpManager({
  tools,
  onToggleTool,
  connectors,
  onAddConnector,
  onAddLog,
  isDark,
}: ToolMcpManagerProps) {
  const [newConnName, setNewConnName] = useState('');
  const [newConnUrl, setNewConnUrl] = useState('');

  const handleCreateConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnName.trim() || !newConnUrl.trim()) return;

    const newConnector: MCPConnector = {
      id: `mcp_${Date.now()}`,
      name: newConnName.trim(),
      url: newConnUrl.trim(),
      status: 'connected',
      capabilities: ['resources', 'tools'],
      methods: ['list_metrics', 'execute_script', 'fetch_schema_delta'],
    };

    onAddConnector(newConnector);

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'MCP',
      message: `Registered new Model Context Protocol Server: '${newConnector.name}' @ ${newConnector.url}. Active.`,
    });

    setNewConnName('');
    setNewConnUrl('');
  };

  const handleToggleState = (tool: Tool) => {
    onToggleTool(tool.id);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      module: 'BOOT',
      message: `Capability state shifted for tool: [${tool.name}]. Active: ${!tool.isActive}`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Tool Registry Column */}
      <div className="lg:col-span-6 space-y-6">
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 select-none">
            <Hammer className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              INTELLIGENCE TOOL FUNCTION REGISTRY
            </h3>
          </div>

          <div className="space-y-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  tool.isActive
                    ? isDark
                      ? 'border-neutral-700 bg-neutral-950/20'
                      : 'border-neutral-300 bg-neutral-100/50'
                    : isDark
                    ? 'border-white/5 opacity-50 bg-transparent'
                    : 'border-black/5 opacity-50 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-1.5 select-none">
                    <span className="text-xs font-bold mono-text text-neutral-300">{tool.name}</span>
                    <span
                      className={`text-[8px] font-bold px-1 rounded border leading-3 ${
                        tool.isActive
                          ? 'text-emerald-400 border-emerald-900/45 bg-emerald-950/20'
                          : 'text-neutral-500 border-neutral-800/45 bg-neutral-900/20'
                      }`}
                    >
                      {tool.isActive ? 'ACTIVE' : 'MUTED'}
                    </span>
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => handleToggleState(tool)}
                    className="cursor-pointer text-neutral-400 hover:text-white transition-colors"
                  >
                    {tool.isActive ? (
                      <ToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-neutral-500" />
                    )}
                  </button>
                </div>

                <p className="opacity-65 text-[11px] leading-relaxed font-sans mb-2">{tool.description}</p>

                {/* Parameters specs */}
                <div className="space-y-1.5 text-[10px] mono-text border-t border-neutral-800/35 pt-2 opacity-50 select-none">
                  <div className="flex">
                    <span className="w-16">PARAMS:</span>
                    <span className="text-neutral-300 break-all">{tool.parameters}</span>
                  </div>
                  <div className="flex">
                    <span className="w-16">RETURNS:</span>
                    <span className="text-neutral-300 break-all">{tool.returns}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Context Protocol (MCP) Column */}
      <div className="lg:col-span-6 space-y-6">
        {/* Active MCP Connectors */}
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 select-none">
            <Server className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              ACTIVE MODEL CONTEXT PROTOCOL (MCP) HOSTS
            </h3>
          </div>

          <div className="space-y-3.5">
            {connectors.map((conn) => (
              <div
                key={conn.id}
                className={`p-3.5 border rounded-lg transition-all duration-300 ${
                  conn.status === 'connected'
                    ? isDark
                      ? 'border-neutral-800 bg-[#0C0C0C]/40'
                      : 'border-neutral-200 bg-neutral-50'
                    : isDark
                    ? 'border-white/5 opacity-50 bg-transparent'
                    : 'border-black/5 opacity-50 bg-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1.5 select-none">
                  <span className="text-xs font-bold text-neutral-300 truncate max-w-[200px]">{conn.name}</span>
                  <div className="flex items-center gap-1">
                    <Radio className={`w-3 h-3 ${conn.status === 'connected' ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
                    <span
                      className={`text-[8.5px] font-bold mono-text uppercase ${
                        conn.status === 'connected' ? 'text-emerald-400' : 'text-neutral-500'
                      }`}
                    >
                      {conn.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-45 text-[10px] mono-text mb-2 select-none">
                  <Link className="w-3 h-3 text-neutral-500 shrink-0" />
                  <span className="truncate">{conn.url}</span>
                </div>

                {/* Capabilities & Methods */}
                <div className="flex flex-wrap gap-1 mb-2.5 select-none">
                  {conn.capabilities.map((cap) => (
                    <span key={cap} className="text-[8.5px] font-bold px-1.5 py-0.5 rounded border border-blue-900/35 text-blue-400 bg-blue-950/20 mono-text uppercase">
                      CAP: {cap}
                    </span>
                  ))}
                </div>

                <div className="border-t border-neutral-800/25 pt-2">
                  <span className="text-[9px] font-bold mono-text opacity-40 uppercase block mb-1">
                    Exposed Server Methods:
                  </span>
                  <div className="flex flex-wrap gap-1 font-mono text-[9px] opacity-65">
                    {conn.methods.map((method, mIdx) => (
                      <span key={method} className="bg-neutral-900/40 px-1 py-0.5 rounded border border-neutral-800">
                        {method}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Register New Host */}
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-3.5 select-none">
            <PlusCircle className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              REGISTER NEW MCP REMOTE INSTANCE
            </h3>
          </div>

          <form onSubmit={handleCreateConnector} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                MCP HOST LABEL
              </label>
              <input
                type="text"
                required
                value={newConnName}
                onChange={(e) => setNewConnName(e.target.value)}
                placeholder="Database Integration Bridge"
                className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                  isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold mono-text opacity-50 block mb-1">
                HOST ENDPOINT (URI)
              </label>
              <input
                type="text"
                required
                value={newConnUrl}
                onChange={(e) => setNewConnUrl(e.target.value)}
                placeholder="http://127.0.0.1:8080/mcp"
                className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none focus:ring-1 focus:ring-neutral-400 ${
                  isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                }`}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-1.5 mt-1 rounded border font-semibold text-xs transition-colors cursor-pointer ${
                isDark
                  ? 'border-neutral-700 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300'
                  : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              REGISTER & CONNECT HOST
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
