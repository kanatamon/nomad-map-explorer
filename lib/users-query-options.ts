import { queryOptions } from '@tanstack/react-query';
import { getUserLocations } from './actions';

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: () => getUserLocations(),
  refetchInterval: 1000 * 10,
});
