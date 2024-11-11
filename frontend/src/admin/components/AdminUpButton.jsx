import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-[#F2115E] text-white p-3 rounded-full shadow-lg transition-opacity duration-300 ease-in-out opacity-0 hover:bg-[#e0004a] hover:opacity-100"
          style={{ opacity: isVisible ? 1 : 0 }}
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
