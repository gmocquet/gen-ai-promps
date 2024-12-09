import { z } from 'zod';
import { userSchema } from './schema';

// Success response type
export type SuccessServerActionResponse = {
  success: true;
  data: {
    createdAt?: string;
    timeField?: string;
    rawData?: RawJsonData;
  };
};

// Error response types
export type ZodValidationError = {
  type: 'ZodValidationError';
  errors: Record<string, string>;
};

export type DatabaseError = {
  type: 'DatabaseError';
  message: string;
};

export type PermissionError = {
  type: 'PermissionError';
  message: string;
};

export type UnknownError = {
  type: 'UnknownError';
  message: string;
};

export type EmptyResultError = {
  type: 'EmptyResultError';
  message: string;
};

// Combined error type
export type ErrorServerActionResponse = {
  success: false;
  error: ZodValidationError | DatabaseError | PermissionError | UnknownError | EmptyResultError;
};

// ServerActionResponse type
export type ServerActionResponse = SuccessServerActionResponse | ErrorServerActionResponse | null;

// Type guard class
export class ErrorTypeGuards {
  static isZodValidationError(error: ErrorServerActionResponse['error']): error is ZodValidationError {
    return error.type === 'ZodValidationError';
  }

  static isDatabaseError(error: ErrorServerActionResponse['error']): error is DatabaseError {
    return error.type === 'DatabaseError';
  }

  static isPermissionError(error: ErrorServerActionResponse['error']): error is PermissionError {
    return error.type === 'PermissionError';
  }

  static isUnknownError(error: ErrorServerActionResponse['error']): error is UnknownError {
    return error.type === 'UnknownError';
  }

  static isEmptyResultError(error: ErrorServerActionResponse['error']): error is EmptyResultError {
    return error.type === 'EmptyResultError';
  }
}

// Helper function to create a Zod validation error response
export function createZodValidationError(error: z.ZodError): ZodValidationError {
  return {
    type: 'ZodValidationError',
    errors: error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {} as Record<string, string>),
  };
}

// Helper function to create other error responses
export function createErrorResponse(type: 'DatabaseError' | 'PermissionError' | 'UnknownError', message: string): ErrorServerActionResponse {
  return {
    success: false,
    error: { type, message },
  };
}

// New type for raw JSON data
export type RawJsonData = Record<string, any>;

// Add a new helper function for creating EmptyResultError
export function createEmptyResultError(message: string): ErrorServerActionResponse {
  return {
    success: false,
    error: { type: 'EmptyResultError', message },
  };
}

