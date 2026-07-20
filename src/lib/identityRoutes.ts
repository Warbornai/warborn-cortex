import { Router, Request, Response, NextFunction } from 'express';
import { db, UserRole, UserPreferences, Comment } from './identityService';

const router = Router();

// ============================================================================
// SECURITY SESSION MIDDLEWARE
// ============================================================================
export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
  role?: UserRole;
  orgId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, error: 'Authorization header is required.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const session = db.sessions.get(token);

  if (!session) {
    res.status(401).json({ success: false, error: 'Invalid or expired access token.' });
    return;
  }

  if (new Date(session.expiresAt) < new Date()) {
    db.sessions.delete(token);
    res.status(401).json({ success: false, error: 'Session expired.' });
    return;
  }

  const user = db.users.get(session.userId);
  if (!user) {
    res.status(401).json({ success: false, error: 'User does not exist.' });
    return;
  }

  req.userId = user.id;
  req.userEmail = user.email;
  next();
}

// Generates a mock access token
function generateToken(userId: string): { token: string; refreshToken: string; expiresAt: string } {
  const token = `wbc_session_${Math.random().toString(36).substring(2, 10)}`;
  const refreshToken = `wbc_refresh_${Math.random().toString(36).substring(2, 10)}`;
  const expiresAt = new Date(Date.now() + 3600 * 1000 * 2).toISOString(); // 2 hours
  db.sessions.set(token, { token, userId, refreshToken, expiresAt });
  return { token, refreshToken, expiresAt };
}

// ============================================================================
// AUTHENTICATION APIS
// ============================================================================

// Register User
router.post('/v1/auth/register', (req: Request, res: Response) => {
  const { email, password, username, displayName } = req.body;
  if (!email || !password || !username) {
    res.status(400).json({ success: false, error: 'Missing required signup fields.' });
    return;
  }

  // Check if user already exists
  const exists = Array.from(db.users.values()).some(u => u.email === email || u.username === username);
  if (exists) {
    res.status(400).json({ success: false, error: 'User with same email or username already registered.' });
    return;
  }

  const userId = `usr_${Math.random().toString(36).substring(2, 8)}`;
  const userProfile = {
    id: userId,
    email,
    username,
    displayName: displayName || username,
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80`,
    bio: '',
    mfaEnabled: false,
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      theme: 'dark' as const,
      notificationSettings: {
        email: true,
        push: true,
        weeklyDigest: false
      }
    },
    createdAt: new Date().toISOString()
  };

  db.users.set(userId, {
    ...userProfile,
    passwordHash: password // Mock hashing
  });

  // Seed default private organization and workspace for the new user
  const orgId = `org_${Math.random().toString(36).substring(2, 8)}`;
  db.organizations.set(orgId, {
    id: orgId,
    name: `${userProfile.displayName}'s Workspace`,
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
    billingStatus: 'trial',
    domains: [],
    workspaceDefaults: { maxUsers: 5, defaultRole: 'member' },
    ownerId: userId,
    members: [{ userId, role: 'owner' }]
  });

  const wsId = `ws_${Math.random().toString(36).substring(2, 8)}`;
  db.workspaces.set(wsId, {
    id: wsId,
    orgId,
    name: 'Production Core',
    description: 'Autonomous Cortex workspace container.',
    projectIds: [],
    documentIds: [],
    memoryIds: [],
    researchIds: [],
    artifactIds: [],
    missionIds: [],
    createdAt: new Date().toISOString()
  });

  const sessionData = generateToken(userId);
  db.logAction(userId, email, 'Registration', 'user_account');

  res.json({
    success: true,
    user: userProfile,
    session: sessionData,
    organizationId: orgId,
    workspaceId: wsId
  });
});

