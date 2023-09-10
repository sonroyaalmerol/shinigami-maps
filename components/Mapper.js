import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { LIBRARIES } from "../utils/utils";
import { Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 7.076674,
  lng: 125.597120,
};

const targetPosition = {
  lat: 7.076674,
  lng: 125.597120,
};

function Mapper() {
  const libraries = LIBRARIES;
  const [zoom, setZoom] = useState(20);

  // State for the person's position
  const [personPosition, setPersonPosition] = useState({
    lat: 7.076674, // Initial position (same as target for demonstration)
    lng: 125.597120,
  });

  const bearing = React.useMemo(() => {
    // Function to calculate the bearing between two points
    const calculateBearing = (start, end) => {
      const lat1 = start.lat * (Math.PI / 180);
      const lon1 = start.lng * (Math.PI / 180);
      const lat2 = end.lat * (Math.PI / 180);
      const lon2 = end.lng * (Math.PI / 180);

      const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
      const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
      let brng = Math.atan2(y, x);
      brng = (brng * 180) / Math.PI;

      // Adjust the bearing to be between 0 and 360 degrees
      brng = (brng + 360) % 360;

      return brng;
    };

    const bearing = calculateBearing(personPosition, targetPosition)

    return { value: bearing, css: `rotate(${bearing}deg)` }
  }, [personPosition])

  useEffect(() => {
    // Update the person's position (simulate movement)
    const moveInterval = setInterval(() => {
      const speed = 0.0002; // Adjust as needed
      const newLat =
        personPosition.lat +
        speed * Math.cos((bearing.value * Math.PI) / 180);
      const newLng =
        personPosition.lng +
        speed * Math.sin((bearing.value * Math.PI) / 180);

      setPersonPosition({ lat: newLat, lng: newLng });
    }, 1000); // Update position every second

    return () => clearInterval(moveInterval); // Cleanup on unmount
  }, [personPosition]);

  return (
    <div className="">
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        libraries={libraries}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} options={{ zoom, setZoom, maxZoom: 21 }}>
          {/* Target Marker */}
          <Marker position={targetPosition} />

          {/* Person Marker */}
          <Marker position={personPosition} />

          {/* Dynamic Arrow (You may need to style this) */}
          <div
            className="arrow"
            style={{
              position: "absolute",
              transform: bearing.css, // Rotate the arrow based on bearing
              left: "50%",
              top: "50%",
              width: "20px",
              height: "20px",
              background: "red",
              borderRadius: "50%",
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Diamond shape
            }}
          ></div>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default Mapper;
