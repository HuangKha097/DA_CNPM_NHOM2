import { useEffect, useState } from 'react';
import * as BusSerVice from '../service/BusSerVice.js';

const UseFetchBusByStatus = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const response = await BusSerVice.getBusesByStatus('Đang chạy');
        setBuses(response?.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return { buses, loading };
};

export default UseFetchBusByStatus;
