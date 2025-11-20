import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from '../../assets/css/common/SettingTab.module.scss';
import vieFlag from '../../assets/vietnam.svg';
import usaFlag from '../../assets/united-kingdom.svg';
import { useStore } from "../../zustand/store.js"

const cx = classNames.bind(styles);

export default function SettingsTab() {


  const { theme, setTheme } = useStore()
  const [selectedTheme, setSelectedTheme] = useState(theme);

  const [language, setLanguage] = useState('vi');

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleSave = async () => {
    setTheme(selectedTheme);
    console.log('theme', selectedTheme);
    alert('Cài đặt đã được lưu!');
  };

  return (
    <div className={cx('settingsWrapper')}>
      <h2 className={cx('title')}>Cài đặt giao diện</h2>

      <section className={cx('card')}>
        <h3 className={cx('cardTitle')}>Chế độ hiển thị</h3>
        <div className={cx('formRow')}>
          <label>Giao diện</label>
          <div className={cx('btnGroup')}>
            <button
              className={cx(
                'pill',
                selectedTheme === 'light' && 'active'
              )}

              onClick={() => setSelectedTheme('light')}
            >
              Sáng
            </button>
            <button
              className={cx(
                'pill',

                selectedTheme === 'dark' && 'active'
              )}

              onClick={() => setSelectedTheme('dark')}
            >
              Tối
            </button>
          </div>
        </div>
      </section>

      <section className={cx('card')}>
        <h3 className={cx('cardTitle')}>Ngôn ngữ</h3>
        <div className={cx('formRow')}>
          <label>Chọn ngôn ngữ</label>
          <div className={cx('select-language')}>
            <div>
              <button
                className={cx('flag', language === 'vi' && 'active')}
                onClick={() => setLanguage('vi')}
              >
                <img src={vieFlag} alt="Vietnam flag" />
                <span className={cx('flag-title')}>Vietnamese</span>
              </button>
            </div>
            <div>
              <button
                className={cx('flag', language === 'en' && 'active')}
                onClick={() => setLanguage('en')}
              >
                <img src={usaFlag} alt="US/UK flag" />
                <span className={cx('flag-title')}>English</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className={cx('actionRow')}>
        <button className={cx('saveBtn')} onClick={handleSave}>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}