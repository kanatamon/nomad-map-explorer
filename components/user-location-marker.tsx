import { UserLocation } from '@/app/users-query-options';
import { AdvancedMarker } from '@vis.gl/react-google-maps';

export function UserLocationMarker({ location }: { location: UserLocation }) {
  return (
    <AdvancedMarker position={location}>
      <div className="relative">
        <figure className="flex flex-col items-center absolute -translate-x-1/2 -translate-y-full">
          <figcaption
            className="px-2 p-1 text-white rounded-sm text-sm"
            style={{ backgroundColor: location.identifierColor }}
          >
            <p className="flex items-center space-x-1">
              <span className="rounded-full bg-green-300 w-2 h-2 border-neutral-900 border" />
              <span>{location.username}</span>
            </p>
          </figcaption>
          <span
            role="img"
            aria-label="map-pin"
            className=""
            style={{
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderTopColor: location.identifierColor,
              borderTopWidth: 16,
              borderRightWidth: 4,
              borderBottomWidth: 0,
              borderLeftWidth: 4,
            }}
          />
        </figure>
      </div>
    </AdvancedMarker>
  );
}
