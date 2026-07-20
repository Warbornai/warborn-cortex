// Base Gateway Error Hierarchy

export class GatewayError extends Error {
  public status: number;
  public code: string;
  constructor(message: string, status: number = 500, code: string = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = 'GatewayError';
    this.status = status;
    this.code = code;
  }
}

export class ValidationError extends GatewayError {
  public details: any;
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class AuthenticationError extends GatewayError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'UNAUTHENTICATED');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends GatewayError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'UNAUTHORIZED');
    this.name = 'AuthorizationError';
  }
}

export class ProviderError extends GatewayError {
  constructor(message: string) {
    super(message, 502, 'PROVIDER_PIPELINE_ERROR');
    this.name = 'ProviderError';
  }
}

export class NetworkError extends GatewayError {
  constructor(message: string) {
    super(message, 502, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends GatewayError {
  constructor(message: string = 'Gateway request timeout') {
    super(message, 504, 'GATEWAY_TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class RateLimitError extends GatewayError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends GatewayError {
  constructor(message: string = 'Internal backend failure') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends GatewayError {
  constructor(message: string = 'Service is currently unavailable') {
    super(message, 503, 'SERVICE_UNAVAILABLE');
    this.name = 'ServiceUnavailableError';
  }
}
