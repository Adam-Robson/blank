import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

import type { ApiClient } from './client';
import { ApiContext } from './context';

interface ApiProviderProps {
  client: ApiClient;
  queryClient: QueryClient;
  children: ReactNode;
}

/** Supplies the API client and query cache; inject fakes in tests. */
export function ApiProvider({
  client,
  queryClient,
  children,
}: ApiProviderProps) {
  return (
    <ApiContext value={client}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ApiContext>
  );
}
