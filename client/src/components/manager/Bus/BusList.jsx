import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/BusList.module.scss';
import { ThreeDots } from 'react-loader-spinner';
import useFetchAllBuses from '../../../hooks/useFetchAllBuses.js';
import useStore from '../../../zustand/store.js';

const cx = classNames.bind(styles);

const List = ({ bus, onClose }) => {
  const { busDetail, setBusDetail } = useStore();
  const { buses } = useFetchAllBuses(busDetail);
  const displayBuses = bus ? [bus] : buses?.data;

  return (
    <div className={cx('tableWrapper')}>
      {buses.loading ? (
        <div
          style={{
            background: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
          }}
        >
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="rgb(30, 41, 57)"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : displayBuses?.length > 0 ? (
        <table className={cx('table')}>
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Driver</th>
              <th>Route</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayBuses.map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  onClose();
                  setBusDetail({
                    ...item,
                  });
                }}
              >
                <td>{item.busNumber}</td>
                <td>{item?.driver?.fullName || 'Chưa có'}</td>
                <td>{item.name || item.routeNumber || 'Chưa có'}</td>
                <td>
                  <span
                    className={cx(
                      'status',
                      item.busStatus === 'Đang chạy'
                        ? 'running'
                        : item.busStatus === 'Bảo trì'
                          ? 'maintenance'
                          : 'stopped'
                    )}
                  >
                    {item.busStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Không có xe buýt nào trong danh sách.
        </p>
      )}
    </div>
  );
};

export default List;
