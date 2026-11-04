import type { ErrorResponse } from './types';

function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'statusCode' in value &&
    'message' in value
  );
}

/**
 * Raised for any non-2xx response. `body` is the backend's ErrorResponse, or
 * undefined when something else (e.g. a proxy) produced the error.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ErrorResponse | undefined;

  constructor(status: number, error: unknown) {
    const body = isErrorResponse(error) ? error : undefined;
    super(body?.message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/** Mirrors openapi-fetch's result: exactly one of data or error is set. */
type ApiResult =
  | { data: unknown; error?: never; response: Response }
  | { data?: never; error: object | string; response: Response };

type Success<R extends ApiResult> = Extract<R, { error?: never }>;

function isSuccess<R extends ApiResult>(result: R): result is Success<R> {
  return result.error === undefined;
}

/** Returns the response data, or throws an ApiError on failure. */
export async function unwrap<R extends ApiResult>(
  request: Promise<R>,
): Promise<Success<R>['data']> {
  const result = await request;
  if (!isSuccess(result)) {
    throw new ApiError(result.response.status, result.error);
  }
  return result.data;
}
