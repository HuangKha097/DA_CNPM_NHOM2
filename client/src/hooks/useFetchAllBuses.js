import { useEffect, useState } from 'react';
import * as BusService from '../service/BusService.js';

const useFetchAllBuses = (busDetail) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await BusService.getAll();
        console.log(response);
        setBuses(response?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bus:', error);
      } finally {
        setLoading(false); // tắt loading
      }
    })();
  }, [busDetail]);

  return { buses, loading };
};

export default useFetchAllBuses;
