import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useDisclosure } from '@chakra-ui/react';
import MapComponent from './components/MapComponent';
import { API_BASE_URL } from './config/constants';

interface Location {
  id: string;
  lat: number;
  lng: number;
}

const App: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Location[]>([]);
  const [vehicles, setVehicles] = useState<Location[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const newSocket = new WebSocket(`ws://${API_BASE_URL}`);

    newSocket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setVehicles(prevVehicles => prevVehicles.map(vehicle =>
        vehicle.id === update.id ? { ...vehicle, lat: update.latitude, lng: update.longitude } : vehicle
      ));
    };

    newSocket.onclose = () => console.log('WebSocket disconnected');
    newSocket.onerror = (error) => console.error('WebSocket error:', error);

    axios.get(`${API_BASE_URL}/api/locations`)
      .then(response => {
        const warehouseData = response.data.data.map((loc: any) => ({
          id: loc._id,
          lat: loc.coordinates.latitude,
          lng: loc.coordinates.longitude
        }));
        setWarehouses(warehouseData);
      })
      .catch(error => console.error('Failed to fetch warehouses:', error));

    axios.get(`${API_BASE_URL}/api/vehicles`)
      .then(response => {
        const vehicleData = response.data.map((vehicle: any) => ({
          id: vehicle._id,
          lat: vehicle.currentLocation.latitude,
          lng: vehicle.currentLocation.longitude
        }));
        setVehicles(vehicleData);
      })
      .catch(error => console.error('Failed to fetch vehicles:', error));

    return () => newSocket.close();
  }, []);

  return (
    <Router>
      <div className='flex flex-col h-screen'>
        <nav className='bg-gray-800 text-white p-4 flex justify-between'>
          <div className='text-xl'>Real time Delivery Tracker</div>
          <div>
            <Link to="#" onClick={onOpen} className='p-2'>How its working</Link>
            <a href="https://github.com/yvan99/delivery_tracker_frontend" className='p-2'>Frontend Github</a>
            <a href="https://github.com/yvan99/delivery_tracker_backend" target='_blank' className='p-2'>Backend Github</a>
          </div>
        </nav>
        <main className='flex-grow container mx-auto'>
          <MapComponent
            warehouses={warehouses}
            vehicles={vehicles}
          />
        </main>
        <footer className='bg-gray-800 text-white p-4 text-center'>
          © 2024 Developed by ISHIMWE Yvan
        </footer>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>How It Works</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              The tech stack includes NODE.js, WebSockets, MongoDB, and React (Vite & TypeScript).
              The backend sends vehicle and location data to the frontend via API calls.
              WebSockets are used for real-time updates of vehicle locations within the boundaries of Kigali,
              which are then reflected on the frontend.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </Router>
  );
}

export default App;
