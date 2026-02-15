import { useQuery } from '@tanstack/react-query';
import api from '../api';

const fetchRestaurants = async ({ lat, lng, search, mode, radius }) => {
  try {
    const params = {};
    if (lat && lng) {
      params.lat = lat;
      params.lng = lng;
    }
    if (search) {
      params.search = search;
      if (mode) params.searchMode = mode;
    }
    if (radius) {
      params.radius = radius;
    }

    const response = await api.get('/restaurants', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

const useRestaurants = ({ lat, lng, search, mode, radius = 10 } = {}) => {
  return useQuery({
    queryKey: ['restaurants', lat, lng, search, mode, radius],
    queryFn: () => fetchRestaurants({ lat, lng, search, mode, radius }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Helper function to calculate realistic delivery time
const calculateDeliveryTime = (distanceKm, prepTime = 15) => {
  // Base delivery time: prep time + distance-based time + traffic buffer
  const distanceTime = distanceKm * 2; // 2 minutes per km
  const trafficBuffer = 5 + Math.random() * 10; // 5-15 minutes traffic buffer

  const totalTime = prepTime + distanceTime + trafficBuffer;
  const minTime = Math.max(15, Math.floor(totalTime * 0.9));
  const maxTime = Math.ceil(totalTime * 1.1);

  return `${minTime}-${maxTime} min`;
};

export { useRestaurants, calculateDeliveryTime };
