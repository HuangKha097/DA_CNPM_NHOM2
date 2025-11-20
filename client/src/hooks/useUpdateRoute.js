import React, { useState } from 'react';
import * as RouteService from '../service/RouteService.js';
import * as BusService from '../service/BusService.js';
import toast from 'react-hot-toast';
import useStore from '../zustand/store.js';

const UseUpdateRoute = (data, busesChoose,setData, setBusesChoose) => {
  const {setRouteDetail} = useStore();
  const [loading , setLoading] = useState(false)
  const handleUpdateRoute = async () => {
    setLoading(true);
    try {
      const updatePayload = {
        routeNumber: data.routeNumber,
        time: data.time,
        buses: busesChoose,
      };

      const res = await RouteService.updateRoute(updatePayload);
      if (res?.success) {
        // cập nhật từng xe bus
        for (const busNumber of busesChoose) {
          await BusService.updateBus({ busNumber, routeNumber: data.routeNumber });
        }
        setRouteDetail(res.data);
        setData(res.data);
        setBusesChoose(res.data.buses?.map((b) => b.busNumber) || []);
        toast.success('Cập nhật tuyến xe buýt thành công!');
      } else {
        toast.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật tuyến.');
    } finally {
      setLoading(false);
    }
  };
  return {loading, handleUpdateRoute};
};

export default UseUpdateRoute;