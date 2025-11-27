import React from 'react';
import { useLocation } from 'react-router-dom';
import './style.css';

const FloatingBanner: React.FC = () => {
    const location = useLocation();
    if (location.pathname !== '/home') {
        return null;
  }
  return (
    <>
      {/* Banner bên trái */}
      <div className="fixed-banner banner-left">
        <a href="/khuyen-mai" target="_blank" rel="noreferrer">
          {/* Đường dẫn ảnh bắt đầu từ thư mục public */}
          <img src="/sale1.jpg" alt="Sale Left" />
        </a>
      </div>

      {/* Banner bên phải */}
      <div className="fixed-banner banner-right">
        <a href="/khuyen-mai" target="_blank" rel="noreferrer">
          <img src="/sale2.jpg" alt="Sale Right" />
        </a>
      </div>
    </>
  );
};

export default FloatingBanner;