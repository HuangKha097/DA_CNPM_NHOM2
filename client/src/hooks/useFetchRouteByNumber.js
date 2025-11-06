import { useEffect, useState } from 'react';
import * as RouteController from '../controller/RouteController.js';

const UseFetchRouteByNumber = ({ searchValue, routeDetail }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        let response;

        if (searchValue && searchValue.trim() !== '') {
          const res = await RouteController.fetchRouteNumber(searchValue);
          response = res ? (Array.isArray(res) ? res : [res]) : [];
        } else {
          response = await RouteController.fetchAllRoutes();
        }

        setRoutes(response || []);
      } catch (error) {
        console.error('Fetch routes error:', error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, [searchValue, routeDetail]);
  return {routes,loading};
};

export default UseFetchRouteByNumber;
