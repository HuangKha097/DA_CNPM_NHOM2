import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/ScheduleDetail.module.scss';
import toast, { Toaster } from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import * as BusController from '../../../controller/BusController';
import * as RouteController from '../../../controller/RouteController';
import useFetchAllBuses from '../../../hooks/useFetchAllBuses';
import useRouteDistance from '../../../hooks/useRouteDistance';
import useWeatherData from '../../../hooks/useWeatherData';
import WeatherCard from './WeatherCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrafficLight, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { caculatorTime } from '../../../hooks/useAPI.js';

const cx = classNames.bind(styles);

const RouteDetail = ({ routeDetail, setRouteDetail, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(routeDetail || {});
  const [busesChoose, setBusesChoose] = useState(routeDetail?.buses?.map((b) => b.busNumber) || []);
  const [isLoading, setIsLoading] = useState(false);

  const {estimatedTime,distance} = useRouteDistance(routeDetail);
  const { weather, loading: isWeatherLoading } = useWeatherData(routeDetail);
  const { buses } = useFetchAllBuses();
  const remainingBuses = buses?.filter((b) => b.routeNumber === null) || [];

  useEffect(() => {
    setData(routeDetail || {});
    setBusesChoose(routeDetail?.buses?.map((b) => b.busNumber) || []);
  }, [routeDetail]);

  //HANDLE FUNCTION
  const handleUpdateRoute = async () => {
    setIsLoading(true);
    try {
      const updatePayload = {
        routeNumber: data.routeNumber,
        time: data.time,
        buses: busesChoose,
      };

      const res = await RouteController.updateRoute(updatePayload);
      if (res?.success) {
        // cập nhật từng xe bus
        for (const busNumber of busesChoose) {
          await BusController.updateBus({ busNumber, routeNumber: data.routeNumber });
        }
        setRouteDetail(res.data);
        setData(res.data);
        setBusesChoose(res.data.buses?.map((b) => b.busNumber) || []);
        toast.success('Cập nhật tuyến xe buýt thành công!');
      } else {
        toast.error(res?.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Có lỗi xảy ra khi cập nhật tuyến.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBus = async (index) => {
    const removedBus = busesChoose[index];
    const updated = busesChoose.filter((_, i) => i !== index);
    setBusesChoose(updated);

    try {
      const res = await RouteController.updateRoute({
        routeNumber: data.routeNumber,
        time: data.time,
        buses: updated,
      });

      if (res?.success) {
        await BusController.updateBus({ busNumber: removedBus, routeNumber: null });
        for (const busNumber of updated) {
          await BusController.updateBus({ busNumber, routeNumber: data.routeNumber });
        }
        toast.success(`Đã xoá xe ${removedBus} khỏi tuyến!`);
      } else {
        toast.error('Cập nhật thất bại.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi cập nhật tuyến.');
    }
  };

  const handleSave = () => {
    handleUpdateRoute();
    setIsEditing(false);
  };

  if (isLoading)
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
            busesChoose.map((bus, i) => (
              <span key={i} className={cx('busChip')}>
                {bus}
                {isEditing && (
                  <div className={cx('remove')} onClick={() => handleRemoveBus(i)}>
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
              disabled={isLoading}
            >
              Hủy
            </button>
            <button className={cx('saveBtn')} onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
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
