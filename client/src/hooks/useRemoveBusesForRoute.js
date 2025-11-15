import * as RouteService from '../service/RouteService.js';
import * as BusService from '../service/BusService.js';
import toast from 'react-hot-toast';

const handleRemoveBus = async (index, busesChoose, setBusesChoose, data) => {
  const removedBus = busesChoose[index];
  const updated = busesChoose.filter((_, i) => i !== index);
setBusesChoose(updated);

  const payload = {
    routeNumber: data.routeNumber,
    time: data.time,
    buses: updated,
  };

  try {
    const res = await RouteService.updateRoute(payload);
    console.log(res);
    if (res?.success) {
      await BusService.updateBus({ busNumber: removedBus, routeNumber: null });
      for (const busNumber of updated) {
        await BusService.updateBus({ busNumber, routeNumber: data.routeNumber });
      }
      toast.success(`Đã xoá xe ${removedBus} khỏi tuyến!`);
    } else {
      toast.error('Cập nhật thất bại.');
    }
  } catch (err) {
    console.error(err);
    toast.error('Lỗi khi cập nhật tuyến.');
  }
};
export default handleRemoveBus ;
