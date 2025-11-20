import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../assets/css/manager/BusTab.module.scss';
import BusList from '../manager/Bus/BusList';
import BusDetail from '../manager/Bus/BusDetail';
import Filter from '../Filter.jsx';

import { UseSearchBus } from '../../hooks/useSearchBus.js';
import useStore from '../../zustand/store.js';

const cx = classNames.bind(styles);

const BusTab = () => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [ActiveFirstTitle, setActiveFirstTitle] = useState(false);
  const [ActiveSecondTitle, setActiveSecondTitle] = useState(false);

  const [valueSearch, setValueSearch] = useState('');
  const [bus, setBus] = useState(null);

  const {busDetail} = useStore();
  console.log('busDetail :', busDetail);

  const handleSearchBus = async () => {
    const response = await UseSearchBus(ActiveSecondTitle, valueSearch);
    setBus(response);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchBus();
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setValueSearch(value);

    if (!value.trim()) {
      setBus(null); // reset nếu input rỗng
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
            value={valueSearch}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="text"
            name="search"
            placeholder="Find bus"
          />
          <div className={cx('filter-wrapper')}>
            <Filter
              firstTitle={'By bus number'}
              secondTitle={'By route'}
              ActiveFirstTitle={ActiveFirstTitle}
              setActiveFirstTitle={setActiveFirstTitle}
              ActiveSecondTitle={ActiveSecondTitle}
              setActiveSecondTitle={setActiveSecondTitle}
            />{' '}
          </div>
        </label>

        <div className={cx('bus-list')}>
          <BusList bus={bus} onClose={onClose} />
        </div>
      </div>
      {isShowDetail && (
        <div className={cx('right-block')}>
          <BusDetail />
        </div>
      )}
    </div>
  );
};

export default BusTab;
