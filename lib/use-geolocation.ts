import { useState, useCallback, useEffect } from 'react';

type GeolocationState = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  const updateLocation = useCallback((position: GeolocationPosition) => {
    console.log(
      `[Geolocation] Updated location: ${position.coords.latitude}, ${position.coords.longitude}`
    );
    setLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      error: null,
    });
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    setLocation((prevState) => ({
      ...prevState,
      error: error.message,
    }));
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        error: 'Geolocation is not supported by your browser.',
      }));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );

    // Cleanup the watcher when the component unmounts
    return () => navigator.geolocation.clearWatch(watchId);
  }, [updateLocation, handleError]);

  return {
    latitude: location.latitude,
    longitude: location.longitude,
    error: location.error,
    state:
      location.latitude && location.longitude
        ? ('resolved' as const)
        : ('pending' as const),
  };
}
