

import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 42.0451, // Default latitude (e.g., Chicago)
  lng: -87.6877 // Default longitude (e.g., Chicago)
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


  useEffect(() => {
    const fetchCenterCoordinates = async () => {
      if (zipCode) {
        const coordinates = await geocodeAddress(zipCode);
        setCenter(coordinates);
      }
    };

    fetchCenterCoordinates();
  }, [zipCode]);

  useEffect(() => {
    const zoomLevel = getZoomLevel(radius);
    setZoom(zoomLevel);
  }, [radius]);

  const geocodeAddress = async (address) => {
    const apiKey = "AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c";
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&callback=Function.prototype`
    );
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAI7wOB4XNX5xCMJsuA-XqWlSlzxDRNU9c">
       {!loading && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default GoogleMapComponent;