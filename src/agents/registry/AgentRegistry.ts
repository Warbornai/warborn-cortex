// Dynamic Agent Registry
import { Agent } from '@warborn/types';

export class AgentRegistry {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    const roles = [
      'Architecture', 'Research', 'Coding', 'Documentation',
      'Testing', 'Review', 'Security', 'Deployment', 'Design',
      'Analysis', 'Planning', 'General Assistant'
    ];

    roles.forEach((role, i) => {
      const id = role.toLowerCase().replace(' ', '-');
      this.register({
        id,
        name: `${role} Agent`,
        description: `Specialized agent focused on ${role} streams.`,
        role: id,
        icon: 'Cpu',
        model: 'gemini-3.5-flash',
        tools: ['fs-reader', 'terminal-compiler'],
        status: 'idle'
      });
    });
  }

  public register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  public list(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }
}
