import { createContext, useContext } from 'react';

import type { ApiClient } from './client';

export const ApiContext = createContext<ApiClient | null>(null);

export function useApiClient(): ApiClient {
  const client = useContext(ApiContext);
  if (client === null) {
    throw new Error('useApiClient must be used inside <ApiProvider>');
  }
  return client;
}
