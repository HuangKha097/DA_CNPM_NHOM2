import { useEffect, useState } from 'react';
import * as UserService from '../service/UserService.js';

const UseFetchAllDrivers = (driverDetail) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const drivers = await UserService.getUserByRole('driver');
        setDrivers(drivers?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải danh sách tài xế:', error);
      } finally {
        setLoading(false); // tắt loading
      }
    })();
  }, [driverDetail]);

  return { loading, drivers };
};

export default UseFetchAllDrivers;
