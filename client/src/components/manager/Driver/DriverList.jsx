import React from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/DriverList.module.scss';
import { ThreeDots } from 'react-loader-spinner';
import useFetchAllDrivers from '../../../hooks/useFetchAllDrivers.js';

const cx = classNames.bind(styles);

const DriverList = ({ setDriverDetail, driverDetail, driver, onClose }) => {
  const { loading: loadingFetchAllDriver, drivers } = useFetchAllDrivers(driverDetail);

  const displayDriver = driver ? [driver] : drivers;

  return (
    <div className={cx('tableWrapper')}>
      {loadingFetchAllDriver ? (
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
      ) : displayDriver.length > 0 ? (
        <table className={cx('table')}>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayDriver.map((item, index) => (
              <tr
                key={index}
                onClick={() => {
                  onClose();
                  setDriverDetail({
                    _id: item?._id,
                    driverNumber: item?.driverInfo?.driverNumber,
                    fullName: item?.fullName,
                    phone: item?.phone,
                    licenseNumber: item?.driverInfo?.licenseNumber,
                    licenseClass: item?.driverInfo?.licenseClass,
                    assignedBus: item?.driverInfo?.assignedBus?.map((bus) => bus.busNumber) || [],
                    status: item?.driverInfo?.status,
                  });
                }}
              >
                <td>{item?.driverInfo?.driverNumber}</td>
                <td>{item?.fullName}</td>
                <td>{item?.phone}</td>
                <td>
                  <span
                    className={cx(
                      'status',
                      item?.driverInfo?.status === 'Đang hoạt động'
                        ? 'active'
                        : item?.driverInfo?.status === 'Nghỉ phép'
                          ? 'leave'
                          : 'inactive'
                    )}
                  >
                    {item?.driverInfo?.status || 'Chưa cập nhật'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Không có tài xế nào trong danh sách.
        </p>
      )}
    </div>
  );
};

export default DriverList;
