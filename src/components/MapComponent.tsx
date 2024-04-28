import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

interface Location {
    id: string;
    lat: number;
    lng: number;
}

interface MapComponentProps {
    warehouses: Location[];
    vehicles: Location[];
}

const containerStyle = {
    width: '100%',
    height: '90vh'
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
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
        >
            {warehouses.map(warehouse => (
                <Marker key={warehouse.id} position={{ lat: warehouse.lat, lng: warehouse.lng }} icon={warehouseIcon} />
            ))}
            {vehicles.map(vehicle => (
                <Marker key={vehicle.id} position={{ lat: vehicle.lat, lng: vehicle.lng }} icon={vehicleIcon} />
            ))}
        </GoogleMap>
    );
};

export default MapComponent;
