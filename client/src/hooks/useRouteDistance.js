import { useEffect, useState } from 'react';
import { fetchRoute } from './useAPI.js';

export default function useRouteDistance(routeDetail) {
  const [distance, setDistance] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);

  useEffect(() => {
    const fetchDistance = async () => {
      if (routeDetail?.latitude && routeDetail?.longitude) {
        const endAddress = { lat: routeDetail.latitude, lon: routeDetail.longitude };
        await fetchRoute({
          endAddress,
          setStart: () => {},
          setRoute: () => {},
          setPosition: () => {},
          setTraveledPath: () => {},
          setTime: () => {},
          setDistance,
          setEstimatedTime,
        });
      }
    };

    if (routeDetail?._id) fetchDistance();
  }, [routeDetail]);

  return {distance,estimatedTime};
}
