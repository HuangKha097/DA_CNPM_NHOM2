import { useEffect, useReducer } from 'react';
import * as UserService from '../service/UserService.js';
import { dataReducer } from '../contexts/reducer.js';
import { useRefreshing } from '../contexts/RefreshingContext.jsx';

const UseFetchAllDrivers = () => {
  const [drivers, driversDispatch]= useReducer(dataReducer, [])
  const {refreshing} = useRefreshing()

  useEffect(() => {
    (async () => {
      try {
        driversDispatch({
          type: 'GET_DATA_REQUEST',
        })
        const response = await UserService.getUserByRole('driver');
        driversDispatch({
          type: 'GET_DATA_SUCCESS',
          data: response?.data || []
        })
      } catch (error) {
        console.error('Lỗi khi tải danh sách tài xế:', error);
        driversDispatch({
          type: 'GET_DATA_FAILURE',
          error: error
        })
      }
    })();
  }, [refreshing]);

  return { drivers  };
};

export default UseFetchAllDrivers;
