import { useGeolocation } from '@/lib/use-geolocation';
import { userQueryOptions } from '@/lib/user-query-options';
import { useSuspenseQuery } from '@tanstack/react-query';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Navigation2, CircleAlert } from 'lucide-react';

export function CurrentLocationMarker() {
  const { latitude, longitude } = useGeolocation();
  const { data: myUsername } = useSuspenseQuery(userQueryOptions);

  if (!latitude || !longitude) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: latitude,
        lng: longitude,
      }}
    >
      <div className="relative">
        {myUsername ? (
          <Navigation2
            fill="#4f46e5"
            className="w-8 h-8 text-blue-500 absolute -translate-x-1/2 -translate-y-1/2"
          />
        ) : (
          <div className="text-white bg-red-500 p-3 rounded-md text-sm text-center">
            <CircleAlert className="w-5 h-5 inline-block mb-3" />
            <p>กรุณาเข้าสู่ระบบ</p>
            <p>เพื่อแชร์ตำแหน่งปัจจุบันของคุณ</p>
          </div>
        )}
      </div>
    </AdvancedMarker>
  );
}
