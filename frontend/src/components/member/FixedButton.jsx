import React, { useState, useEffect } from 'react';
import '/src/styles/components/member/FixedButton.css';

const FixedButtons = () => {
  const [isVisible, setIsVisible] = useState(false);

  // 스크롤 이벤트 핸들러
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // 페이지 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 부드럽게 스크롤
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed-buttons">
      {/* TOP 버튼 */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top-button ${isVisible ? 'show' : ''}`}
      >
        <span>TOP</span>
      </button>

      {/* 문의 버튼 */}
      <button className="contact-button">
        <span>문의</span>
      </button>

    </div>
  );
};

export default FixedButtons;
