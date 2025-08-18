import { io } from 'socket.io-client';

// Determine the API URL based on environment
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create the socket instance with options
const socket = io(API_URL, {
  autoConnect: true,
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

// Add event listeners for connection status
socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('WebSocket disconnected:', reason);
});

export default socket;
