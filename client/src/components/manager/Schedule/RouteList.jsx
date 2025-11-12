import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/ScheduleList.module.scss';
import { ThreeDots } from 'react-loader-spinner';
import useFetchRouteByNumber from '../../../hooks/useFetchRouteByNumber.js';

const cx = classNames.bind(styles);

const RouteList = ({ searchValue, routeDetail, setRouteDetail, onClose }) => {
  const { routes, loading: loadingFindRoutes } = useFetchRouteByNumber({
    searchValue,
    routeDetail,
  });

  return (
    <div className={cx('tableWrapper')}>
      {loadingFindRoutes ? (
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
      ) : (
        <table className={cx('table')}>
          <thead>
            <tr>
              <th>Route ID</th>
              <th>Name</th>
              <th>Bus Number</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {routes && routes.length > 0 ? (
              routes.map((route) => (
                <tr
                  key={route._id}
                  onClick={() => {
                    onClose();
                    setRouteDetail({ ...route });
                  }}
                  className={cx('row')}
                >
                  <td>{route.routeNumber}</td>
                  <td>{route.name}</td>
                  <td>
                    {route.buses && route.buses.length > 0
                      ? route.buses.map((bus) => bus.busNumber).join(', ')
                      : 'Không có xe'}
                  </td>
                  <td>{route.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '10px' }}>
                  No routes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RouteList;
