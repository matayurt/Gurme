import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import loadingGif from '../assets/loading.gif'; 
// Redux Actions
import { fetchSliders } from '../actions/sliderActions.js';
// COMPONENTS
import Trips from './Trips';
import UpButton from './UpButton';

const MyTrips = () => {
  const dispatch = useDispatch();
  const { sliders, loading, error } = useSelector((state) => state.sliderList);

  useEffect(() => {
    dispatch(fetchSliders()); 
  }, [dispatch]);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', right: '25px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faAngleRight} size="2x" className="text-white" />
      </div>
    );
  };

  const SamplePrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', left: '25px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faAngleLeft} size="2x" className="text-white" />
      </div>
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    appendDots: (dots) => (
      <div style={{ bottom: '10px' }}>
        <ul style={{ margin: '0px', padding: '0px' }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'inline-block',
          margin: '0 5px',
          cursor: 'pointer',
        }}
      ></div>
    ),
  };

  const tripsSliders = sliders.filter((slider) => slider.page === 'gezilerim');

  return (
    <>
      {/* Slider Bölümü */}
      <div className="relative mt-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center min-h-screen">
            <img src={loadingGif} alt="Loading..." className="w-8/12 h-8/12" />
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <Slider {...sliderSettings}>
            {tripsSliders.flatMap((slider) => slider.images).map((img, index) => (
              <div key={index} className="relative">
                {/* Breadcrumb overlay */}
                <div className="absolute top-0 left-0 w-full text-center text-white py-2">
                  <Link to="/" className="hover:underline">
                    Ana Sayfa
                  </Link>
                  {' > '}
                  <Link to="/gezilerim" className="hover:underline">
                    Geziler
                  </Link>
                </div>
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-64 sm:h-80 md:h-96 object-cover" />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Geziler Bölümü */}
      <Trips />

      {/* Yukarı Çık Butonu */}
      <UpButton />
    </>
  );
};

export default MyTrips;
