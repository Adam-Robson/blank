import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useApiClient } from './context';
import { unwrap } from './errors';
import type { CreateItem } from './types';

const itemsKey = ['items'] as const;

export function useItems(page: number, pageSize: number) {
  const client = useApiClient();
  return useQuery({
    queryKey: [...itemsKey, { page, pageSize }],
    queryFn: () =>
      unwrap(
        client.GET('/api/items', { params: { query: { page, pageSize } } }),
      ),
    placeholderData: keepPreviousData,
  });
}

export function useCreateItem() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateItem) =>
      unwrap(client.POST('/api/items', { body })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey }),
  });
}

export function useDeleteItem() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) =>
      unwrap(
        client.DELETE('/api/items/{item_id}', {
          params: { path: { item_id: itemId } },
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKey }),
  });
}
