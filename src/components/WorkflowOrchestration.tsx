import { useState } from 'react';
import { Workflow, LogEntry } from '../types';
import { Network, Play, CheckCircle2, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react';

interface WorkflowOrchestrationProps {
  workflows: Workflow[];
  onAddLog: (log: LogEntry) => void;
  isDark: boolean;
}

export default function WorkflowOrchestration({ workflows, onAddLog, isDark }: WorkflowOrchestrationProps) {
  const [activeWorkflows, setActiveWorkflows] = useState<Workflow[]>(workflows);
  const [selectedWfId, setSelectedWfId] = useState<string>(workflows[0]?.id || '');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const selectedWf = activeWorkflows.find((w) => w.id === selectedWfId);

  const handleRunWorkflow = () => {
    if (!selectedWf || isRunning) return;

    setIsRunning(true);
    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'AGENT',
      message: `Workflow initiated: '${selectedWf.name}'`,
    });

    // Reset step states to pending, and set workflow status to running
    let currentWfState: Workflow = { ...selectedWf, status: 'running' };
    currentWfState.steps = currentWfState.steps.map((s) => ({ ...s, status: 'pending' as const }));
    updateWorkflowInState(currentWfState);

    // sequential execution simulation
    let stepIndex = 0;

    const runNextStep = () => {
      if (stepIndex >= currentWfState.steps.length) {
        // Complete workflow
        currentWfState.status = 'completed';
        updateWorkflowInState({ ...currentWfState });
        setIsRunning(false);
        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'info',
          module: 'AGENT',
          message: `Workflow completed successfully: '${selectedWf.name}'`,
        });
        return;
      }

      // Mark current step as running
      currentWfState.steps = currentWfState.steps.map((s, idx) => {
        if (idx === stepIndex) {
          return { ...s, status: 'running' as const };
        }
        return s;
      });
      updateWorkflowInState({ ...currentWfState });

      const currentStep = currentWfState.steps[stepIndex];
      onAddLog({
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'AGENT',
        message: `Executing stage [${stepIndex + 1}/${currentWfState.steps.length}]: ${currentStep.name} -> ${currentStep.action}`,
      });

      // simulate computational delay
      setTimeout(() => {
        // Mark current step as completed
        currentWfState.steps = currentWfState.steps.map((s, idx) => {
          if (idx === stepIndex) {
            return { ...s, status: 'completed' as const };
          }
          return s;
        });
        updateWorkflowInState({ ...currentWfState });

        onAddLog({
          timestamp: new Date().toISOString(),
          level: 'trace',
          module: 'ROUTER',
          message: `Stage complete: ${currentStep.name}. Metrics verified.`,
        });

        stepIndex++;
        runNextStep();
      }, 2000);
    };

    runNextStep();
  };

  const updateWorkflowInState = (updatedWf: Workflow) => {
    setActiveWorkflows((prev) => prev.map((w) => (w.id === updatedWf.id ? updatedWf : w)));
  };

  const handleResetWorkflow = () => {
    if (isRunning) return;
    if (!selectedWf) return;

    const resetWf = {
      ...selectedWf,
      status: 'idle' as const,
      steps: selectedWf.steps.map((s) => ({ ...s, status: 'pending' as const })),
    };
    updateWorkflowInState(resetWf);

    onAddLog({
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'AGENT',
      message: `Reset pipeline state parameters: '${selectedWf.name}'`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Workflow Selection List */}
      <div className="lg:col-span-5 space-y-4">
        <div
          className={`p-6 border rounded-xl transition-all duration-300 ${
            isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
          }`}
        >
          <div className="flex items-center gap-2 mb-3 select-none">
            <Network className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider mono-text text-neutral-400">
              ORCHESTRATOR COMPILATION PIPELINES
            </h3>
          </div>

          <div className="space-y-2.5">
            {activeWorkflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => !isRunning && setSelectedWfId(wf.id)}
                disabled={isRunning}
                className={`w-full p-3 border rounded text-left transition-all duration-300 select-none ${
                  selectedWfId === wf.id
                    ? isDark
                      ? 'border-neutral-400 bg-neutral-800/10'
                      : 'border-neutral-500 bg-neutral-100'
                    : 'border-neutral-800/40 hover:border-neutral-600 bg-transparent'
                } ${isRunning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs truncate max-w-[200px]">{wf.name}</span>
                  <span
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded border leading-3 uppercase mono-text ${
                      wf.status === 'completed'
                        ? 'text-emerald-400 bg-emerald-950/20 border-emerald-900/45'
                        : wf.status === 'running'
                        ? 'text-blue-400 bg-blue-950/20 border-blue-900/45 animate-pulse'
                        : 'text-neutral-400 bg-neutral-900/20 border-neutral-800/45'
                    }`}
                  >
                    {wf.status}
                  </span>
                </div>
                <p className="opacity-50 text-[11px] leading-relaxed line-clamp-2 font-sans">
                  {wf.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Execution Trace visualizer */}
      <div
        className={`lg:col-span-7 p-6 border rounded-xl flex flex-col h-[400px] transition-all duration-300 ${
          isDark ? 'bg-[#141414] border-white/5' : 'bg-white border-black/5'
        }`}
      >
        {selectedWf ? (
          <>
            {/* Steps Top Bar */}
            <div className={`flex items-center justify-between border-b pb-3.5 mb-4 select-none ${isDark ? 'border-white/5' : 'border-black/5'}`}>
              <div>
                <span className="text-[9px] mono-text opacity-40 uppercase font-semibold">Pipelines Step Trace:</span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">{selectedWf.name}</h3>
              </div>

              {/* Execution controllers */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleResetWorkflow}
                  disabled={isRunning || selectedWf.status === 'idle'}
                  className={`p-1.5 rounded border transition-colors flex items-center justify-center cursor-pointer ${
                    isRunning || selectedWf.status === 'idle'
                      ? 'opacity-40 border-neutral-800 text-neutral-600'
                      : isDark
                      ? 'border-neutral-700 hover:border-neutral-500 text-neutral-400'
                      : 'border-neutral-300 hover:border-neutral-400 text-neutral-600'
                  }`}
                  title="Reset Steps"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleRunWorkflow}
                  disabled={isRunning || selectedWf.status === 'completed'}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border cursor-pointer transition-all duration-300 ${
                    isRunning || selectedWf.status === 'completed'
                      ? 'opacity-40 border-neutral-800 text-neutral-600'
                      : 'border-neutral-600 hover:bg-neutral-800/40 text-neutral-300'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      RUNNING...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 text-neutral-400" />
                      INITIATED
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Linear Steps graph */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {selectedWf.steps.map((step, idx) => (
                <div key={step.id} className="relative flex gap-4 items-start group">
                  {/* Vertical connector line */}
                  {idx < selectedWf.steps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-[-20px] w-[1px] transition-colors duration-300 ${
                        step.status === 'completed' ? 'bg-emerald-500/40' : 'bg-neutral-800/40'
                      }`}
                    />
                  )}

                  {/* Icon step representation */}
                  <div
                    className={`w-7.5 h-7.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 z-10 select-none ${
                      step.status === 'completed'
                        ? 'bg-emerald-950/20 border-emerald-400 text-emerald-400'
                        : step.status === 'running'
                        ? 'bg-blue-950/20 border-blue-400 text-blue-400 animate-pulse'
                        : 'bg-neutral-950/25 border-neutral-800 text-neutral-500'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : step.status === 'running' ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span className="text-[10px] font-bold mono-text">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Description */}
                  <div
                    className={`flex-1 p-3 rounded border transition-all duration-300 ${
                      step.status === 'running'
                        ? 'bg-blue-950/5 border-blue-900/35'
                        : step.status === 'completed'
                        ? 'bg-emerald-950/5 border-emerald-900/30 opacity-80'
                        : 'bg-neutral-950/10 border-neutral-800/35 opacity-40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 select-none">
                      <span className="font-semibold text-xs tracking-wide">{step.name}</span>
                      <span className="text-[9px] mono-text opacity-40 uppercase">{step.status}</span>
                    </div>
                    <p className="opacity-60 text-[11px] leading-relaxed font-sans">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-2 opacity-50">
            <AlertCircle className="w-6 h-6" />
            <span className="text-xs">No compiled pipelines available.</span>
          </div>
        )}
      </div>
    </div>
  );
}
