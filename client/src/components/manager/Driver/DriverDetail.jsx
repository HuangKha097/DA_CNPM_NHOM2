import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/DriverDetail.module.scss';
import { Toaster } from 'react-hot-toast';
import { ThreeDots } from 'react-loader-spinner';
import useUpdateDriver from '../../../hooks/useUpdateDriver.js';

const cx = classNames.bind(styles);

const DriverDetail = ({ driverDetail, setDriverDetail }) => {
  const [driverUpdate, setDriverUpdate] = useState(driverDetail || {});

  console.log(driverDetail._id);
  const {
    isEditing,
    setIsEditing,
    loading: loadingUpdateDriver,
    handleUpdateDriver,
  } = useUpdateDriver(driverDetail?._id, setDriverDetail, driverUpdate, setDriverUpdate);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriverUpdate((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setDriverUpdate(driverDetail || {});
  }, [driverDetail]);

  return (
    <div className={cx('driverDetailWrapper')}>
      {driverDetail?._id ? (
        loadingUpdateDriver ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 20,
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
          <>
            <h4>Driver Detail</h4>

            <div className={cx('row')}>
              <span className={cx('label')}>Driver ID:</span>
              <span className={cx('value')}>{driverUpdate.driverNumber}</span>
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>Last Update:</span>
              <span className={cx('value')}>{driverUpdate.lastUpdate}</span>
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>Name:</span>
              <span className={cx('value')}>{driverUpdate.fullName}</span>
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>Phone:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={driverUpdate.phone || ''}
                  onChange={handleChange}
                />
              ) : (
                <span className={cx('value')}>{driverUpdate.phone}</span>
              )}
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>License Number:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="licenseNumber"
                  value={driverUpdate.licenseNumber || ''}
                  onChange={handleChange}
                />
              ) : (
                <span className={cx('value')}>{driverUpdate.licenseNumber}</span>
              )}
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>License Class:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="licenseClass"
                  value={driverUpdate.licenseClass || ''}
                  onChange={handleChange}
                />
              ) : (
                <span className={cx('value')}>{driverUpdate.licenseClass}</span>
              )}
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>Status:</span>
              {isEditing ? (
                <select name="status" value={driverUpdate.status || ''} onChange={handleChange}>
                  <option value="Đang hoạt động">Đang hoạt động</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                  <option value="Tạm ngưng">Tạm ngưng</option>
                </select>
              ) : (
                <span className={cx('value')}>{driverUpdate.status}</span>
              )}
            </div>

            <div className={cx('row')}>
              <span className={cx('label')}>Assigned Bus:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="assignedBus"
                  value={driverUpdate.assignedBus || ''}
                  onChange={handleChange}
                />
              ) : (
                <span className={cx('value')}>{driverUpdate.assignedBus || ''}</span>
              )}
            </div>

            <div className={cx('btnGroup')}>
              {isEditing ? (
                <>
                  <button className={cx('cancelBtn')} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button
                    className={cx('saveBtn')}
                    onClick={handleUpdateDriver}
                    disabled={loadingUpdateDriver}
                  >
                    {loadingUpdateDriver ? (
                      <ThreeDots
                        visible={true}
                        height="20"
                        width="40"
                        color="#fff"
                        ariaLabel="saving"
                      />
                    ) : (
                      'Save'
                    )}
                  </button>
                </>
              ) : (
                <button className={cx('editBtn')} onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
            </div>
          </>
        )
      ) : (
        <p>Choose one from the list to see details.</p>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

export default DriverDetail;
