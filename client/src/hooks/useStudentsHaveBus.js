import { useEffect, useState } from 'react';
import * as UserService from '../service/UserService.js';

const useStudentsHaveBus = (refreshTrigger) => {
  const [studentsHaveBus, setStudentsHaveBus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await UserService.getStudentsHaveBusAssigned();
        console.log('API response:', response);
        setStudentsHaveBus(response?.students || []); // fallback tránh undefined
      } catch (error) {
        console.error('useStudentsHaveBus error:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshTrigger]);

  return { studentsHaveBus, loading };
};

export default useStudentsHaveBus;
