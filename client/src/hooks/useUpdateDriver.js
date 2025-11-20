import { useState } from 'react';
import * as UserService from '../service/UserService.js';
import toast from 'react-hot-toast';
import { useRefreshing } from '../contexts/RefreshingContext.jsx';

const useUpdateDriver = (userId, setDriverDetail, driverUpdate, setDriverUpdate) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { refreshingDispatch } = useRefreshing()


  const handleUpdateDriver = async () => {
    try {
      refreshingDispatch({
        type:"UPDATE_DATA"
      })
      setLoading(true);
      const res = await UserService.updateDriverInfo(userId, driverUpdate);
      console.log(res);
      if (res?.success) {
        setDriverDetail(res?.data);
        setDriverUpdate(res?.data);
        toast.success('Cập nhật tài xế thành công');
        setIsEditing(false);
      } else {
        toast.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
      refreshingDispatch({
        type:"DONE_UPDATE_DATA"
      })
    }
  };

  return { isEditing, setIsEditing, loading, handleUpdateDriver };
};

export default useUpdateDriver;
