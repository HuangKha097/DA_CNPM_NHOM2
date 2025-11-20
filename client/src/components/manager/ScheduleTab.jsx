import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../assets/css/manager/BusTab.module.scss';

import RouteDetail from './Schedule/RouteDetail';
import RouteList from './Schedule/RouteList.jsx';

import * as RouteController from '../../controller/RouteController.js';
import useStore from '../../zustand/store.js';

const cx = classNames.bind(styles);

const ScheduleTab = () => {
  const [isShowDetail, setIsShowDetail] = useState(false);

  const [searchValue, setSearchValue] = useState('');
  const [route, setRoute] = useState(null);
  const { routeDetail, setRouteDetail } = useStore();

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
          ...foundRoute,
        });
      } else {
        setRoute(null);
      }
    } catch (error) {
      console.error('Search route error:', error);
    }
  };
  const onClose = () => {
    setIsShowDetail((pre) => !pre);
  };
  return (
    <div className={cx('tab-wrapper', { 'detail-full-width': isShowDetail })}>
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
          <RouteList searchValue={searchValue} onClose={onClose} />
        </div>
      </div>

      {isShowDetail && (
        <div className={cx('right-block')}>
          <RouteDetail onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;
