import { useEffect, useState } from 'react';
import * as UserService from '../service/UserService.js';

const UseDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const drivers = await UserService.getUserByRole('driver');
        console.log(drivers?.data);
        const active = drivers?.data.filter((d) => d?.driverInfo?.status === 'Đang hoạt động');
        setDrivers(active);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { drivers, loading };
};

export default UseDrivers;
