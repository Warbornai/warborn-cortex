// Collaboration Presence & Locking Manager

export interface UserPresence {
  userId: string;
  name: string;
  cursor?: { x: number; y: number };
  activeWorkspace?: string;
  lastActive: string;
}

export class CollaborationManager {
  private presences: Map<string, UserPresence> = new Map();
  private resourceLocks: Map<string, string> = new Map(); // resourceId -> userId

  public updatePresence(userId: string, name: string, cursor?: { x: number; y: number }, activeWorkspace?: string): UserPresence {
    const presence: UserPresence = {
      userId,
      name,
      cursor,
      activeWorkspace,
      lastActive: new Date().toISOString()
    };
    this.presences.set(userId, presence);
    return presence;
  }

  public listActiveUsers(): UserPresence[] {
    return Array.from(this.presences.values());
  }

  public lockResource(resourceId: string, userId: string): boolean {
    if (this.resourceLocks.has(resourceId) && this.resourceLocks.get(resourceId) !== userId) {
      return false; // resource is locked by another user
    }
    this.resourceLocks.set(resourceId, userId);
    return true;
  }

  public unlockResource(resourceId: string, userId: string): void {
    if (this.resourceLocks.get(resourceId) === userId) {
      this.resourceLocks.delete(resourceId);
    }
  }
}
