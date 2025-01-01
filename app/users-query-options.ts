import { queryOptions } from '@tanstack/react-query';
import { getUserLocations } from './actions';

export type UserLocation = {
  id: number;
  username: string;
  lat: number;
  lng: number;
  updatedAt: number;
  identifierColor: string;
};

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: () => getUserLocations(),
});
