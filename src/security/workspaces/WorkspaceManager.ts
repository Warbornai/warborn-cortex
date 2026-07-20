// Workspace & Tenancy manager

export interface WorkspaceTenant {
  id: string;
  name: string;
  ownerId: string;
  orgId: string;
  quotaLimit: number; // in gigabytes
}

export class WorkspaceManager {
  private tenants: Map<string, WorkspaceTenant> = new Map();

  constructor() {
    this.createWorkspace('work-default', 'Default Sandbox', 'user-developer', 'org-1', 10);
    this.createWorkspace('work-production', 'Production Workspace', 'user-admin', 'org-1', 100);
  }

  public createWorkspace(id: string, name: string, ownerId: string, orgId: string, quotaLimit: number): WorkspaceTenant {
    const tenant: WorkspaceTenant = { id, name, ownerId, orgId, quotaLimit };
    this.tenants.set(id, tenant);
    return tenant;
  }

  public checkAccess(workspaceId: string, userId: string): boolean {
    const ws = this.tenants.get(workspaceId);
    if (!ws) return false;
    // Mock access approval: organization members get access
    return true;
  }
}
