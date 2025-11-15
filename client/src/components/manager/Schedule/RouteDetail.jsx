import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/ScheduleDetail.module.scss';
import { Toaster } from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import useFetchAllBuses from '../../../hooks/useFetchAllBuses';
import useRouteDistance from '../../../hooks/useRouteDistance';
import useWeatherData from '../../../hooks/useWeatherData';
import handleRemoveBus from '../../../hooks/useRemoveBusesForRoute.js';
import useUpdateRoute from '../../../hooks/useUpdateRoute.js';

import WeatherCard from './WeatherCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrafficLight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { caculatorTime } from '../../../hooks/useAPI.js';

const cx = classNames.bind(styles);

const RouteDetail = ({ routeDetail, setRouteDetail, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(routeDetail || {});
  const [busesChoose, setBusesChoose] = useState(routeDetail?.buses?.map((b) => b.busNumber) || []);
  const { estimatedTime, distance } = useRouteDistance(routeDetail);
  const { weather, loading: isWeatherLoading } = useWeatherData(routeDetail);
  const { buses } = useFetchAllBuses();
  const remainingBuses = buses?.filter((b) => b.routeNumber === null) || [];

  useEffect(() => {
    setData(routeDetail || {});
    setBusesChoose(routeDetail?.buses?.map((b) => b.busNumber) || []);
  }, [routeDetail]);

  const {loading: updateRouteLoading, handleUpdateRoute} = useUpdateRoute(data, busesChoose, setRouteDetail, setData, setBusesChoose);
  const handleSave = () => {
    handleUpdateRoute();
    setIsEditing(false);
  };

  if (updateRouteLoading)
    return (
      <div className={cx('loading')}>
        <ThreeDots visible height="80" width="80" color="#007bff" ariaLabel="three-dots-loading" />
      </div>
    );

  if (!routeDetail?._id) return <p>Chọn một tuyến trong danh sách để xem chi tiết.</p>;

  return (
    <div className={cx('ScheduleDetailWrapper')}>
      <div className={cx('header')}>
        <button className={cx('backBtn')} onClick={onClose}>
          &lt;
        </button>
        <h3>Route Detail</h3>
      </div>

      <div className={cx('infoCards')}>
        <WeatherCard weather={weather} loading={isWeatherLoading} />

        <div className={cx('infoCard', 'trafficCard')}>
          <FontAwesomeIcon icon={faTrafficLight} className={cx('cardBackgroundIcon')} />
          <div className={cx('cardHeader')}>
            <span className={cx('cardTitle')}>Giao thông</span>
          </div>
          <div className={cx('cardBody')}>
            <span className={cx('cardValue')}>Normal</span>
            <span className={cx('cardSubValue')}>Tình trạng ổn định</span>
          </div>
        </div>

        <div className={cx('infoCard', 'alertCard')}>
          <FontAwesomeIcon icon={faTriangleExclamation} className={cx('cardBackgroundIcon')} />
          <div className={cx('cardHeader')}>
            <span className={cx('cardTitle')}>Cảnh báo</span>
          </div>
          <div className={cx('cardBody')}>
            <span className={cx('cardValue')}>No Issues</span>
            <span className={cx('cardSubValue')}>Không có cảnh báo</span>
          </div>
        </div>
      </div>

      <div className={cx('routeInfo')}>
        <div>
          <label>Route ID</label>
          <span>{data.routeNumber}</span>
        </div>
        <div>
          <label>Route Name</label>
          <span>{data.name}</span>
        </div>
        <div>
          <label>Distance</label>
          <span>{distance ? `${(distance / 1000).toFixed(2)} km` : '--'}</span>
        </div>
        <div>
          <label> Estimated Time</label>

          <span>{caculatorTime(estimatedTime)}</span>
        </div>
      </div>

      <div className={cx('busSection')}>
        <h5>Xe buýt trong tuyến</h5>

        {isEditing && (
          <select
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (val && !busesChoose.includes(val)) setBusesChoose((prev) => [...prev, val]);
            }}
          >
            <option value="">-- Thêm xe --</option>
            {remainingBuses.map((bus, i) => (
              <option key={i} value={bus.busNumber}>
                {bus.busNumber}
              </option>
            ))}
          </select>
        )}

        <div className={cx('busList')}>
          {busesChoose.length > 0 ? (
            busesChoose.map((bus, index) => (
              <span key={index} className={cx('busChip')}>
                {bus}
                {isEditing && (
                  <div
                    className={cx('remove')}
                    onClick={() => handleRemoveBus(index, busesChoose, setBusesChoose, data)}
                  >
                    &times;
                  </div>
                )}
              </span>
            ))
          ) : (
            <span className={cx('noBus')}>Không có xe nào</span>
          )}
        </div>
      </div>

      <div className={cx('btnGroup')}>
        {isEditing ? (
          <>
            <button
              className={cx('cancelBtn')}
              onClick={() => {
                setIsEditing(false);
                setBusesChoose(routeDetail?.buses?.map((b) => b.busNumber) || []);
              }}
              disabled={updateRouteLoading}
            >
              Hủy
            </button>
            <button className={cx('saveBtn')} onClick={handleSave} disabled={updateRouteLoading}>
              {updateRouteLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </>
        ) : (
          <button className={cx('editBtn')} onClick={() => setIsEditing(true)}>
            Chỉnh sửa
          </button>
        )}
      </div>

      <Toaster position="top-right" />
    </div>
  );
};

export default RouteDetail;
