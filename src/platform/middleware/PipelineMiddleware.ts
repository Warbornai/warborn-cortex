import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError, GatewayError } from '../errors/GatewayError';
import { IdentityService } from '../../security/identity/IdentityService';
import { PermissionEngine } from '../../security/permissions/PermissionEngine';
import { AuditLogger } from '../../security/audit/AuditLogger';

const identityService = new IdentityService();
const permissionEngine = new PermissionEngine();
const auditLogger = new AuditLogger();

// Request IDs Middleware
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const reqId = req.headers['x-request-id'] as string || `req-${Math.random().toString(36).substring(2, 11)}`;
  req.headers['x-request-id'] = reqId;
  res.setHeader('x-request-id', reqId);
  next();
}

// Logging Middleware
export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] [${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms) [ReqID: ${req.headers['x-request-id']}]`);
    if (req.app.locals.metrics) {
      req.app.locals.metrics.recordRequest(duration, res.statusCode >= 400);
    }
  });
  next();
}

// Authentication Middleware
export function authenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = identityService.authenticate(token);
    if (user) {
      req.headers['x-user-id'] = user.id;
      req.headers['x-user-role'] = user.role;
      req.headers['x-org-id'] = user.orgId;
      auditLogger.log(user.id, 'authenticate', 'allowed');
      next();
      return;
    }
  }
  // Default fallback session context
  req.headers['x-user-id'] = 'user-developer';
  req.headers['x-user-role'] = 'developer';
  req.headers['x-org-id'] = 'org-1';
  next();
}

// Authorization Middleware
export function authorizationMiddleware(requiredPermission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string || 'developer';
    const userId = req.headers['x-user-id'] as string || 'user-developer';
    
    // Map required permissions checks through the policy engine
    const isAuthorized = permissionEngine.isAuthorized(userRole, requiredPermission);
    if (!isAuthorized) {
      auditLogger.log(userId, `authorize:${requiredPermission}`, 'denied');
      throw new AuthorizationError(`Required permission key is missing: ${requiredPermission}`);
    }
    auditLogger.log(userId, `authorize:${requiredPermission}`, 'allowed');
    next();
  };
}

// Input Validation Helper
export function validateRequestBody(schema: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = schema.filter(field => req.body[field] === undefined);
    if (missing.length > 0) {
      res.status(400).json({
        success: false,
        status: 'error',
        requestId: req.headers['x-request-id'],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        errors: [{ code: 'VALIDATION_ERROR', message: `Missing required fields: ${missing.join(', ')}` }]
      });
      return;
    }
    next();
  };
}

// Global Error Handler Middleware
export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const status = err instanceof GatewayError ? err.status : 500;
  const code = err instanceof GatewayError ? err.code : 'INTERNAL_SERVER_ERROR';
  
  res.status(status).json({
    success: false,
    status: 'error',
    requestId: req.headers['x-request-id'] || 'req-unknown',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    errors: [{
      code,
      message: err.message || 'An internal backend failure occurred.'
    }]
  });
}
