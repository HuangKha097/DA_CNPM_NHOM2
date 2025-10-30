import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/DriverList.module.scss";
import * as UserController from "../../../controller/UserController";
import { ThreeDots } from "react-loader-spinner";

const cx = classNames.bind(styles);

const DriverList = ({ setDriverDetail, driverDetail, driver }) => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const drivers = await UserController.fetchUserByRole("driver");
        setDrivers(drivers || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách tài xế:", error);
      } finally {
        setIsLoading(false); // tắt loading
      }
    })();
  }, [driverDetail]);

  const displayDriver = driver ? [driver] : drivers;

  return (
    <div className={cx("tableWrapper")}>
      {isLoading ? (
        <div
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
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
        <table className={cx("table")}>
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
                onClick={() =>
                  setDriverDetail({
                    _id: item?._id,
                    driverNumber: item?.driverInfo?.driverNumber,
                    fullName: item?.fullName,
                    phone: item?.phone,
                    licenseNumber: item?.driverInfo?.licenseNumber,
                    licenseClass: item?.driverInfo?.licenseClass,
                    assignedBus:
                      item?.driverInfo?.assignedBus?.map(
                        (bus) => bus.busNumber
                      ) || [],
                    status: item?.driverInfo?.status,
                  })
                }
              >
                <td>{item?.driverInfo?.driverNumber}</td>
                <td>{item?.fullName}</td>
                <td>{item?.phone}</td>
                <td>
                  <span
                    className={cx(
                      "status",
                      item?.driverInfo?.status === "Đang hoạt động"
                        ? "active"
                        : item?.driverInfo?.status === "Nghỉ phép"
                          ? "leave"
                          : "inactive"
                    )}
                  >
                    {item?.driverInfo?.status || "Chưa cập nhật"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Không có tài xế nào trong danh sách.
        </p>
      )}
    </div>
  );
};

export default DriverList;
