import { useEffect, useState } from 'react';

import * as RouteService from '../service/RouteService.js';

const UseRouteName = (routeNumber) => {
  const [routeName, setRouteName] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const response = await RouteService.getRouteByRouteNumber(routeNumber);
        console.log(response);
        setRouteName(response?.data?.name || 'Không có tên tuyến');
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [routeNumber]);
  return { routeName, loading };
};

export default UseRouteName;
