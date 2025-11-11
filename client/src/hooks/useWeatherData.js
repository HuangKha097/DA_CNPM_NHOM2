
import { useEffect, useState } from 'react';
import { getWeatherByCoords } from './useAPI.js';

export default function useWeatherData(routeDetail) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      if (routeDetail?.latitude && routeDetail?.longitude) {
        setLoading(true);
        const data = await getWeatherByCoords(routeDetail.latitude, routeDetail.longitude);
        setWeather(data);
        setLoading(false);
      } else {
        setWeather(null);
      }
    };

    if (routeDetail?._id) fetchWeather();
  }, [routeDetail]);

  return { weather, loading };
}
