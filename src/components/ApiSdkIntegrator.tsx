import { useState } from 'react';
import { Project, LogEntry } from '../types';
import { Code, Terminal, ClipboardCheck, Key, ShieldCheck, RefreshCcw } from 'lucide-react';

interface ApiSdkIntegratorProps {
  activeProject: Project;
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function ApiSdkIntegrator({ activeProject, onAddLog, isDark }: ApiSdkIntegratorProps) {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [authToken, setAuthToken] = useState<string>(
    `wbc_token_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
  );
  const [isRotating, setIsRotating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRotateKey = () => {
    setIsRotating(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'warn',
      module: 'BOOT',
      message: 'Cryptographic token rotation sequence initiated on Cortex Security Vault.',
    });

    setTimeout(() => {
      const newKey = `wbc_token_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setAuthToken(newKey);
      setIsRotating(false);

      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'BOOT',
        message: `Token rotated successfully. Revoked old key address. Registered new vault address.`,
      });
    }, 1500);
  };

  const getCodeSnippet = () => {
    const promptValue = activeProject.customInstruction || 'You are Warborn Cortex.';
    const modelName = activeProject.model;

    switch (activeTab) {
      case 'node':
        return `import { GoogleGenAI } from '@google/genai';

// Initialize full-stack proxy integration with Warborn Cortex
const client = new GoogleGenAI({
  apiKey: "${authToken}",
});

// Run dynamic intelligence dispatch
const response = await client.models.generateContent({
  model: "${modelName}",
  contents: "Synthesize latest micro-kernel logs...",
  config: {
    systemInstruction: "${promptValue.replace(/\n/g, '\\n')}",
    temperature: ${activeProject.temperature || 0.5},
  }
});

console.log(response.text);`;

      case 'python':
        return `from google import genai
from google.genai import types

# Initialize full-stack proxy integration with Warborn Cortex
client = genai.Client(api_key="${authToken}")

# Run dynamic intelligence dispatch
response = client.models.generate_content(
    model="${modelName}",
    contents="Synthesize latest micro-kernel logs...",
    config=types.GenerateContentConfig(
        system_instruction="${promptValue.replace(/\n/g, '\\n')}",
        temperature=${activeProject.temperature || 0.5}
    )
)

print(response.text)`;

      default:
        return `curl -X POST https://api.warborn.ai/v1/cortex/agent \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${authToken}" \\
  -d '{
    "model": "${modelName}",
    "message": "Synthesize latest micro-kernel logs...",
    "systemInstruction": "${promptValue.replace(/\n/g, '\\n')}",
    "temperature": ${activeProject.temperature || 0.5}
  }'`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Vault Settings & Credentials */}
      <div className="lg:col-span-5 space-y-6">
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-4 select-none">
            <Key className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              CORTEX INTEGRATION VAULT & AUTH
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold tracking-wider mono-text opacity-40 uppercase block mb-1">
                Active Client Secret Token:
              </span>
              <div className="flex gap-2">
                <input
                  type="password"
                  readOnly
                  value={authToken}
                  className={`flex-1 px-3 py-1.5 rounded border text-xs font-mono bg-transparent outline-none focus:ring-0 ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                />
                <button
                  onClick={handleRotateKey}
                  disabled={isRotating}
                  className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5 ${
                    isRotating
                      ? 'opacity-40 border-neutral-800 text-neutral-600'
                      : 'border-neutral-600 hover:bg-neutral-800/40 text-neutral-300'
                  }`}
                >
                  <RefreshCcw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                  ROTATE
                </button>
              </div>
            </div>

            <div className="border-t border-neutral-800/25 pt-4 space-y-3">
              <div className="flex items-center gap-2 select-none">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-bold mono-text text-neutral-300 uppercase tracking-wide">
                  VAULT INTEGRITY SECURED
                </span>
              </div>
              <p className="opacity-55 text-xs leading-relaxed font-sans">
                These authorization bearer tokens proxy downstream Gemini API secrets securely. Downstream clients never gain visibility into raw master keys.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets Integrator */}
      <div
        className={`lg:col-span-7 p-6 border rounded-xl flex flex-col h-[350px] transition-all duration-300 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}
      >
        <div className={`flex flex-wrap items-center justify-between border-b pb-3 mb-3 ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              CLIENT INTEGRATION BUILD SCRIPTS
            </h3>
          </div>

          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1 px-3 py-1 rounded border text-xs font-semibold transition-colors cursor-pointer ${
              copied
                ? 'border-emerald-700 bg-emerald-950/25 text-emerald-400'
                : 'border-neutral-600 hover:bg-neutral-800/40 text-neutral-300'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            {copied ? 'COPIED!' : 'COPY'}
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 text-[10px] tracking-wider font-semibold uppercase mono-text mb-3 select-none">
          {(['curl', 'node', 'python'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                activeTab === tab
                  ? isDark
                    ? 'bg-neutral-800 text-white border-neutral-700'
                    : 'bg-neutral-200 text-neutral-900 border-neutral-300'
                  : 'opacity-50 hover:opacity-100 border-transparent'
              }`}
            >
              {tab === 'node' ? 'Node.js SDK' : tab === 'python' ? 'Python SDK' : 'cURL Command'}
            </button>
          ))}
        </div>

        {/* Script Display */}
        <div className="flex-1 overflow-y-auto p-3.5 bg-neutral-950 text-neutral-300 border border-neutral-800/45 rounded font-mono text-[11px]">
          <pre>
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
