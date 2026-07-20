// AI Platform Error Models

export class AIPlatformError extends Error {
  public code: string;
  constructor(message: string, code: string = 'AI_INTERNAL_ERROR') {
    super(message);
    this.name = 'AIPlatformError';
    this.code = code;
  }
}

export class ProviderError extends AIPlatformError {
  constructor(message: string) {
    super(message, 'PROVIDER_FAILURE');
    this.name = 'ProviderError';
  }
}

export class ModelUnavailableError extends AIPlatformError {
  constructor(message: string) {
    super(message, 'MODEL_UNAVAILABLE');
    this.name = 'ModelUnavailableError';
  }
}

export class TimeoutError extends AIPlatformError {
  constructor(message: string = 'AI request timed out') {
    super(message, 'TIMEOUT');
    this.name = 'TimeoutError';
  }
}

export class RateLimitError extends AIPlatformError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends AIPlatformError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}