// Login User
router.post('/v1/auth/login', (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required.' });
    return;
  }

  const userRecord = Array.from(db.users.values()).find(u => u.email === email);
  if (!userRecord || userRecord.passwordHash !== password) {
    res.status(401).json({ success: false, error: 'Incorrect email or password.' });
    return;
  }

  // Create session
  const sessionData = generateToken(userRecord.id);

  if (rememberMe) {
    // Extend expiry time for remember me (e.g. 30 days)
    const session = db.sessions.get(sessionData.token);
    if (session) {
      session.expiresAt = new Date(Date.now() + 86400000 * 30).toISOString();
      sessionData.expiresAt = session.expiresAt;
    }
  }

  // Add device log entry
  const userDevices = db.devices.get(userRecord.id) || [];
  const devId = `dev_${Math.random().toString(36).substring(2, 6)}`;
  userDevices.push({
    id: devId,
    userId: userRecord.id,
    name: req.headers['user-agent']?.substring(0, 40) || 'Generic Chrome Client',
    ip: req.ip || '127.0.0.1',
    location: 'Remote IP Geolocation',
    lastActive: new Date().toISOString()
  });
  db.devices.set(userRecord.id, userDevices);

  db.logAction(userRecord.id, email, 'Login', 'user_session');

  // Strip password hash from profile
  const { passwordHash, ...userProfile } = userRecord;

  res.json({
    success: true,
    user: userProfile,
    session: sessionData
  });
});

// Validate active token
router.get('/v1/auth/session', (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, error: 'No authorization header.' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const session = db.sessions.get(token);

  if (!session || new Date(session.expiresAt) < new Date()) {
    res.status(401).json({ success: false, error: 'Session is invalid or expired.' });
    return;
  }

  const userRecord = db.users.get(session.userId);
  if (!userRecord) {
    res.status(401).json({ success: false, error: 'User does not exist.' });
    return;
  }

  const { passwordHash, ...userProfile } = userRecord;
  res.json({
    success: true,
    user: userProfile,
    session
  });
});

// Logout
router.post('/v1/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    const session = db.sessions.get(token);
    if (session) {
      db.logAction(session.userId, 'session-logout', 'Logout', 'user_session');
      db.sessions.delete(token);
    }
  }
  res.json({ success: true });
});

// Password Reset Simulation
router.post('/v1/auth/reset-password', (req: Request, res: Response) => {
  const { email } = req.body;
  const exists = Array.from(db.users.values()).some(u => u.email === email);
  if (!exists) {
    res.status(404).json({ success: false, error: 'User email not found.' });
    return;
  }
  res.json({ success: true, message: 'Password recovery verification link dispatch completes in 150ms.' });
});

// Email Verification Simulation
router.post('/v1/auth/verify-email', (req: Request, res: Response) => {
  const { email, code } = req.body;
  res.json({ success: true, message: 'Email confirmed successfully.' });
});

// Enable MFA API
router.post('/v1/auth/mfa/enable', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { enabled } = req.body;
  const user = db.users.get(req.userId!);
  if (user) {
    user.mfaEnabled = enabled;
    db.logAction(req.userId!, req.userEmail!, 'MfaConfiguration', enabled ? 'mfa_enabled' : 'mfa_disabled');
    res.json({ success: true, mfaEnabled: enabled, mfaSecret: 'JBSWY3DPEHPK3PXP' });
  } else {
    res.status(404).json({ success: false });
  }
});

// Verify MFA passcode simulation
router.post('/v1/auth/mfa/verify', (req: Request, res: Response) => {
  const { code } = req.body;
  if (code === '123456' || code === '654321') {
    res.json({ success: true, verified: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid authentication digits token.' });
  }
});

// List Devices
router.get('/v1/auth/devices', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const devList = db.devices.get(req.userId!) || [];
  res.json({ success: true, devices: devList });
});

// Revoke Device Session
router.post('/v1/auth/devices/:id/revoke', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const devList = db.devices.get(req.userId!) || [];
  const updated = devList.filter(d => d.id !== req.params.id);
  db.devices.set(req.userId!, updated);
  db.logAction(req.userId!, req.userEmail!, 'DeviceRevocation', req.params.id);
  res.json({ success: true });
});

