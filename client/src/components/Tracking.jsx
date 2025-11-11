import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import classNames from 'classnames/bind';
import styles from '../assets/css/common/Tracking.module.scss';
import { caculatorTime, fetchRoute } from '../hooks/useAPI.js';

const cx = classNames.bind(styles);

// Icon xe buýt hiển thị trên bản đồ
const busIcon = L.icon({
  iconUrl: '/bus-icon-tracking.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const MapFollower = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, map.getZoom(), { duration: 1 });
  }, [position]);
  return null;
};

export default function Tracking({ endAddress }) {
  const [route, setRoute] = useState([]);
  const [position, setPosition] = useState(null);
  const [traveledPath, setTraveledPath] = useState([]);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(null);


  useEffect(() => {
    fetchRoute({
      endAddress,
      setStart,
      setRoute,
      setPosition,
      setTraveledPath,
      setTime,
    });
  }, [endAddress]);

  useEffect(() => {
    if (route.length === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < route.length) {
        setPosition(route[i]);
        setTraveledPath((prev) => [...prev, route[i]]);
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [route]);

  return (
    <div className={cx('container')}>
      {start ? (
        <MapContainer center={start} zoom={13} className={cx('map')}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <MapFollower position={position} />


          {position && (
            <Marker position={position} icon={busIcon}>
              <Popup>{caculatorTime(time)}</Popup>
            </Marker>
          )}


          {route.length > 0 && <Polyline positions={route} color="blue" />}


          {traveledPath.length > 1 && <Polyline positions={traveledPath} color="red" />}
        </MapContainer>
      ) : (
        <p>Đang tải bản đồ...</p>
      )}
    </div>
  );
}
