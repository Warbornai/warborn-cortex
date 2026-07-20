// RBAC Permission Engine

export type PlatformRole =
  | 'owner'
  | 'administrator'
  | 'manager'
  | 'developer'
  | 'designer'
  | 'analyst'
  | 'member'
  | 'guest';

export class PermissionEngine {
  private rolePermissions: Map<PlatformRole, string[]> = new Map();

  constructor() {
    this.rolePermissions.set('administrator', ['*']);
    this.rolePermissions.set('developer', ['workspace:read', 'project:read', 'project:write', 'agent:execute', 'ai:completions']);
    this.rolePermissions.set('designer', ['workspace:read', 'tokens:read', 'tokens:write']);
  }

  public isAuthorized(role: string, permission: string): boolean {
    const pRole = role.toLowerCase() as PlatformRole;
    const permissions = this.rolePermissions.get(pRole) || [];
    
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  }
}
