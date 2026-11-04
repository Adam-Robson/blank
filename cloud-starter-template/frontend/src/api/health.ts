import { useQuery } from '@tanstack/react-query';

import { useApiClient } from './context';
import { unwrap } from './errors';

export function useHealth() {
  const client = useApiClient();
  return useQuery({
    queryKey: ['health'],
    queryFn: () => unwrap(client.GET('/api/health')),
  });
}
