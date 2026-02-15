import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import { toast } from 'react-hot-toast';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
      const newSocket = io(socketUrl, {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
      });

      // Global Listeners for Admin
      if (user.role === 'admin') {
        newSocket.on('new_order', (order) => {
          const msg = `New order placed! #${order._id.slice(-6).toUpperCase()}`;
          toast.success(msg, { duration: 5000, position: 'top-right' });
          addNotification('New Order', msg);
        });

        newSocket.on('admin_order_update', (data) => {
          const msg = `Order #${data.orderId
            .slice(-6)
            .toUpperCase()} status: ${data.status.replace(/_/g, ' ')}`;
          toast.info(msg);
          addNotification('Order Update', msg);
        });
      }

      // Global Listeners for Riders
      if (user.role === 'rider') {
        newSocket.on('order_available', (order) => {
          const msg = 'New delivery available nearby!';
          toast.success(msg, { icon: '🚴' });
          addNotification('Available Delivery', msg);
        });
      }

      // Listeners for Customer (Order Updates)
      // Note: In a real app we'd join specific rooms, but for now we listen for generic updates
      // Usually customer dashboard joins an order room, but let's add a general listener
      newSocket.on('order_status_changed', (data) => {
        if (user.role === 'customer') {
          const msg = `Your order is now ${data.status.replace(/_/g, ' ')}!`;
          toast.success(msg);
          addNotification('Order Status', msg);
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
