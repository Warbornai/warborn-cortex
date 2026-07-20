import React, { useState, useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Crosshair,
  Search,
  Globe,
  Database,
  Activity,
  Trash2,
  RefreshCw,
  Clock,
  Check,
  AlertCircle,
  Tag
} from 'lucide-react';

interface DocumentRecord {
  id: string;
  name: string;
  content: string;
  size: number;
  format: string;
  status: string;
  metadata: {
    title: string;
    author: string;
    project: string;
    tags: string[];
    checksum: string;
    source: string;
    language: string;
    pageCount: number;
    uploadTime: string;
    version: string;
  };
  chunks: any[];
  versionHistory: Array<{
    version: string;
    checksum: string;
    updatedAt: string;
    author: string;
  }>;
}

interface KnowledgeHealth {
  indexCount: number;
  totalVectors: number;
  averageChunkLength: number;
  queryThroughput: number;
  cacheHitRate: number;
  status: 'nominal' | 'degraded';
}

interface KnowledgeVectorEngineProps {
  documents: any[]; // unused static state
  onAddDocument: (doc: any) => void; // unused static state
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function KnowledgeVectorEngine({
  onAddLog,
  isDark,
}: KnowledgeVectorEngineProps) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [health, setHealth] = useState<KnowledgeHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Create / Upload states
  const [isDragging, setIsDragging] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputName, setInputName] = useState('');
  const [inputProject, setInputProject] = useState('default');
  const [isUploading, setIsUploading] = useState(false);

  // Search & Retrieval states
  const [searchQuery, setSearchQuery] = useState('');
  const [retrievedResults, setRetrievedResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Focus detail state
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all documents & health metrics
  const fetchKnowledgeState = async () => {
    setLoading(true);
    try {
      const docsRes = await fetch('/api/v1/intelligence/documents');
      if (docsRes.ok) {
        const data = await docsRes.json();
        if (data.success) {
          setDocuments(data.documents || []);
        }
      }

      const healthRes = await fetch('/api/v1/intelligence/knowledge/health');
      if (healthRes.ok) {
        const data = await healthRes.json();
        if (data.success) {
          setHealth(data.metrics);
        }
      }
    } catch (err) {
      console.error('Error fetching knowledge base state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeState();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processUploadedFile(files[0]);
    }
  };

  const processUploadedFile = async (file: File) => {
    setIsUploading(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'KNOWLEDGE',
      message: `Uploading and chunking document stream: ${file.name} (${file.size} bytes).`,
    });

    const text = await file.text();
    const format = file.name.split('.').pop() || 'txt';
    await uploadDocumentToCortex(file.name, text, format);
  };

  const handleManualUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !inputName.trim()) return;

    setIsUploading(true);
    const format = inputName.split('.').pop() || 'md';
    await uploadDocumentToCortex(inputName, inputText, format);
    setInputName('');
    setInputText('');
  };

  const uploadDocumentToCortex = async (name: string, content: string, format: string) => {
    try {
      const response = await fetch('/api/v1/intelligence/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'developer',
        },
        body: JSON.stringify({
          name,
          content,
          size: content.length,
          format,
          author: 'developer',
          project: inputProject,
        }),
      });

      if (!response.ok) throw new Error('Cortex document ingestion server rejected');
      const data = await response.json();

      if (data.success) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'KNOWLEDGE',
          message: `Consolidated '${name}' into RAG collections. Chunked into ${data.data?.chunks?.length || 0} vector segments.`,
        });
        fetchKnowledgeState();
      }
    } catch (err: any) {
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'error',
        module: 'KNOWLEDGE',
        message: `Ingestion failed: ${err.message || err}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Prune document and all related embedded chunks from database?')) return;

    try {
      const res = await fetch(`/api/v1/intelligence/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'KNOWLEDGE',
          message: `Deleted knowledge document ID ${id} from live Cortex index.`,
        });
        if (selectedDoc?.id === id) setSelectedDoc(null);
        fetchKnowledgeState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReindexDoc = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'KNOWLEDGE',
      message: `Triggering vector reindex pipeline for document ${id}`,
    });

    try {
      const res = await fetch(`/api/v1/intelligence/documents/${id}/reindex`, { method: 'POST' });
      if (res.ok) {
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'KNOWLEDGE',
          message: `Reindex pipeline complete. Vector dimensions synchronized.`,
        });
        fetchKnowledgeState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetrieveRAG = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'KNOWLEDGE',
      message: `Executing hybrid RAG retrieval query: "${searchQuery}"`,
    });

    try {
      const response = await fetch('/api/v1/intelligence/knowledge/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          filters: { limit: 4, crossProjectSearch: true },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRetrievedResults(data.result);
          onAddLog({
            timestamp: new Date().toISOString(),
            level: 'info',
            module: 'KNOWLEDGE',
            message: `RAG Retrieval successful. Confidence: ${(data.result.confidence * 100).toFixed(1)}% | Sources: ${data.result.sources?.length || 0}`,
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // 2D Projection mapping coordinates helper
  const getCoords = (doc: DocumentRecord) => {
    // Generate deterministic 2D plot coordinate based on string hash
    let hash = 0;
    const str = doc.name + doc.content.substring(0, 50);
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash) * 0.75;
    const y = Math.cos(hash + 2) * 0.75;
    return [x, y];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Knowledge Uploader & Search */}
      <div className="lg:col-span-5 space-y-6">
        {/* Knowledge Metrics Panel */}
        <div className={`p-6 border rounded-xl transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex items-center justify-between mb-4 select-none">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">
                Knowledge health index
              </h3>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
              health?.status === 'nominal' ? 'text-green-400 bg-green-950/20 border-green-900/35' : 'text-red-400 bg-red-950/20 border-red-900/35'
            }`}>
              {health?.status || 'nominal'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5 text-xs font-mono">
            <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="opacity-40 text-[10px] block">COLLECTIONS INDEXED</span>
              <span className="text-base font-bold">{health?.indexCount || documents.length}</span>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="opacity-40 text-[10px] block">TOTAL VECTORS</span>
              <span className="text-base font-bold text-indigo-400">{health?.totalVectors || documents.reduce((acc, d) => acc + d.chunks.length, 0)}</span>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="opacity-40 text-[10px] block">CACHE HIT RATE</span>
              <span className="text-base font-bold text-amber-400">{health ? `${(health.cacheHitRate * 100).toFixed(1)}%` : '84.0%'}</span>
            </div>
            <div className={`p-3 rounded border ${isDark ? 'border-white/5 bg-[#0C0C0C]' : 'border-black/5 bg-neutral-50'}`}>
              <span className="opacity-40 text-[10px] block">QUERY THROUGHPUT</span>
              <span className="text-base font-bold text-emerald-400">{health ? `${health.queryThroughput}/s` : '142.5/s'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Vector Uploader */}
        <div className={`p-6 border rounded-xl transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex items-center gap-2 mb-3">
            <UploadCloud className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">
              VECTOR INGESTION CORE
            </h3>
          </div>

          {/* Drag and Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[110px] mb-4 ${
              isDragging
                ? 'border-neutral-300 bg-neutral-800/10'
                : 'border-neutral-800/60 hover:border-neutral-600 hover:bg-neutral-800/5'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".txt,.md,.json"
            />
            <UploadCloud className="w-7 h-7 text-neutral-500 mb-1.5" />
            <span className="text-xs font-medium block">Drag & Drop knowledge file or click to browse</span>
            <span className="text-[9px] opacity-40 mt-0.5 block font-mono">Accepts .txt, .md, .json</span>
          </div>

          {/* Manual Form */}
          <form onSubmit={handleManualUpload} className="space-y-3 pt-3 border-t border-neutral-800/35">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9.5px] font-bold tracking-wider font-mono opacity-50 block mb-1">KEY_NAME.MD</label>
                <input
                  type="text"
                  required
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="index_specs.md"
                  className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                />
              </div>
              <div>
                <label className="text-[9.5px] font-bold tracking-wider font-mono opacity-50 block mb-1">PROJECT CELL</label>
                <input
                  type="text"
                  value={inputProject}
                  onChange={(e) => setInputProject(e.target.value)}
                  placeholder="default"
                  className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                    isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                  }`}
                />
              </div>
            </div>

            <div>
              <textarea
                required
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste knowledge index details, procedures, logs or references..."
                rows={2}
                className={`w-full px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                  isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-1.5 rounded border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isUploading
                  ? 'opacity-40 border-neutral-800 text-neutral-600'
                  : isDark
                  ? 'border-neutral-700 bg-[#1e1e1e] hover:bg-[#282828] text-neutral-300'
                  : 'border-neutral-300 bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              {isUploading ? 'SERIALIZING EMBEDDINGS...' : 'COMMIT & EMBED DOCUMENT'}
            </button>
          </form>
        </div>

        {/* Semantic Search Panel */}
        <div className={`p-6 border rounded-xl transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex items-center gap-2 mb-3.5">
            <Search className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">
              Hybrid RAG search lookup
            </h3>
          </div>

          <form onSubmit={handleRetrieveRAG} className="flex gap-2">
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents semantically..."
              className={`flex-1 px-3 py-1.5 rounded border text-xs bg-transparent focus:outline-none ${
                isDark ? 'border-neutral-800 text-neutral-300' : 'border-neutral-300 text-neutral-700'
              }`}
            />
            <button
              type="submit"
              disabled={isSearching || documents.length === 0}
              className={`px-3 py-1.5 rounded border text-xs font-semibold cursor-pointer transition-colors ${
                isSearching || documents.length === 0
                  ? 'opacity-40 border-neutral-800 text-neutral-600'
                  : 'border-neutral-600 hover:bg-neutral-800/40 text-neutral-300'
              }`}
            >
              LOOKUP
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: PCA Cognitive Map & Document Index List */}
      <div className="lg:col-span-7 space-y-6">
        {/* PCA Map and RAG retrieved details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* PCA Cognitive Graph */}
          <div className={`md:col-span-7 p-6 border rounded-xl flex flex-col h-[350px] transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <div className="flex items-center justify-between border-b pb-3 mb-3 select-none">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-neutral-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">2D Cognitive Vector Map</h3>
              </div>
              <span className="text-[9px] font-mono opacity-40">PCA SPACE PROJECTION</span>
            </div>

            <div className="flex-1 border border-neutral-800/40 relative rounded bg-neutral-950/20 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-[0.03] border-collapse">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-neutral-400" />
                ))}
              </div>
              <div className="absolute inset-x-0 h-[1px] bg-neutral-500/10" />
              <div className="absolute inset-y-0 w-[1px] bg-neutral-500/10" />

              {documents.map((doc) => {
                const [x, y] = getCoords(doc);
                const leftPercent = ((x + 1) / 2) * 80 + 10;
                const topPercent = ((y + 1) / 2) * 80 + 10;
                
                // Highlight search results or selected doc
                const isMatched = retrievedResults?.sources?.some((s: any) => s.id === doc.id);
                const isSelected = selectedDoc?.id === doc.id;

                return (
                  <div
                    key={doc.id}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-amber-400 border-amber-300 ring-4 ring-amber-500/30 scale-125'
                          : isMatched
                          ? 'bg-emerald-400 border-emerald-300 ring-4 ring-emerald-500/25 scale-125'
                          : 'bg-indigo-500 border-indigo-400 hover:bg-white'
                      }`}
                    />
                    <div className="absolute left-1/2 -bottom-7 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[9.5px] font-mono text-neutral-300 whitespace-nowrap pointer-events-none select-none z-20 shadow-md">
                      {doc.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RAG search responses box */}
          <div className={`md:col-span-5 p-6 border rounded-xl flex flex-col h-[350px] transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
            <div className="flex items-center gap-2 border-b pb-3 mb-3 select-none">
              <Database className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">RAG Semantic Match</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11.5px] pr-1.5">
              {isSearching ? (
                <p className="opacity-40 italic text-center py-12">Generating query embedding. Mapping vector distances...</p>
              ) : retrievedResults ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded p-2 text-emerald-400">
                    <span>Relevance Confidence:</span>
                    <span className="font-bold">{(retrievedResults.confidence * 100).toFixed(1)}%</span>
                  </div>

                  <div className="p-2.5 bg-[#0C0C0C] border border-neutral-800 rounded leading-relaxed text-neutral-300 whitespace-pre-line">
                    {retrievedResults.text}
                  </div>

                  {retrievedResults.sources?.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase font-bold">Retrieved Segments</span>
                      {retrievedResults.sources.map((s: any, idx: number) => (
                        <div key={idx} className="flex justify-between p-1 border border-neutral-800/40 rounded bg-neutral-900 text-[10.5px]">
                          <span className="truncate">{s.name}</span>
                          <span className="text-emerald-400 shrink-0 font-bold">{(s.relevance * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 opacity-50 py-12">
                  <Globe className="w-6 h-6 mb-1.5" />
                  <span>Execute a semantic vector search to check RAG retrieval streams.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Master Ingestion Collections Directory list */}
        <div className={`p-6 border rounded-xl flex flex-col transition-all duration-300 ${isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'}`}>
          <div className="flex items-center justify-between border-b pb-3.5 mb-3.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-neutral-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-neutral-400">CORTEX VECTOR COLLECTIONS</h3>
            </div>
            <span className="text-[10px] font-mono opacity-50">{documents.length} Collections Active</span>
          </div>

          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-xs font-mono opacity-40 text-center py-6">No collections ingested in Cortex registry.</p>
            ) : (
              documents.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(isSelected ? null : doc)}
                    className={`p-3.5 rounded border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/5'
                        : isDark
                        ? 'bg-[#0E0E0E] border-white/5 hover:border-neutral-800'
                        : 'bg-neutral-50 border-black/5 hover:border-neutral-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2 font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-bold text-xs truncate">{doc.name}</span>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 capitalize">{doc.format}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleReindexDoc(doc.id, e)}
                          className="p-1 text-neutral-500 hover:text-white rounded transition-colors"
                          title="Reindex embeddings"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteDoc(doc.id, e)}
                          className="p-1 text-neutral-500 hover:text-red-400 rounded transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-sans text-neutral-400 leading-relaxed line-clamp-2 mb-3">
                      {doc.content}
                    </p>

                    {/* Metadata summary on click / focus */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/40 text-[10.5px] font-mono space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-neutral-400">
                          <div>
                            <span className="opacity-45 block">DOC ID</span>
                            <span className="font-bold text-white truncate block">{doc.id}</span>
                          </div>
                          <div>
                            <span className="opacity-45 block">CHECKSUM</span>
                            <span className="font-bold text-white truncate block">{doc.metadata?.checksum || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="opacity-45 block">UPLOAD TIME</span>
                            <span className="font-bold text-white block">{doc.metadata?.uploadTime ? new Date(doc.metadata.uploadTime).toLocaleString() : 'N/A'}</span>
                          </div>
                          <div>
                            <span className="opacity-45 block">CHUNKS INDEXED</span>
                            <span className="font-bold text-white block">{doc.chunks?.length || 0} chunks</span>
                          </div>
                          <div>
                            <span className="opacity-45 block">LANGUAGE</span>
                            <span className="font-bold text-white block uppercase">{doc.metadata?.language || 'EN'}</span>
                          </div>
                          <div>
                            <span className="opacity-45 block">PROJECT ROOT</span>
                            <span className="font-bold text-white block capitalize">{doc.metadata?.project || 'default'}</span>
                          </div>
                        </div>

                        {/* Version history */}
                        {doc.versionHistory && doc.versionHistory.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[9px] uppercase font-bold text-neutral-500 block mb-1">Version History Log</span>
                            <div className="space-y-1">
                              {doc.versionHistory.map((v, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10px] bg-[#0A0A0A] p-1.5 rounded border border-neutral-800/40">
                                  <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-neutral-500" />
                                    <span>v{v.version}</span>
                                    <span className="opacity-40">by {v.author}</span>
                                  </div>
                                  <span className="opacity-50">{new Date(v.updatedAt).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-[9px] font-mono opacity-50 select-none">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CORTEX STATUS: READY • {doc.chunks?.length || 0} VECTORS ACTIVE</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
