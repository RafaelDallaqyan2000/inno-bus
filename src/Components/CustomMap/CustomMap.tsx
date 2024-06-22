import { useCallback, useEffect, useState } from "react";
import "./customMapStyle.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import myLocationIcon from "../../icons/my-location.svg";
import "leaflet/dist/leaflet.css";
import { fixedRoadLine, getAllRoads } from "../../services/getAllRoads";
import { getAllCarsCoordinate } from "../../services/getAllCarsCoordinate";

// Fix default icon issue
// delete L.Icon.Default.prototype._get;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const SetViewOnLocation = ({ coords }: any) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 13);
    }
  }, [coords, map]);

  return null;
};

const markerIcon: any = new L.Icon({
  iconUrl: require("../../icons/markerIcon.png"),
  iconSize: [35, 40],
});

const carIcon: any = new L.Icon({
  iconUrl: require("../../icons/carIcon.png"),
  iconSize: [40, 40],
});

const startLocationIcon: any = new L.Icon({
  iconUrl: require("../../icons/endLocation.jpg"),
  iconSize: [30, 40],
});
const endLocationIcon: any = new L.Icon({
  iconUrl: require("../../icons/startLocation.png"),
  iconSize: [30, 40],
});

export const CustomMap = () => {
  const [position, setPosition] = useState<any>(null);
  const [carPosition, setCarPosition] = useState<any>(null);
  const [roads, setRoads] = useState([]);

  const onPressLocationBtn = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
      },
      (err) => {
        console.error(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const handleGetAllCars = useCallback(
    (cars: any) => {
      const { latitude, longitude } = cars[0].location;
      setCarPosition({
        lat: latitude,
        lng: longitude,
      });
    },
    [carPosition]
  );

  useEffect(() => {
    getAllRoads(position, setRoads);
  }, [position]);

  useEffect(() => {
    onPressLocationBtn();
    getAllCarsCoordinate(handleGetAllCars);

    const interval = setInterval(getAllCarsCoordinate, 3000);

    // Cleanup function to clear interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && (
          <>
            <Marker icon={markerIcon} position={[position.lat, position.lng]}>
              <Popup>You are here</Popup>
            </Marker>
            {carPosition && (
              <Marker
                icon={carIcon}
                position={[carPosition.lat, carPosition.lng]}
              >
                <Popup>Car is here</Popup>
              </Marker>
            )}
            {carPosition &&
              roads.map((road, idx) => (
                <Polyline
                  key={idx}
                  positions={road}
                  //   eventHandlers={{ click: handlePolylineClick }}
                  color="rgba(0,0,0,0)"
                />
              ))}
            {roads.map((road, idx) => (
              <Polyline key={idx} positions={road} color="rgba(0,0,0,0)" />
            ))}
          </>
        )}

        <SetViewOnLocation coords={position} />
        {/* <RoadLine /> */}

        {fixedRoadLine.length > 0 && (
          <>
            <Marker
              icon={startLocationIcon}
              position={[fixedRoadLine[0][0], fixedRoadLine[0][1]]}
            >
              <Popup>From</Popup>
            </Marker>
            <Marker
              icon={endLocationIcon}
              position={[
                fixedRoadLine[fixedRoadLine.length - 1][0],
                fixedRoadLine[fixedRoadLine.length - 1][1],
              ]}
            >
              <Popup>From</Popup>
            </Marker>
            <Polyline positions={fixedRoadLine} color="blue" />
          </>
        )}
      </MapContainer>
      <button className="locationBtn" onClick={onPressLocationBtn}>
        <img width={20} height={20} src={myLocationIcon} />
      </button>
    </div>
  );
};
