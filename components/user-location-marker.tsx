import { cn } from '@/lib/utils';
import { UserLocation } from '@prisma/client';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Button } from './ui/button';
import { MapPinned } from 'lucide-react';

export function UserLocationMarker({
  location,
  onClick,
  onNavigate,
  isHighlighted,
}: {
  location: UserLocation;
  onClick?: () => void;
  onNavigate?: () => void;
  isHighlighted?: boolean;
}) {
  return (
    <AdvancedMarker
      position={{
        lat: location.latitude,
        lng: location.longitude,
      }}
      clickable
    >
      <div className="relative">
        <figure
          className={cn(
            'flex flex-col items-center absolute -translate-x-1/2 -translate-y-full'
          )}
          onClick={onClick}
          role="button"
        >
          <figcaption
            className="px-2 p-1 text-white rounded-sm text-sm flex flex-col items-center"
            style={{ backgroundColor: location.colorIdentifier }}
          >
            <p className="flex items-center space-x-1">
              <span className="rounded-full bg-green-300 w-2 h-2 border-neutral-900 border" />
              <span>{location.name}</span>
            </p>
            {isHighlighted && (
              <Button
                size="icon"
                variant="outline"
                className="m-2"
                onClick={onNavigate}
              >
                <MapPinned />
              </Button>
            )}
          </figcaption>
          <span
            role="img"
            aria-label="map-pin"
            className=""
            style={{
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: 'transparent',
              borderTopColor: location.colorIdentifier,
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