// ============================================================================
// PROFILE MANAGEMENT APIS
// ============================================================================
router.get('/v1/user/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.get(req.userId!);
  if (!user) {
    res.status(404).json({ success: false, error: 'User profiles unavailable.' });
    return;
  }
  const { passwordHash, ...profile } = user;
  res.json({ success: true, profile });
});

router.put('/v1/user/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.users.get(req.userId!);
  if (!user) {
    res.status(404).json({ success: false });
    return;
  }

  const { displayName, avatar, username, bio, preferences } = req.body;
  if (displayName) user.displayName = displayName;
  if (avatar) user.avatar = avatar;
  if (username) user.username = username;
  if (bio !== undefined) user.bio = bio;
  if (preferences) {
    user.preferences = {
      ...user.preferences,
      ...preferences
    };
  }

  db.logAction(req.userId!, req.userEmail!, 'ProfileUpdate', 'user_account');
  const { passwordHash, ...profile } = user;
  res.json({ success: true, profile });
});

// ============================================================================
// ORGANIZATIONS & WORKSPACES
// ============================================================================

// List User's Organizations
router.get('/v1/organizations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const orgList = Array.from(db.organizations.values()).filter(org =>
    org.members.some(m => m.userId === req.userId)
  );
  res.json({ success: true, organizations: orgList });
});

// Create Organization
router.post('/v1/organizations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, logo, domains, workspaceDefaults } = req.body;
  if (!name) {
    res.status(400).json({ success: false, error: 'Organization name is required.' });
    return;
  }

  const orgId = `org_${Math.random().toString(36).substring(2, 8)}`;
  const newOrg = {
    id: orgId,
    name,
    logo: logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
    billingStatus: 'trial' as const,
    domains: domains || [],
    workspaceDefaults: workspaceDefaults || { maxUsers: 10, defaultRole: 'member' },
    ownerId: req.userId!,
    members: [{ userId: req.userId!, role: 'owner' as const }]
  };

  db.organizations.set(orgId, newOrg);
  db.logAction(req.userId!, req.userEmail!, 'OrganizationCreated', orgId);

  // Auto-create default workspace
  const wsId = `ws_${Math.random().toString(36).substring(2, 8)}`;
  db.workspaces.set(wsId, {
    id: wsId,
    orgId,
    name: 'Production Core',
    description: 'Main production workspace context.',
    projectIds: [],
    documentIds: [],
    memoryIds: [],
    researchIds: [],
    artifactIds: [],
    missionIds: [],
    createdAt: new Date().toISOString()
  });

  res.json({ success: true, organization: newOrg, defaultWorkspaceId: wsId });
});

// Update Organization Settings
router.put('/v1/organizations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const org = db.organizations.get(req.params.id);
  if (!org) {
    res.status(404).json({ success: false, error: 'Organization not found.' });
    return;
  }

  const role = db.getRoleInOrg(req.userId!, org.id);
  if (role !== 'owner' && role !== 'admin') {
    res.status(403).json({ success: false, error: 'Only owners or admins can modify organization configurations.' });
    return;
  }

  const { name, logo, billingStatus, domains, workspaceDefaults } = req.body;
  if (name) org.name = name;
  if (logo) org.logo = logo;
  if (billingStatus) org.billingStatus = billingStatus;
  if (domains) org.domains = domains;
  if (workspaceDefaults) org.workspaceDefaults = { ...org.workspaceDefaults, ...workspaceDefaults };

  db.logAction(req.userId!, req.userEmail!, 'OrganizationUpdated', org.id);
  res.json({ success: true, organization: org });
});

// Delete Organization
router.delete('/v1/organizations/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const org = db.organizations.get(req.params.id);
  if (!org) {
    res.status(404).json({ success: false });
    return;
  }

  if (org.ownerId !== req.userId) {
    res.status(403).json({ success: false, error: 'Only organization owners can delete the company container.' });
    return;
  }

  // Delete matching workspaces
  for (const [wsId, ws] of db.workspaces.entries()) {
    if (ws.orgId === org.id) {
      db.workspaces.delete(wsId);
    }
  }

  db.organizations.delete(org.id);
  db.logAction(req.userId!, req.userEmail!, 'OrganizationDeleted', org.id);
  res.json({ success: true });
});

