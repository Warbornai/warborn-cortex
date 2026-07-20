// Identity & Session Manager

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  orgId: string;
}

export class IdentityService {
  private users: Map<string, UserProfile> = new Map();

  constructor() {
    this.register('user-admin', 'admin@warborn.com', 'System Admin', 'administrator', 'org-1');
    this.register('user-developer', 'dev@warborn.com', 'Alex Rivera', 'developer', 'org-1');
  }

  public register(id: string, email: string, name: string, role: string, orgId: string): UserProfile {
    const profile: UserProfile = { id, email, name, role, orgId };
    this.users.set(id, profile);
    return profile;
  }

  public authenticate(token: string): UserProfile | undefined {
    // Mock token inspection. e.g. token resolves to system users
    if (token.includes('admin')) {
      return this.users.get('user-admin');
    }
    return this.users.get('user-developer');
  }
}
