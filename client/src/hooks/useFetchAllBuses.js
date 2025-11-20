import { useEffect, useReducer } from 'react';
import * as BusService from '../service/BusService.js';
import { dataReducer } from '../contexts/reducer.js';
import { useRefreshing } from '../contexts/RefreshingContext.jsx';

const useFetchAllBuses = () => {

  const [buses, busDispatch] = useReducer(dataReducer, []);
  const {refreshing} = useRefreshing()
  console.log(buses);
  useEffect(() => {
    (async () => {
      busDispatch({
        type: 'GET_DATA_REQUEST',
      });
      try {
        const response = await BusService.getAll();

        busDispatch({
          type: 'GET_DATA_SUCCESS',
          data: response?.data || [],
        });
      } catch (error) {
        busDispatch({
          type: 'GET_DATA_FAILURE',
          error: error,
        });
        console.error('Lỗi khi tải danh sách bus:', error);
      }
    })();
  }, [refreshing]);

  return { buses };
};

export default useFetchAllBuses;
