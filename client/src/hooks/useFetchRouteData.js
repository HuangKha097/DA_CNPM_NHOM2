import { useState } from 'react';
import * as RouteService from '../service/RouteService.js';

const UseFetchRouteData = ({ setEndAddress }) => {
  const [routeCoords, setRouteCoords] = useState({ lat: null, lng: null });

  const fetchRouteNumber = async (value) => {
    try {
      const response = await RouteService.getRouteByRouteNumber(value);
      console.log(response);
      const data = response?.data;
      if (data) {
        const coords = {
          lat: data.latitude,
          lng: data.longitude,
        };
        setRouteCoords(coords);
        setEndAddress(coords);
      } else {
        console.warn('Không tìm thấy tuyến');
      }
    } catch (error) {
      console.error('Lỗi khi lấy tọa độ tuyến:', error);
    }
  };
  return { fetchRouteNumber };
};

export default UseFetchRouteData;
