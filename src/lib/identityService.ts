// In-Memory Identity and Enterprise State Manager for Multi-Tenancy and Secure Ingress

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'guest';

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'dark' | 'light';
  notificationSettings: {
    email: boolean;
    push: boolean;
    weeklyDigest: boolean;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  billingStatus: 'active' | 'trial' | 'unpaid';
  domains: string[];
  workspaceDefaults: {
    maxUsers: number;
    defaultRole: UserRole;
  };
  ownerId: string;
  members: Array<{
    userId: string;
    role: UserRole;
  }>;
}

export interface Workspace {
  id: string;
  orgId: string;
  name: string;
  description: string;
  projectIds: string[];
  documentIds: string[];
  memoryIds: string[];
  researchIds: string[];
  artifactIds: string[];
  missionIds: string[];
  createdAt: string;
}

export interface Invitation {
  id: string;
  email: string;
  orgId: string;
  workspaceId: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  expiresAt: string;
}

export interface Device {
  id: string;
  userId: string;
  name: string;
  ip: string;
  location: string;
  lastActive: string;
}

export interface Session {
  token: string;
  userId: string;
  refreshToken: string;
  expiresAt: string;
}

export interface Comment {
  id: string;
  workspaceId: string;
  targetId: string; // e.g. project_id, doc_id
  targetType: 'project' | 'document' | 'memory' | 'mission';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  resource: string;
  ip: string;
  device: string;
  timestamp: string;
  workspaceId?: string;
}

export interface Presence {
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  activeWorkspaceId: string;
  lastActive: string;
  status: 'online' | 'idle' | 'offline';
}

