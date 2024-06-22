import axios from "axios";
import { useEffect, useState } from "react";
import { Polyline, useMapEvents } from "react-leaflet";

export function RoadLine() {
  const [pointA, setPointA] = useState<any>([
    40.885759144134646, 45.25398025512696,
  ]);
  const [pointB, setPointB] = useState<any>([
    40.885759144134646, 45.15398025512696,
  ]);
  const [route, setRoute] = useState([]);

  useMapEvents({
    click(e) {
      const { lat, lng }: any = e.latlng;
      if (!pointA) {
        setPointA({ lat, lng });
      } else if (!pointB) {
        setPointB({ lat, lng });
      } else {
        setPointA({ lat, lng });
        setPointB(null);
        setRoute([]);
      }
    },
  });

  useEffect(() => {
    if (pointA && pointB) {
      const fetchRoute = async () => {
        try {
          const response = await axios.get(
            `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62485c3bffef8324c8b1b6c76f6b5b6e78f8&start=${pointA.lng},${pointA.lat}&end=${pointB.lng},${pointB.lat}`
          );
          const coordinates =
            response.data.features[0].geometry.coordinates.map((coord: any) => [
              coord[1],
              coord[0],
            ]);
          setRoute(coordinates);
        } catch (error) {
          console.error("Error fetching route:", error);
        }
      };

      fetchRoute();
    }
  }, [pointA, pointB]);

  return route.length > 0 && <Polyline positions={route} color="red" />;
}
