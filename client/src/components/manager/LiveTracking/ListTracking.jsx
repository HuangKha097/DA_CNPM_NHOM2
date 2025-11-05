import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/BusList.module.scss';
import { useNavigate } from 'react-router-dom';
import useFetchBusByStatus from '../../../hooks/useFetchBusByStatus.js';
import useFetchRouteData from '../../../hooks/useFetchRouteData.js';

const cx = classNames.bind(styles);

const List = ({ setEndAddress }) => {
  const navigate = useNavigate();

  const { loading: loadingFetchBusByStatus, buses } = useFetchBusByStatus();

  const { fetchRouteNumber } = useFetchRouteData({ setEndAddress: setEndAddress });

  return (
    <table className={cx('table')}>
      <thead>
        <tr>
          <th>Bus ID</th>
          <th>Driver</th>
          <th>Routes</th>
          <th>Status</th>
        </tr>
      </thead>
      {!loadingFetchBusByStatus && (
        <>
          <tbody>
            {buses.map((item) =>
              item.routeNumber ? (
                <tr
                  key={item.busNumber}
                  onClick={() => {
                    navigate(`/tracking/${item.busNumber}`);
                    fetchRouteNumber(item?.routeNumber);
                  }}
                >
                  <td>{item.busNumber}</td>
                  <td>{item?.driver?.fullName || 'Chưa có'}</td>
                  <td>{item?.routeNumber || 'Chưa có'}</td>
                  <td>
                    <span
                      className={cx(
                        'status',
                        item.busStatus === 'Đang chạy'
                          ? 'running'
                          : item.status === 'Bảo trì'
                            ? 'maintenance'
                            : 'stopped'
                      )}
                    >
                      {item.busStatus}
                    </span>
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </>
      )}
    </table>
  );
};

export default List;