// In-Memory Database Store
class IdentityDatabase {
  public users: Map<string, UserProfile & { passwordHash: string }> = new Map();
  public organizations: Map<string, Organization> = new Map();
  public workspaces: Map<string, Workspace> = new Map();
  public invitations: Map<string, Invitation> = new Map();
  public devices: Map<string, Device[]> = new Map();
  public sessions: Map<string, Session> = new Map();
  public comments: Comment[] = [];
  public auditLogs: AuditLog[] = [];
  public presenceMap: Map<string, Presence> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 1. Seed default user (matching the existing email callmepnj@gmail.com)
    const userId = 'usr_warborn_lead';
    this.users.set(userId, {
      id: userId,
      email: 'callmepnj@gmail.com',
      username: 'callmepnj',
      displayName: 'Lead Architect',
      passwordHash: 'warborn_password_hash', // In production, we'd hash, but simple string is safe for this setup
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      bio: 'Lead Architect and Core Node Administrator for Warborn AI Operations.',
      mfaEnabled: true,
      mfaSecret: 'JBSWY3DPEHPK3PXP',
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        theme: 'dark',
        notificationSettings: {
          email: true,
          push: true,
          weeklyDigest: false
        }
      },
      createdAt: new Date().toISOString()
    });

    // 2. Seed generic members
    const user2Id = 'usr_dev_omega';
    this.users.set(user2Id, {
      id: user2Id,
      email: 'omega.dev@warborn.ai',
      username: 'dev_omega',
      displayName: 'Omega Developer',
      passwordHash: 'omega_password',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      bio: 'Cortex L2 Memory systems dev.',
      mfaEnabled: false,
      preferences: {
        language: 'en',
        timezone: 'UTC',
        theme: 'dark',
        notificationSettings: {
          email: true,
          push: false,
          weeklyDigest: true
        }
      },
      createdAt: new Date().toISOString()
    });

    // 2.5 Seed secure temporary testing account
    const userTempId = 'usr_temp_tester';
    this.users.set(userTempId, {
      id: userTempId,
      email: 'test@warborn.ai',
      username: 'temp_tester',
      displayName: 'QA Tester',
      passwordHash: 'SecureTest123!',
      avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&w=100&q=80',
      bio: 'Temporary secure QA testing account.',
      mfaEnabled: false,
      preferences: {
        language: 'en',
        timezone: 'America/New_York',
        theme: 'dark',
        notificationSettings: {
          email: true,
          push: true,
          weeklyDigest: false
        }
      },
      createdAt: new Date().toISOString()
    });

    // 3. Seed Organizations
    const orgId = 'org_warborn_corp';
    this.organizations.set(orgId, {
      id: orgId,
      name: 'Warborn Systems',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      billingStatus: 'active',
      domains: ['warborn.ai', 'systems.warborn'],
      workspaceDefaults: {
        maxUsers: 50,
        defaultRole: 'member'
      },
      ownerId: userId,
      members: [
        { userId: userId, role: 'owner' },
        { userId: user2Id, role: 'manager' },
        { userId: userTempId, role: 'member' }
      ]
    });

    const org2Id = 'org_alpha_inc';
    this.organizations.set(org2Id, {
      id: org2Id,
      name: 'Alpha Enterprise',
      logo: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=100&q=80',
      billingStatus: 'trial',
      domains: ['alpha.io'],
      workspaceDefaults: {
        maxUsers: 10,
        defaultRole: 'guest'
      },
      ownerId: user2Id,
      members: [
        { userId: user2Id, role: 'owner' }
      ]
    });

    // 4. Seed Workspaces
    const ws1Id = 'ws_production_core';
    this.workspaces.set(ws1Id, {
      id: ws1Id,
      orgId: orgId,
      name: 'Production Core',
      description: 'The primary staging area for Cortex node execution pipelines.',
      projectIds: ['proj_1', 'proj_2'],
      documentIds: ['doc_1', 'doc_2'],
      memoryIds: ['mem_1', 'mem_2', 'mem_3'],
      researchIds: ['res_1'],
      artifactIds: ['art_1'],
      missionIds: [],
      createdAt: new Date().toISOString()
    });

    const ws2Id = 'ws_sandbox_labs';
    this.workspaces.set(ws2Id, {
      id: ws2Id,
      orgId: orgId,
      name: 'Sandbox Labs',
      description: 'Experimental cluster for fine-tuning routing endpoints.',
      projectIds: [],
      documentIds: [],
      memoryIds: [],
      researchIds: [],
      artifactIds: [],
      missionIds: [],
      createdAt: new Date().toISOString()
    });

    // 5. Seed Device logs
    this.devices.set(userId, [
      { id: 'dev_osx_chrome', userId, name: 'MacBook Pro (Chrome)', ip: '127.0.0.1', location: 'New York, US', lastActive: new Date().toISOString() },
      { id: 'dev_ios_safari', userId, name: 'iPhone 15 (Safari)', ip: '192.168.1.50', location: 'New York, US', lastActive: new Date().toISOString() }
    ]);

    // 6. Seed Invitations
    const invId = 'inv_test_invite';
    this.invitations.set(invId, {
      id: invId,
      email: 'partner@corporation.com',
      orgId: orgId,
      workspaceId: ws1Id,
      role: 'member',
      status: 'pending',
      invitedBy: userId,
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days expiration
    });

    // 7. Seed Comments
    this.comments.push({
      id: 'com_1',
      workspaceId: ws1Id,
      targetId: 'proj_1',
      targetType: 'project',
      authorId: user2Id,
      authorName: 'Omega Developer',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      text: 'I suggest bumping security policy verification rules next deploy.',
      timestamp: new Date().toISOString()
    });

    // 8. Seed Audit Logs
    this.auditLogs.push(
      { id: 'aud_seed_1', userId, email: 'callmepnj@gmail.com', action: 'Login', resource: 'user_auth', ip: '127.0.0.1', device: 'MacBook Pro', timestamp: new Date().toISOString() },
      { id: 'aud_seed_2', userId, email: 'callmepnj@gmail.com', action: 'WorkspaceCreated', resource: 'ws_production_core', ip: '127.0.0.1', device: 'MacBook Pro', timestamp: new Date().toISOString() }
    );

    // 9. Seed Presences
    this.presenceMap.set(userId, {
      userId,
      username: 'callmepnj',
      displayName: 'Lead Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      activeWorkspaceId: ws1Id,
      lastActive: new Date().toISOString(),
      status: 'online'
    });

    this.presenceMap.set(user2Id, {
      userId: user2Id,
      username: 'dev_omega',
      displayName: 'Omega Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      activeWorkspaceId: ws1Id,
      lastActive: new Date().toISOString(),
      status: 'online'
    });
  }

  // Helpers for RBAC checks
  public getRoleInOrg(userId: string, orgId: string): UserRole {
    const org = this.organizations.get(orgId);
    if (!org) return 'guest';
    const membership = org.members.find(m => m.userId === userId);
    return membership ? membership.role : 'guest';
  }

  public logAction(userId: string, email: string, action: string, resource: string, workspaceId?: string) {
    const log: AuditLog = {
      id: `aud_${Math.random().toString(36).substring(2, 8)}`,
      userId,
      email,
      action,
      resource,
      ip: '127.0.0.1',
      device: 'Cortex Desktop Node Client',
      timestamp: new Date().toISOString(),
      workspaceId
    };
    this.auditLogs.unshift(log);
    // Keep last 100 logs
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }
  }
}

export const db = new IdentityDatabase();
