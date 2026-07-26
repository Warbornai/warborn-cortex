/**
 * Self-Contained Type Definitions for Warborn Cortex
 * Defines Agent, Mission, Knowledge, Memory, & Ecosystem Types.
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'BUSY' | 'PAUSED' | 'FAILED' | 'OFFLINE';
  avatar?: string;
  capabilities: string[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  progress: number;
  assignedAgentId?: string;
  createdAt: string;
}

export interface MissionNode {
  id: string;
  label: string;
  type: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface MissionWorkflow {
  id: string;
  name: string;
  nodes: MissionNode[];
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  content: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  type: 'EPISODIC' | 'SEMANTIC' | 'WORKING' | 'PROCEDURAL';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface CortexConfig {
  version: string;
  environment: string;
  primaryProvider: string;
}
