import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun, faQuestionCircle, faCloud, faCloudRain, faSun } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from '../../../assets/css/manager/ScheduleDetail.module.scss';

const cx = classNames.bind(styles);

const getWeatherIcon = (code) => {
  if (!code) return faQuestionCircle;
  const main = code.substring(0, 2);
  switch (main) {
    case '01': return faSun;
    case '02':
    case '03':
    case '04': return faCloud;
    case '09':
    case '10':
    case '11': return faCloudRain;
    default: return faQuestionCircle;
  }
};

export default function WeatherCard({ weather, loading }) {
  return (
    <div className={cx('infoCard', 'weatherCard')}>
      <FontAwesomeIcon icon={faCloudSun} className={cx('cardBackgroundIcon')} />
      <div className={cx('cardHeader')}>
        <span className={cx('cardTitle')}>Thời tiết</span>
      </div>
      <div className={cx('cardBody')}>
        {loading ? (
          <span className={cx('cardValue')}>Loading...</span>
        ) : weather ? (
          <>
            <div className={cx('weatherInfo')}>
              <FontAwesomeIcon icon={getWeatherIcon(weather.icon)} className={cx('weatherInfoIcon')} />
              <span>{weather.temp}°C</span>
            </div>
            <span className={cx('cardSubValue')}>{weather.description}</span>
          </>
        ) : (
          <span className={cx('cardValue')}>--</span>
        )}
      </div>
    </div>
  );
}
