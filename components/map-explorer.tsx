'use client';

import { Suspense, useEffect, useState } from 'react';
import { Map, useMap } from '@vis.gl/react-google-maps';
import { LogIn, MapPin, UserRoundPen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGeolocation } from '@/lib/use-geolocation';
import { usersQueryOptions } from '@/lib/users-query-options';
import { upsertUserLocation } from '@/lib/actions';
import { userQueryOptions } from '@/lib/user-query-options';
import { UserLocationMarker } from './user-location-marker';
import { UsernameEditorDialog } from './username-editor-dialog';
import { CurrentLocationMarker } from './current-location-marker';
import invariant from 'tiny-invariant';

export function MapExplorer() {
  const { data: userLocations } = useQuery(usersQueryOptions);
  const { data: myUsername } = useQuery(userQueryOptions);

  const { latitude, longitude } = useGeolocation();
  const map = useMap();

  const [selectedUsername, setSelectedUsername] = useState<string>();

  const navigateToUser = () => {
    const destination = userLocations?.find(
      (user) => user.name === selectedUsername
    );
    invariant(destination, 'Expected destination to be defined');
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  useEffect(() => {
    if (latitude && longitude) {
      map?.panTo({ lat: latitude, lng: longitude });
    }
  }, [map, latitude, longitude]);

  useEffect(() => {
    if (!latitude || !longitude || !myUsername) return;
    void upsertUserLocation({ latitude, longitude });
    const id = setInterval(() => {
      if (latitude && longitude && myUsername) {
        void upsertUserLocation({ latitude, longitude });
      }
    }, 1000 * 60);
    return () => clearInterval(id);
  }, [latitude, longitude, myUsername]);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-1 h-full">
        <Map
          mapId="main-map"
          style={{ width: '100%', height: '100%' }}
          defaultCenter={{ lat: 0, lng: 0 }}
          defaultZoom={15}
        >
          {userLocations
            ?.filter((user) => user.name !== myUsername)
            .map((location) => (
              <UserLocationMarker
                key={location.id}
                location={location}
                onClick={() => setSelectedUsername(location.name)}
                isHighlighted={location.name === selectedUsername}
                onNavigate={() => {
                  if (
                    window.confirm(
                      `คุณต้องเปิด Google Maps เพื่อนำทางให้หา ${location.name} ใช่หรือไม่?`
                    )
                  ) {
                    navigateToUser();
                  }
                }}
              />
            ))}
          <Suspense fallback={null}>
            <CurrentLocationMarker />
          </Suspense>
        </Map>
      </div>
      <div className="shrink-0 px-2 pt-2 pb-5 flex space-x-3 justify-between">
        <Button
          size="lg"
          className="flex-1 relative overflow-hidden group bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 shadow-lg transition-all duration-300 ease-in-out transform"
          onClick={() => {
            if (latitude && longitude) {
              map?.panTo({ lat: latitude, lng: longitude });
            }
          }}
        >
          <span className="relative z-10 flex items-center justify-center">
            <MapPin className="w-5 h-5 mr-2" />
            <span>ตำแหน่งปัจจุบัน</span>
          </span>
        </Button>
        <UsernameEditorDialog>
          <Button size="lg" className="flex-1">
            {myUsername ? (
              <p className="flex items-center space-x-2">
                <UserRoundPen className="w-5 h-5" />
                <span>{myUsername}</span>
              </p>
            ) : (
              <p className="flex items-center space-x-2">
                <LogIn className="w-5 h-5" />
                <span>เข้าสู่ระบบ</span>
              </p>
            )}
          </Button>
        </UsernameEditorDialog>
      </div>
    </div>
  );
}
