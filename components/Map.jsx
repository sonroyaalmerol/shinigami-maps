import React from 'react'
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import * as turf from "@turf/turf";

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const center = {
    lat: 7.076674, // Initial position (same as target for demonstration)
    lng: 125.597120,
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY
    })

    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        map.setOptions({
            streetViewControl: false,
            tilt: 0,
            rotateControl: false,
            mapTypeId: "satellite",
            mapTypeControl: false,
            fullscreenControl: false,
        })

        setMap(map)
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])


    const [target, setTarget] = React.useState(null)

    const onTargetLoad = React.useCallback(function callback(target) {
        setTarget(target)
    }, [])
    const onTargetUnmount = React.useCallback(function callback(target) {
        setTarget(null)
    }, [])

    // State for the target's position
    const [targetPosition, setTargetPosition] = React.useState({
        lat: 7.076674,
        lng: 125.597120,
    });

    const [centerPosition, setCenterPosition] = React.useState({
        lat: 7.076674,
        lng: 125.597120,
    });

    const [heading, setHeading] = React.useState(0);

    // Function to calculate the initial bearing between two points on Earth
    const calculateInitialBearing = (pointA, pointB) => {
        const from = turf.point([pointA.lng, pointA.lat]);
        const to = turf.point([pointB.lng, pointB.lat]);

        const options = { units: "degrees" };

        return turf.bearing(from, to, options);
    }

    const [arrowRotation, setArrowRotation] = React.useState(45);

    React.useEffect(() => {
        const initialBearing = calculateInitialBearing(centerPosition, targetPosition);
        setArrowRotation(initialBearing);
    }, [centerPosition, targetPosition, map]);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onCenterChanged={() => {
                if (map) {
                    const newCenter = map.getCenter();
                    setCenterPosition({
                        lat: newCenter.lat(),
                        lng: newCenter.lng(),
                    });
                }
            }}
            onHeadingChanged={() => {
                if (map) {
                    const newHeading = map.getHeading();
                    setHeading(newHeading);
                }
            }}
        >
            { /* Child components, such as markers, info windows, etc. */}
            <Marker
                onLoad={onTargetLoad}
                onUnmount={onTargetUnmount}
                position={targetPosition}
            />

            {/* Person Marker */}
            {/* Dynamic Arrow (You may need to style this) */}
            <div
                className="arrow"
                style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
                    left: "50%",
                    top: "50%",
                    width: "0",
                    height: "0",
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderBottom: "20px solid red", // Adjust the color and size as needed
                }}
            ></div>

            {/* Dotted line*/}
            <Polyline
                path={[centerPosition, targetPosition]}
                options={{
                    strokeColor: "black",
                    strokeOpacity: 0.5,
                    strokeWeight: 2,
                    icons: [
                        {
                            icon: {
                                path: "M 0,-1 0,1",
                                strokeOpacity: 1,
                                scale: 4,
                            },
                            offset: "0",
                            repeat: "20px",
                        },
                    ],
                }}
            />

            {/* Distance and degrees east and west between person and target */}
            {/* The text style will be white-colored with black border */}
            <div
                className="distance"
                style={{
                    position: "absolute",
                    transform: `translate(-50%, -50%)`,
                    left: "50%",
                    top: "55%",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "0 0 10px black",
                    textAlign: "center",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
            >
                {turf.distance(
                    [centerPosition.lng, centerPosition.lat],
                    [targetPosition.lng, targetPosition.lat],
                    { units: "meters" }
                ).toFixed(2)}{" "}
                meters away
            </div>
        </GoogleMap>
    ) : <></>
}

export default React.memo(MyComponent)