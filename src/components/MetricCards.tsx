import { SystemMetric } from '../types';
import { Cpu, DollarSign, Activity, Database, Flame } from 'lucide-react';

interface MetricCardsProps {
  metrics: SystemMetric;
  isDark: boolean;
}

export default function MetricCards({ metrics, isDark }: MetricCardsProps) {
  const cards = [
    {
      id: 'metric-cost',
      title: 'INTELLIGENCE ACCRUED COST',
      value: `$${metrics.totalCost.toFixed(5)}`,
      sub: `${metrics.requestCount} query dispatches`,
      icon: DollarSign,
      color: 'text-emerald-500',
    },
    {
      id: 'metric-tokens',
      title: 'COMPUTE TOKEN FLOW',
      value: metrics.totalTokens.toLocaleString(),
      sub: `P: ${metrics.promptTokens.toLocaleString()} | G: ${metrics.generationTokens.toLocaleString()} | R: ${metrics.reasoningTokens.toLocaleString()}`,
      icon: Cpu,
      color: 'text-neutral-400',
    },
    {
      id: 'metric-latency',
      title: 'DISPATCH AVG LATENCY',
      value: `${metrics.latencyAvg.toFixed(0)}ms`,
      sub: 'Dynamic provider routing delay',
      icon: Activity,
      color: 'text-blue-400',
    },
    {
      id: 'metric-cache',
      title: 'CONTEXT CACHE STABILIZATION',
      value: `${(metrics.cacheHitRate * 100).toFixed(1)}%`,
      sub: 'L1 Semantic Cache Hits',
      icon: Database,
      color: 'text-amber-500',
    },
  ];

  return (
    <div id="telemetry-dashboard-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`p-4 border rounded-lg transition-all duration-300 ${
              isDark
                ? 'bg-[#141414] border-[rgba(255,255,255,0.05)] text-[#EDEDED]'
                : 'bg-white border-[rgba(0,0,0,0.05)] text-[#18181B]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] tracking-wider font-semibold opacity-60 uppercase mono-text`}>
                {card.title}
              </span>
              <IconComponent className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1 font-display">
              {card.value}
            </div>
            <div className="text-xs opacity-50 font-medium">
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
