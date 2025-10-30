import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../../../assets/css/manager/ScheduleList.module.scss";
import * as RouteController from "../../../controller/RouteController.js";
import { ThreeDots } from "react-loader-spinner";

const cx = classNames.bind(styles);

const RouteList = ({ routeDetail, setRouteDetail }) => {
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await RouteController.fetchAllRoutes();
        setRoutes(response);
      } catch (error) {
        console.error("Fetch routes error:", error);
      } finally {
        setIsLoading(false); // Tắt loading khi xong
      }
    };

    fetchRoutes();
  }, [routeDetail]);

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
      ) : (
        <table className={cx("table")}>
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
                  onClick={() => setRouteDetail({ ...route })}
                  className={cx("row")}
                >
                  <td>{route.routeNumber}</td>
                  <td>{route.name}</td>
                  <td>
                    {route.buses && route.buses.length > 0
                      ? route.buses.map((bus) => bus.busNumber).join(", ")
                      : "Không có xe"}
                  </td>
                  <td>{route.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{ textAlign: "center", padding: "10px" }}
                >
                  No routes available
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
