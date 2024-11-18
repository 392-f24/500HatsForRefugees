
// "AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c"
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 42.0451, // Latitude for Evanston, IL (ZIP code 60201)
  lng: -87.6877 // Longitude for Evanston, IL (ZIP code 60201)
};

const getZoomLevel = (radius) => {
  if (radius <= 5) return 14;
  if (radius <= 10) return 12;
  if (radius <= 20) return 10;
  return 8;
};

const GoogleMapComponent = ({ events, zipCode, radius }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(getZoomLevel(radius));
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c",
    libraries: ['marker']
  });

  // Flag to determine if map is reloaded
  const [isMapReady, setIsMapReady] = useState(false);

  // Set markers when events change
  useEffect(() => {
    const fetchCoordinates = async () => {
      console.log('Fetching coordinates for events:', events);
      if (events) {
        const newMarkers = await Promise.all(
          Object.keys(events).map(async (eventId) => {
            const event = events[eventId];
            const address = event.Address;
            console.log('Geocoding address:', address);
            const coordinates = await geocodeAddress(address);
            console.log('Coordinates for address:', address, coordinates);
            return {
              id: eventId,
              position: coordinates,
              title: event.Type
            };
          })
        );
        setMarkers(newMarkers);
        setLoading(false);
        console.log('Markers set:', newMarkers);
      }
    };

    fetchCoordinates();
  }, [events]);

  // Update center based on zip code
  useEffect(() => {
    const fetchCenterCoordinates = async () => {
      if (zipCode) {
        console.log('Geocoding zip code:', zipCode);
        const coordinates = await geocodeAddress(zipCode);
        setCenter(coordinates);
        console.log('Center set to coordinates:', coordinates);
      }
    };

    fetchCenterCoordinates();
  }, [zipCode]);

  // Update zoom based on radius
  useEffect(() => {
    const zoomLevel = getZoomLevel(radius);
    setZoom(zoomLevel);
    console.log('Zoom level set to:', zoomLevel);
  }, [radius]);

  const geocodeAddress = async (address) => {
    const apiKey = "AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  };

  // When map is loaded, set the flag to true
  const handleMapLoad = () => {
    setIsMapReady(true);
    console.log('Map loaded');
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c">
      {isLoaded && !loading ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={handleMapLoad} // Use onLoad event to set map as ready
        >
          {markers.map((marker) => (
            <MarkerF
              key={marker.id}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      ) : (
        !isMapReady && <div>Loading...</div> // Display loading state while the map isn't ready
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;
