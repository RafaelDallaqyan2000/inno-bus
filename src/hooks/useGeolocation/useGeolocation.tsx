import { useEffect, useState } from "react";

type LocationType = {
  loaded: boolean;
  error?: any;
  coordinates?: {
    lat: string;
    lng: string;
  };
};

export function useGeolocation() {
  const [location, setLocation] = useState<any>({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  const onSuccess = (location: any) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: location?.coordinates?.lat,
        lng: location?.coordinates?.lng,
      },
    });
  };

  const onError = (error: any) => {
    setLocation({
      loaded: true,
      error,
      coordinates: {
        lat: 18.151658,
        lng: 35.515615,
      },
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation is not supported",
      });
    }
    console.log(location, "ddddddddddddd");

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
}
