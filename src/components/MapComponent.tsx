import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';

interface Location {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  warehouses: Location[];
  vehicles: Location[];
}

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: -1.9400563928241883,
  lng: 30.06405408599509
};

const warehouseIcon = {
  url: './img/warehouse.png'
};

const vehicleIcon = {
  url: './img/suv.png'
};

const MapComponent: React.FC<MapComponentProps> = ({ warehouses, vehicles }) => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const loadDirections = async () => {
      const directionsService = new google.maps.DirectionsService();

      if (warehouses.length >= 2) {
        const origin = new google.maps.LatLng(warehouses[0].lat, warehouses[0].lng);
        const destination = new google.maps.LatLng(warehouses[1].lat, warehouses[1].lng);

        const request = {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        });
      }
    };

    loadDirections();
  }, [warehouses]); // dependencies could be adjusted as needed

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={5}
      onLoad={(map) => (mapRef.current = map)}
    >
      {warehouses.map((location, idx) => (
        <Marker key={`warehouse-${idx}`} position={location} icon={warehouseIcon} />
      ))}
      {vehicles.map((vehicle, idx) => (
        <Marker key={`vehicle-${idx}`} position={vehicle} icon={vehicleIcon} />
      ))}
      {directionsResponse && (
        <DirectionsRenderer
          directions={directionsResponse}
          options={{
            polylineOptions: {
              strokeColor: '#FF6347',
              strokeOpacity: 0.8,
              strokeWeight: 5
            }
          }}
        />
      )}
    </GoogleMap>
  );
};

export default MapComponent;
