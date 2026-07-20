import express, { Router, Request, Response, NextFunction } from 'express';
import { requestIdMiddleware, loggingMiddleware, authenticationMiddleware, globalErrorHandler } from '../middleware/PipelineMiddleware';
import { ServiceRegistry } from '../registry/ServiceRegistry';

export class PlatformGateway {
  public router: Router;
  private registry: ServiceRegistry;

  constructor() {
    this.router = Router();
    this.registry = new ServiceRegistry();
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.router.use(requestIdMiddleware);
    this.router.use(loggingMiddleware);
    this.router.use(authenticationMiddleware);
  }

  private setupRoutes(): void {
    // Gateway metadata
    this.router.get('/v1/gateway/metadata', (req: Request, res: Response) => {
      res.json({
        success: true,
        status: 'success',
        requestId: req.headers['x-request-id'],
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        data: {
          gateway: 'Warborn Enterprise Platform Ingress',
          services: this.registry.list(),
          uptime: process.uptime()
        }
      });
    });
  }

  // Standardization Envelope wrapper
  public standardizeResponse(req: Request, res: Response, data: any, status: number = 200): void {
    res.status(status).json({
      success: true,
      status: 'success',
      requestId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      data
    });
  }

  public mountErrorHandler(app: express.Application): void {
    app.use(globalErrorHandler);
  }
}
