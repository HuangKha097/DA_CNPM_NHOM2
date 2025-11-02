import { useState } from 'react';
import toast from 'react-hot-toast';

import * as UserService from '../service/UserService.js';
import * as BusService from '../service/BusService.js';

const useUpdateBus = (driverId, busUpdate, busDetail, setBusDetail, setIsEditing) => {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const driver = await UserService.getUserById(driverId);
      console.log(driver?.data?.[0]);
      const currentAssignedBus = driver?.data?.[0]?.driverInfo?.assignedBus || [];
      if (driverId) {
        const activeBus = currentAssignedBus.find((bus) => bus.busStatus === 'Đang chạy');

        if (
          activeBus &&
          activeBus.busId.toString() !== busUpdate._id.toString() &&
          busUpdate.busStatus === 'Đang chạy'
        ) {
          toast.error(
            `Tài xế hiện đang điều khiển xe ${activeBus.busNumber}. Hãy dừng xe đó trước khi gán xe mới ở trạng thái "Đang chạy".`
          );
          setIsEditing(false);
          return;
        }
      }

      const res = await BusService.updateBus(busUpdate);

      if (res?.success) {
        if (driverId) {
          const isExisting = currentAssignedBus.some(
            (bus) => String(bus.busId) === String(busUpdate._id)
          );

          let updateAssignedBus;
          if (isExisting) {
            updateAssignedBus = currentAssignedBus.map((bus) =>
              String(bus.busId) === String(busUpdate._id)
                ? {
                    ...bus,
                    busNumber: busUpdate.busNumber,
                    busStatus: busUpdate.busStatus,
                    students: busUpdate.students || [],
                  }
                : bus
            );
          } else {
            updateAssignedBus = [
              ...currentAssignedBus,
              {
                busId: busUpdate._id,
                busNumber: busUpdate.busNumber,
                busStatus: busUpdate.busStatus,
                students: busUpdate.students || [],
              },
            ];
          }
          console.log(updateAssignedBus);

          await UserService.updateDriverInfo(driverId, { assignedBus: updateAssignedBus });

          if (busUpdate.students?.length > 0) {
            for (const student of busUpdate.students) {
              await UserService.updateStudentBus(student._id, busUpdate._id);
            }
          }
        }

        setBusDetail(res.data);
        setIsEditing(false);
        toast.success('Cập nhật xe bus thành công');
      } else {
        toast.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSave };
};

export default useUpdateBus;
