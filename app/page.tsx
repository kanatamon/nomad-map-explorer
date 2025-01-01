'use client';

import { MapExplorer } from '@/components/map-explorer';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { APIProvider } from '@vis.gl/react-google-maps';
import { getQueryClient } from './provider';
import { usersQueryOptions } from './users-query-options';
import { userQueryOptions } from './user-query-options';

export default function App() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(usersQueryOptions);
  void queryClient.prefetchQuery(userQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <APIProvider apiKey="AIzaSyBhEuOGTG-czR_U9BN9hnGAw0y2Lf-JX-M">
        <MapExplorer />
      </APIProvider>
    </HydrationBoundary>
  );
}
