import { queryOptions } from '@tanstack/react-query';
import { getLoggedInUsername } from './actions';

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: () => getLoggedInUsername(),
});