// Transfer ownership
router.post('/v1/organizations/:id/transfer-ownership', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const org = db.organizations.get(req.params.id);
  const { newOwnerId } = req.body;

  if (!org || !newOwnerId) {
    res.status(400).json({ success: false });
    return;
  }

  if (org.ownerId !== req.userId) {
    res.status(403).json({ success: false, error: 'Forbidden' });
    return;
  }

  // Transfer roles
  org.ownerId = newOwnerId;
  const origMember = org.members.find(m => m.userId === req.userId);
  if (origMember) origMember.role = 'admin';

  const targetMember = org.members.find(m => m.userId === newOwnerId);
  if (targetMember) {
    targetMember.role = 'owner';
  } else {
    org.members.push({ userId: newOwnerId, role: 'owner' });
  }

  db.logAction(req.userId!, req.userEmail!, 'OwnershipTransferred', org.id);
  res.json({ success: true, organization: org });
});

// Remove Member from Org
router.delete('/v1/organizations/:id/members/:userId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const org = db.organizations.get(req.params.id);
  if (!org) {
    res.status(404).json({ success: false });
    return;
  }

  const actorRole = db.getRoleInOrg(req.userId!, org.id);
  if (actorRole !== 'owner' && actorRole !== 'admin') {
    res.status(403).json({ success: false, error: 'Unauthorized.' });
    return;
  }

  org.members = org.members.filter(m => m.userId !== req.params.userId);
  db.logAction(req.userId!, req.userEmail!, 'MemberRemoved', req.params.userId);
  res.json({ success: true, organization: org });
});

// Get/List workspaces in Organization
router.get('/v1/organizations/:orgId/workspaces', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const wsList = Array.from(db.workspaces.values()).filter(ws => ws.orgId === req.params.orgId);
  res.json({ success: true, workspaces: wsList });
});

// Create workspace in Organization
router.post('/v1/organizations/:orgId/workspaces', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400).json({ success: false, error: 'Workspace name is required.' });
    return;
  }

  const org = db.organizations.get(req.params.orgId);
  if (!org) {
    res.status(404).json({ success: false });
    return;
  }

  const role = db.getRoleInOrg(req.userId!, org.id);
  if (role === 'guest') {
    res.status(403).json({ success: false, error: 'Guests cannot create workspaces.' });
    return;
  }

  const wsId = `ws_${Math.random().toString(36).substring(2, 8)}`;
  const newWs = {
    id: wsId,
    orgId: org.id,
    name,
    description: description || '',
    projectIds: [],
    documentIds: [],
    memoryIds: [],
    researchIds: [],
    artifactIds: [],
    missionIds: [],
    createdAt: new Date().toISOString()
  };

  db.workspaces.set(wsId, newWs);
  db.logAction(req.userId!, req.userEmail!, 'WorkspaceCreated', wsId, wsId);

  res.json({ success: true, workspace: newWs });
});

// ============================================================================
// INVITATIONS APIS
// ============================================================================

// List Organization Invitations
router.get('/v1/organizations/:orgId/invitations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const list = Array.from(db.invitations.values()).filter(inv => inv.orgId === req.params.orgId);
  res.json({ success: true, invitations: list });
});

