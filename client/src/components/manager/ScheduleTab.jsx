import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../assets/css/manager/BusTab.module.scss';

import RouteDetail from './Schedule/RouteDetail';
import RouteList from './Schedule/RouteList.jsx';

import * as RouteController from '../../controller/RouteController.js';

const cx = classNames.bind(styles);

const ScheduleTab = () => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [route, setRoute] = useState(null); // route tìm được
  const [routeDetail, setRouteDetail] = useState({
    _id: '',
    routeNumber: '',
    name: '',
    startLocation: '',
    endLocation: '',
    totalDistance: '',
    totalTime: '',
    status: '',
  });

  console.log('searchValue:', searchValue);
  console.log('routeDetail:', routeDetail);

  // Khi nhấn Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getRouteData();
    }
  };

  // Khi gõ input
  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      setRoute(null);
    }
  };

  const getRouteData = async () => {
    try {
      if (!searchValue.trim()) {
        setRoute(null); // clear => quay về list mặc định
        return;
      }

      const res = await RouteController.fetchRouteNumber(searchValue);
      console.log('fetchRouteNumber:', res);

      if (res) {
        // Nếu API trả về object, chứ không phải mảng
        const foundRoute = Array.isArray(res) ? res[0] : res;

        setRoute(foundRoute);
        setRouteDetail({
          _id: foundRoute?._id,
          routeNumber: foundRoute?.routeNumber,
          name: foundRoute?.name,
          startLocation: foundRoute?.startLocation,
          endLocation: foundRoute?.endLocation,
          totalDistance: foundRoute?.totalDistance,
          totalTime: foundRoute?.totalTime,
          status: foundRoute?.status,
        });
      } else {
        setRoute(null);
      }
    } catch (error) {
      console.error('Search route error:', error);
    }
  };
  const onClose = () => {
    setIsShowDetail(pre => !pre);
  };
  return (
    <div className={cx('tab-wrapper',{ 'detail-full-width': isShowDetail })}>
      <div className={cx('left-block')}>
        <label htmlFor="search" className={cx('search')}>
          <input
            type="text"
            name="search"
            placeholder="Find route"
            value={searchValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </label>
        <div className={cx('filter-wrapper')}></div>
        <div className={cx('bus-list')}>
          <RouteList
            searchValue={searchValue}
            routeDetail={routeDetail}
            setRouteDetail={setRouteDetail}
            onClose={onClose}
          />
        </div>
      </div>

      {isShowDetail && (
        <div className={cx('right-block')}>
          <RouteDetail routeDetail={routeDetail} setRouteDetail={setRouteDetail} onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;
