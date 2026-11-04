import { describe, expect, it } from 'vitest';

import { ApiError } from './errors';

describe('ApiError', () => {
  it('uses the ErrorResponse message', () => {
    const error = new ApiError(404, {
      statusCode: 404,
      message: 'Item not found',
      detail: null,
    });
    expect(error.message).toBe('Item not found');
    expect(error.body?.statusCode).toBe(404);
  });

  it('falls back when the body is not an ErrorResponse', () => {
    const error = new ApiError(502, 'Bad Gateway');
    expect(error.message).toBe('Request failed with status 502');
    expect(error.body).toBeUndefined();
  });
});
