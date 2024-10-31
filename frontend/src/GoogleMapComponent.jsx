import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const GoogleMapComponent = ({ markers }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "xx", // ใส่ API key ที่ถูกต้อง
  });

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      zoom={15}
      center={{ lat: 13.7563, lng: 100.5018 }}
    >
      {markers.map((marker, index) => (
        <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