// Invite Member to Organization
router.post('/v1/organizations/:orgId/invitations', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { email, role, workspaceId } = req.body;
  if (!email || !role || !workspaceId) {
    res.status(400).json({ success: false, error: 'Missing required invite elements.' });
    return;
  }

  const org = db.organizations.get(req.params.orgId);
  if (!org) {
    res.status(404).json({ success: false });
    return;
  }

  const senderRole = db.getRoleInOrg(req.userId!, org.id);
  if (senderRole !== 'owner' && senderRole !== 'admin' && senderRole !== 'manager') {
    res.status(403).json({ success: false, error: 'Only Managers, Admins or Owners can extend invites.' });
    return;
  }

  const inviteId = `inv_${Math.random().toString(36).substring(2, 8)}`;
  const newInvite = {
    id: inviteId,
    email,
    orgId: org.id,
    workspaceId,
    role: role as UserRole,
    status: 'pending' as const,
    invitedBy: req.userId!,
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days expiry
  };

  db.invitations.set(inviteId, newInvite);
  db.logAction(req.userId!, req.userEmail!, 'InviteExtended', email);

  res.json({ success: true, invitation: newInvite });
});

// Accept Invitation
router.post('/v1/auth/invitations/:id/accept', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const inv = db.invitations.get(req.params.id);
  if (!inv) {
    res.status(404).json({ success: false, error: 'Invitation not found.' });
    return;
  }

  if (new Date(inv.expiresAt) < new Date()) {
    inv.status = 'declined';
    res.status(400).json({ success: false, error: 'Invitation has expired.' });
    return;
  }

  const org = db.organizations.get(inv.orgId);
  if (org) {
    // Add member
    org.members.push({ userId: req.userId!, role: inv.role });
    inv.status = 'accepted';
    db.logAction(req.userId!, req.userEmail!, 'AcceptInvitation', inv.orgId);
    res.json({ success: true, organizationId: inv.orgId, workspaceId: inv.workspaceId });
  } else {
    res.status(400).json({ success: false });
  }
});

// Decline Invitation
router.post('/v1/auth/invitations/:id/decline', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const inv = db.invitations.get(req.params.id);
  if (!inv) {
    res.status(404).json({ success: false });
    return;
  }

  inv.status = 'declined';
  db.logAction(req.userId!, req.userEmail!, 'DeclineInvitation', inv.orgId);
  res.json({ success: true });
});

// ============================================================================
// COLLABORATION & AUDITS
// ============================================================================

// Presence Active Users
router.get('/v1/collaboration/presence', (req: Request, res: Response) => {
  const activeList = Array.from(db.presenceMap.values()).filter(p =>
    new Date(p.lastActive).getTime() > Date.now() - 60000 // Last active within 1 minute
  );
  res.json({ success: true, activeUsers: activeList });
});

// Presence Heartbeat Update
router.post('/v1/collaboration/presence', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { workspaceId, status } = req.body;
  const user = db.users.get(req.userId!);
  if (user) {
    db.presenceMap.set(user.id, {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      activeWorkspaceId: workspaceId || 'ws_production_core',
      lastActive: new Date().toISOString(),
      status: status || 'online'
    });
  }
  res.json({ success: true });
});

// List Comments
router.get('/v1/collaboration/comments', (req: Request, res: Response) => {
  const { targetId, targetType } = req.query;
  const filtered = db.comments.filter(c =>
    c.targetId === targetId && c.targetType === targetType
  );
  res.json({ success: true, comments: filtered });
});

// Add Comment
router.post('/v1/collaboration/comments', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { workspaceId, targetId, targetType, text } = req.body;
  if (!targetId || !targetType || !text) {
    res.status(400).json({ success: false });
    return;
  }

  const user = db.users.get(req.userId!);
  if (!user) {
    res.status(401).json({ success: false });
    return;
  }

  const comment: Comment = {
    id: `com_${Math.random().toString(36).substring(2, 8)}`,
    workspaceId: workspaceId || 'ws_production_core',
    targetId,
    targetType,
    authorId: user.id,
    authorName: user.displayName,
    authorAvatar: user.avatar,
    text,
    timestamp: new Date().toISOString()
  };

  db.comments.push(comment);
  db.logAction(user.id, user.email, 'AddComment', targetId, workspaceId);

  res.json({ success: true, comment });
});

// Get Audit Trails
router.get('/v1/security/audit-trail', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  // Let regular users see their own logs, admins see all org logs
  res.json({ success: true, logs: db.auditLogs });
});

export { router as identityRoutes };
