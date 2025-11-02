import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/BusDetail.module.scss';

import StudentList from '../../manager/Student/StudentList.jsx';
import Filter from '../../../components/Filter.jsx';

import useDrivers from '../../../hooks/useDrivers.js';
import useRouteName from '../../../hooks/useRouteName.js';

import { ThreeDots } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';

import useStudentsHaveBus from '../../../hooks/useStudentsHaveBus.js';
import useUpdateBus from '../../../hooks/useUpdateBus.js';
import useResetBus from '../../../hooks/useResetBus.js';
import useFindStudent from '../../../hooks/useFindStudent.js';
import useOpenPopupStudent from '../../../hooks/useOpenPopupStudent.js';

const cx = classNames.bind(styles);

const BusDetail = ({ busDetail, setBusDetail }) => {
  //   Search state
  const [searchValue, setSearchValue] = useState('');

  //    [{ parent, childName }, ...]
  const [studentsSelected, setStudentsSelected] = useState([]);

  //   Others state
  const [isEditing, setIsEditing] = useState(false);
  const [busUpdate, setBusUpdate] = useState(busDetail);
  const [showListStudent, setShowListStudent] = useState(false);
  const [studentPopUp, setStudentPopUp] = useState([]);

  const { drivers } = useDrivers();
  const { routeName } = useRouteName(busDetail?.routeNumber || '');
  const { studentsHaveBus } = useStudentsHaveBus(isEditing);

  // useHooks logic
  const { handleSave, loading: loadingSave } = useUpdateBus(
    busUpdate?.driver,
    busUpdate,
    busDetail,
    setBusDetail,
    setIsEditing
  );

  const { handleReset, loading: loadingReset } = useResetBus(
    busUpdate?.driver,
    busUpdate,
    setBusUpdate,
    busDetail,
    setBusDetail,
    setIsEditing
  );

  const { handleFindStudents } = useFindStudent(
    searchValue,
    setStudentPopUp,
    studentsSelected,
    true
  );

  const { handleOpenStudentPopup } = useOpenPopupStudent(
    setStudentsSelected,
    busUpdate.students,
    setStudentPopUp,
    setSearchValue,
    setShowListStudent
  );

  // others logic
  const handleChangeBus = (e) => {
    const { name, value } = e.target;
    setBusUpdate({ ...busUpdate, [name]: value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleFindStudents(searchValue);
    }
  };
  const handleChangeStudent = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (!value.trim()) {
      setStudentPopUp([]);
    }
  };

  //  Đồng bộ prop `busDetail` vào state `busUpdate`
  useEffect(() => {
    setBusUpdate({
      ...busDetail,
      driver: busDetail.driver?._id || busDetail.driver || null,
      students: busDetail.students || [],
    });

    // Reset state khi chọn một bus khác
    setIsEditing(false);
    setShowListStudent(false);
    setStudentsSelected([]); // Reset về mảng rỗng
  }, [busDetail]);

  return (
    <div className={cx('busDetailWrapper')}>
      {busDetail?._id ? (
        <>
          {loadingSave || loadingReset ? (
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
              <h4>Bus Detail</h4>

              <div className={cx('row')}>
                <span className={cx('label')}>Bus ID:</span>
                <span className={cx('value')}>{busDetail.busNumber}</span>
              </div>
              <div className={cx('row')}>
                <span className={cx('label')}>License Plate:</span>
                <span className={cx('value')}>{busDetail.licensePlate}</span>
              </div>
              <div className={cx('row')}>
                <span className={cx('label')}>Capacity:</span>
                <span className={cx('value')}>{busDetail.capacity}</span>
              </div>

              <div className={cx('row')}>
                <span className={cx('label')}>Current Students:</span>
                {isEditing ? (
                  <>
                    {' '}
                    <button className={cx('editBtn')} onClick={handleOpenStudentPopup}>
                      Add student
                    </button>
                    {busDetail?.students?.length && (
                      <span>{busDetail?.students?.length || studentsSelected.length}</span>
                    )}
                  </>
                ) : (
                  <span className={cx('value')}> {busUpdate.students?.length || 0} students</span>
                )}
              </div>

              <div className={cx('row')}>
                <span className={cx('label')}>Driver:</span>
                {isEditing ? (
                  <select
                    type="text"
                    name="driver"
                    value={busUpdate.driver || ''}
                    onChange={handleChangeBus}
                  >
                    <option value="">{'-----Chon 1 tai xe-----'}</option>
                    {drivers.map((item, index) => (
                      <option key={index} value={item._id}>
                        {item.fullName || item.driver?.fullName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={cx('value')}>{busDetail.driver?.fullName || 'Chưa có'}</span>
                )}
              </div>
              <div className={cx('row')}>
                <span className={cx('label')}>Route:</span>
                <span className={cx('value')}>{routeName || 'Chưa có'}</span>
              </div>
              <div className={cx('row')}>
                <span className={cx('label')}>Status:</span>
                {isEditing ? (
                  <select
                    name="busStatus"
                    value={busUpdate.busStatus || ''}
                    onChange={handleChangeBus}
                  >
                    <option value="Đang chạy">Đang chạy</option>
                    <option value="Dừng">Dừng</option>
                    <option value="Bảo trì">Bảo trì</option>
                  </select>
                ) : (
                  <span className={cx('value')}>{busDetail.busStatus}</span>
                )}
              </div>

              <div className={cx('btnGroup')}>
                {isEditing ? (
                  <>
                    <button
                      className={cx('resetBtn')}
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm('Bạn có chắc muốn reset bus này không?')) {
                          handleReset();
                        }
                      }}
                    >
                      Reset
                    </button>

                    <button
                      className={cx('cancelBtn')}
                      onClick={() => {
                        setBusUpdate(busDetail);
                        setIsEditing(false);
                        setShowListStudent(false);
                      }}
                    >
                      Cancel
                    </button>
                    <button className={cx('saveBtn')} onClick={handleSave}>
                      Save
                    </button>
                  </>
                ) : (
                  <button className={cx('editBtn')} onClick={() => setIsEditing(true)}>
                    Edit
                  </button>
                )}
              </div>
              <Toaster position="top-right" reverseOrder={false} />

              {showListStudent && (
                <div className={cx('container')} onClick={() => setShowListStudent(false)}>
                  <div className={cx('student-list-pop-up')} onClick={(e) => e.stopPropagation()}>
                    <label htmlFor="search" className={cx('search')}>
                      <input
                        type="text"
                        name="search"
                        placeholder="Find student"
                        value={searchValue}
                        onChange={handleChangeStudent}
                        onKeyDown={handleKeyDown}
                      />
                    </label>
                    <div className={cx('filter-wrapper')}>
                      <Filter firstTitle={'By class'} ActiveFirstTitle={true} />
                    </div>

                    <div className={cx('list-wrapper')}>
                      <StudentList
                        studentPopUp={studentPopUp?.filter(
                          (s) => !studentsHaveBus?.some((h) => h._id === s._id)
                        )}
                        showSelectCheck={true}
                        setStudentsSelected={setStudentsSelected}
                        studentsSelected={studentsSelected}
                        studentsHaveBus={studentsHaveBus}
                      />
                    </div>
                    <div className={cx('btnGroup')}>
                      <button className={cx('cancelBtn')} onClick={() => setShowListStudent(false)}>
                        Cancel
                      </button>
                      <button
                        className={cx('saveBtn')}
                        onClick={() => {
                          const newStudents = studentsSelected.filter(
                            (s) => !busUpdate.students.some((b) => b._id === s._id)
                          );

                          const mergedStudents = [...busUpdate.students, ...newStudents];

                          if (mergedStudents.length > busDetail.capacity) {
                            toast.error(
                              `Số học sinh đã chọn vượt quá số lượng chỗ ngồi là ${busDetail.capacity}`
                            );
                            return;
                          }

                          setBusUpdate({
                            ...busUpdate,
                            students: mergedStudents,
                          });

                          setShowListStudent(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>Choose one from the list to see details.</p>
      )}
    </div>
  );
};

export default BusDetail;
