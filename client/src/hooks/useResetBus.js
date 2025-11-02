import {useState} from 'react';
import * as RouteService from '../service/RouteService.js';
import * as BusService from '../service/BusService.js';
import * as UserService from '../service/UserService.js';

import toast from 'react-hot-toast';

const useResetBus = (driverId, busUpdate, setBusUpdate, busDetail, setBusDetail, setIsEditing) => {
  const [loading, setLoading] = useState(false);
  const handleReset = async () => {
    setLoading(true);
    const route = await RouteService.getRouteByRouteNumber(busDetail?.routeNumber);
    console.log(route);

    try {
      const resetData = {
        _id: busDetail._id,
        busNumber: busDetail.busNumber,
        licensePlate: busDetail.licensePlate,
        routeNumber: '',
        busStatus: 'Dừng',
        driver: null,
        students: [],
      };

      setBusUpdate(resetData);
      const res = await BusService.updateBus(resetData);

      if (res?.success) {
        if (busDetail.driver?._id) {
          await UserService.updateDriverInfo(busDetail.driver._id, {
            assignedBus: [],
          });
        }

        if (busDetail.students?.length > 0) {
          for (const student of busDetail.students) {
            await UserService.updateStudentBus(student._id, null);
          }
        }

        const busFilter = route?.data?.buses.filter((b) => String(b) !== String(busDetail._id));

        console.log('filter:', busFilter);

        if (busDetail.routeNumber) {
          const payload = {
            routeNumber: route?.data?.routeNumber,
            buses: busFilter,
          };
          await RouteService.updateRoute(payload);
        }

        setBusDetail(res.data);
        setBusUpdate(res.data);
        setIsEditing(false);
        toast.success('Reset bus về mặc định và lưu thành công ');
      } else {
        toast.error(res?.message || 'Reset thất bại ');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi reset!');
    } finally {
      setLoading(false);
    }
  };

  return { handleReset, loading };
};

export default useResetBus;
