import React, { useState, useEffect } from 'react'; // <-- Thêm useEffect
import classNames from 'classnames/bind';
import styles from '../../assets/css/common/SettingTab.module.scss';
import { useTheme } from '../../contexts/ThemeContext'; // <-- (1) Context toàn cục
import vieFlag from '../../assets/vietnam.svg';
import usaFlag from '../../assets/united-kingdom.svg';

const cx = classNames.bind(styles);

export default function SettingsTab() {
  // 1. Lấy theme TOÀN CỤC (đã lưu) và hàm để set nó
  const { theme, setTheme } = useTheme();

  // 2. Tạo state NỘI BỘ (chỉ dùng trong component này) để lưu lựa chọn TẠM THỜI
  //    Khởi tạo giá trị bằng theme toàn cục
  const [localTheme, setLocalTheme] = useState(theme);

  // Giữ nguyên state cho ngôn ngữ (vì nó chưa nối vào context)
  const [language, setLanguage] = useState('vi');

  // 3. (Quan trọng) Nếu theme toàn cục thay đổi (ví dụ: reset),
  //    cập nhật lại state nội bộ cho đồng bộ.
  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  const handleSave = async () => {
    // 4. Khi LƯU, ta mới gọi hàm 'setTheme' để cập nhật Context toàn cục
    setTheme(localTheme);

    // (Sau này bạn cũng sẽ lưu cả ngôn ngữ ở đây)
    // Ví dụ: i18n.changeLanguage(language);

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
                // 5. Nút 'active' phải dựa trên state NỘI BỘ (localTheme)
                localTheme === 'light' && 'active'
              )}
              // 6. Khi click, chỉ thay đổi state NỘI BỘ (localTheme)
              onClick={() => setLocalTheme('light')}
            >
              Sáng
            </button>
            <button
              className={cx(
                'pill',
                // 5. Nút 'active' phải dựa trên state NỘI BỘ (localTheme)
                localTheme === 'dark' && 'active'
              )}
              // 6. Khi click, chỉ thay đổi state NỘI BỘ (localTheme)
              onClick={() => setLocalTheme('dark')}
            >
              Tối
            </button>
          </div>
        </div>
      </section>

      {/* ====== PHẦN NGÔN NGỮ ====== */}
      {/* (Phần này giữ nguyên logic vì nó đã dùng state nội bộ) */}
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