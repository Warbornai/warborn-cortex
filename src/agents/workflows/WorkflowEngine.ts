// Workflow Execution Engine
import { MissionWorkflow, MissionNode } from '@warborn/types';

export class WorkflowEngine {
  public async executeWorkflow(workflow: MissionWorkflow, runStep: (step: MissionNode) => Promise<string>): Promise<MissionWorkflow> {
    console.log(`[WORKFLOW RUN] Executing workflow: ${workflow.name}`);

    for (const step of workflow.nodes) {
      step.status = 'running';
      
      try {
        await runStep(step);
        step.status = 'completed';
      } catch (err: any) {
        step.status = 'failed';
        return workflow;
      }
    }

    return workflow;
  }
}
