// Dynamic Mission Orchestration Engine
import { Mission, MissionWorkflow, MissionNode } from '@warborn/types';
import { AgentRegistry } from '../registry/AgentRegistry';
import { WorkflowEngine } from '../workflows/WorkflowEngine';
import { CommunicationProtocol } from '../communication/CommunicationProtocol';

export class MissionEngine {
  private registry: AgentRegistry;
  private workflow: WorkflowEngine;
  private bus: CommunicationProtocol;
  private missions: Mission[] = [];

  constructor() {
    this.registry = new AgentRegistry();
    this.workflow = new WorkflowEngine();
    this.bus = new CommunicationProtocol();
  }

  public async createAndRunMission(name: string, objective: string): Promise<Mission> {
    const workflow: MissionWorkflow = {
      id: `wf-${Math.random().toString(36).substring(2, 11)}`,
      name: `Workflow for: ${name}`,
      version: '1.0.0',
      nodes: [
        { id: 'step-1', label: 'Plan Stage', type: 'sequential', status: 'pending', assignedAgent: 'planning-agent' },
        { id: 'step-2', label: 'Research Stage', type: 'sequential', status: 'pending', assignedAgent: 'research-agent' },
        { id: 'step-3', label: 'Code Implementation', type: 'sequential', status: 'pending', assignedAgent: 'coding-agent' }
      ],
      edges: [
        { from: 'step-1', to: 'step-2' },
        { from: 'step-2', to: 'step-3' }
      ]
    };

    const mission: Mission = {
      id: `mis-${Math.random().toString(36).substring(2, 11)}`,
      name,
      description: objective,
      state: 'planning',
      priority: 'medium',
      workflow,
      triggers: [],
      approvals: [],
      artifacts: [],
      progress: 0,
      currentStepIndex: 0,
      tokensUsed: 0,
      cost: 0,
      latency: 0,
      retries: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logs: ['Mission initialization request registered.']
    };

    this.missions.push(mission);

    // Asynchronously run workflow tasks in background
    this.workflow.executeWorkflow(workflow, async (step) => {
      const agentId = step.assignedAgent || 'general-assistant';
      this.bus.send('mission-engine', agentId, 'execute-task', { step, objective });
      return `Agent ${agentId} completed stage ${step.label} successfully.`;
    }).then(updatedWf => {
      const isFailed = updatedWf.nodes.some(n => n.status === 'failed');
      mission.state = isFailed ? 'failed' : 'completed';
      mission.progress = isFailed ? 33 : 100;
      mission.updatedAt = new Date().toISOString();
      mission.logs.push(`Mission execution ended with state: ${mission.state}`);
      console.log(`[MISSION END] Mission ${mission.id} state updated to: ${mission.state}`);
    });

    return mission;
  }

  public listMissions(): Mission[] {
    return this.missions;
  }
}
