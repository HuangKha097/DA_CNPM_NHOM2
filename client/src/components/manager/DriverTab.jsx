import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../assets/css/manager/BusTab.module.scss';
import DriverDetail from '../manager/Driver/DriverDetail';
import DriverList from '../manager/Driver/DriverList';

import * as UserController from '../../controller/UserController';
import { useStore } from '../../zustand/store.js';

const cx = classNames.bind(styles);

const DriverTab = () => {
  const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const { driverDetail, setDriverDetail } = useStore();

  const [driver, setDriver] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      getUserData();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      setDriver(null); // reset nếu input rỗng
    }
  };

  const getUserData = async () => {
    try {
      if (!searchValue.trim()) {
        setDriver(null); // clear => quay về list mặc định
        return;
      }
      const res = await UserController.getDriverData(ActiveFirstTitle, searchValue);
      console.log(res?.user);

      if (res?.success && res?.user) {
        setDriver(res?.user?.[0]);
        setDriverDetail({
          _id: res?.user?._id,
          driverNumber: res?.user?.driverInfo?.driverNumber,
          fullName: res?.user?.fullName,
          phone: res?.user?.phone,
          licenseNumber: res?.user?.driverInfo?.licenseNumber,
          licenseClass: res?.user?.driverInfo?.licenseClass,
          status: res?.user?.driverInfo?.status,
          assignedBus: res?.user?.driverInfo?.assignedBus,
        });
      } else {
        setDriver(null);
      }
    } catch (error) {
      console.error('Search driver error:', error);
    }
  };
  const onClose = () => {
    setIsShowDetail(true);
  };
  return (
    <div className={cx('tab-wrapper')}>
      <div className={cx('left-block')}>
        <label htmlFor="search" className={cx('search')}>
          <input
            type="text"
            name="search"
            placeholder="Find driver"
            value={searchValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </label>
        <div className={cx('filter-wrapper')}>
          {/* <Filter
            firstTitle={"By status"}
            ActiveFirstTitle={ActiveFirstTitle}
            setActiveFirstTitle={setActiveFirstTitle}
          /> */}
        </div>
        <div className={cx('bus-list')}>
          <DriverList driver={driver} onClose={onClose} />
        </div>
      </div>
      {isShowDetail && (
        <div className={cx('right-block')}>
          <DriverDetail/>
        </div>
      )}
    </div>
  );
};

export default DriverTab;
