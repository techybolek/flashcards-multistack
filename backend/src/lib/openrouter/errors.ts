export enum ErrorCode {
  INVALID_REQUEST = 'INVALID_REQUEST',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  MODEL_UNAVAILABLE = 'MODEL_UNAVAILABLE',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED'
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

export class ErrorHandler {
  static handle(error: unknown): never {
    if (error instanceof OpenRouterError) {
      throw error;
    }
    
    if (error instanceof Error) {
      throw new OpenRouterError(
        error.message,
        ErrorCode.INVALID_RESPONSE,
        error
      );
    }
    
    throw new OpenRouterError(
      'An unknown error occurred',
      ErrorCode.INVALID_RESPONSE,
      error
    );
  }
} 