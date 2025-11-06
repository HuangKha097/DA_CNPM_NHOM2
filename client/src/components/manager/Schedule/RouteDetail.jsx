import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleDetail.module.scss";
import * as BusController from "../../../controller/BusController";
import * as RouteController from "../../../controller/RouteController";

import toast, { Toaster } from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";
import useFetchAllBuses from '../../../hooks/useFetchAllBuses.js';

const cx = classNames.bind(styles);

const RouteDetail = ({ routeDetail, setRouteDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(routeDetail || {});
  const [busesChoose, setBusesChoose] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Khi chọn route khác
  useEffect(() => {
    setData(routeDetail || {});
    setBusesChoose(routeDetail?.buses?.map((b) => b.busNumber) || []);
  }, [routeDetail]);

  // Lấy danh sách bus
   const {buses, loading: fetchAllBusLoading} = useFetchAllBuses()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Gửi update lên server
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
        // cập nhật lại bus
        for (const busNumber of busesChoose) {
          await BusController.updateBus({
            busNumber,
            routeNumber: data.routeNumber,
          });
        }

        setRouteDetail(res.data);
        setData(res.data);
        setBusesChoose(res.data.buses?.map((b) => b.busNumber) || []);
        toast.success("Cập nhật tuyến xe buýt thành công");
      } else {
        toast.error(res?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi cập nhật");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBus = async (index) => {
    const removedBus = busesChoose[index];
    const updated = busesChoose.filter((_, i) => i !== index);
    setBusesChoose(updated);

    try {
      const updatePayload = {
        routeNumber: data.routeNumber,
        time: data.time,
        buses: updated,
      };

      const res = await RouteController.updateRoute(updatePayload);

      if (res?.success) {
        await BusController.updateBus({
          busNumber: removedBus,
          routeNumber: null,
        });

        for (const busNumber of updated) {
          await BusController.updateBus({
            busNumber,
            routeNumber: data.routeNumber,
          });
        }

        toast.success(`Đã xoá xe ${removedBus} khỏi tuyến!`);
      } else {
        toast.error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật tuyến xe");
    }
  };

  const handleSave = () => {
    handleUpdateRoute();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
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
    );
  }

  return (
    <div className={cx("ScheduleDetailWrapper")}>
      {routeDetail?._id ? (
        <>
          <h4>Route Detail</h4>
          <div className={cx("row")}>
            <span className={cx("label")}>Route ID:</span>
            <span className={cx("value")}>{data.routeNumber}</span>
          </div>
          <div className={cx("row")}>
            <span className={cx("label")}>Route Name:</span>
            <span className={cx("value")}>{data.name}</span>
          </div>
          <div className={cx("row")}>
            <span className={cx("label")}>Bus Number:</span>
            {isEditing && (
              <select
                value=""
                onChange={(e) => {
                  const selectedBus = e.target.value;
                  if (selectedBus && !busesChoose.includes(selectedBus)) {
                    setBusesChoose((prev) => [...prev, selectedBus]);
                  }
                }}
              >
                <option value="">-- Chọn xe buýt --</option>
                {buses.map((bus, index) => (
                  <option key={index} value={bus.busNumber}>
                    {bus.busNumber}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className={cx("bus-list")}>
            {busesChoose.length > 0 ? (
              busesChoose.map((bus, index) => (
                <span key={index} className={cx("buses-choose")}>
                  {bus}
                  {isEditing && (
                    <div
                      className={cx("remove")}
                      onClick={() => handleRemoveBus(index)}
                    >
                      &times;
                    </div>
                  )}
                </span>
              ))
            ) : (
              <span>Không có bus nào</span>
            )}
          </div>
          <div className={cx("row")}>
            <span className={cx("label")}>Time:</span>
            {isEditing ? (
              <input
                type="text"
                name="time"
                value={data.time || ""}
                onChange={handleChange}
                placeholder="06:30"
              />
            ) : (
              <span className={cx("value")}>{data.time}</span>
            )}
          </div>
          <div className={cx("btnGroup")}>
            {isEditing ? (
              <>
                <button
                  className={cx("cancelBtn")}
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  className={cx("saveBtn")}
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              routeDetail && (
                <button
                  className={cx("editBtn")}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              )
            )}
          </div>
        </>
      ) : (
        <p>Choose one from the list to see details.</p>
      )}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default RouteDetail;
