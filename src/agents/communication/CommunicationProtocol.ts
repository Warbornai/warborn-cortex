// Decoupled Agent Communication Broker

export interface AgentMessage {
  id: string;
  sender: string;
  recipient: string;
  topic: string;
  payload: any;
  timestamp: string;
}

export class CommunicationProtocol {
  private messages: AgentMessage[] = [];
  private listeners: Map<string, ((msg: AgentMessage) => void)[]> = new Map();

  public send(sender: string, recipient: string, topic: string, payload: any): void {
    const msg: AgentMessage = {
      id: `msg-${Math.random().toString(36).substring(2, 11)}`,
      sender,
      recipient,
      topic,
      payload,
      timestamp: new Date().toISOString()
    };
    this.messages.push(msg);
    console.log(`[AGENT BUS] [${topic}] ${sender} -> ${recipient}`);

    const recListeners = this.listeners.get(recipient) || [];
    recListeners.forEach(listener => listener(msg));
    
    const broadcastListeners = this.listeners.get('*') || [];
    broadcastListeners.forEach(listener => listener(msg));
  }

  public subscribe(recipient: string, callback: (msg: AgentMessage) => void): void {
    const list = this.listeners.get(recipient) || [];
    list.push(callback);
    this.listeners.set(recipient, list);
  }
}
