'use client';

import { MapExplorer } from '@/components/map-explorer';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function App() {
  return (
    <APIProvider apiKey="AIzaSyBhEuOGTG-czR_U9BN9hnGAw0y2Lf-JX-M">
      <Suspense fallback={null}>
        <MapExplorer />
      </Suspense>
    </APIProvider>
  );
}
