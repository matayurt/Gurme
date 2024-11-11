import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import loadingGif from '../assets/loading.gif';
// Redux Actions
import { fetchSliders } from '../actions/sliderActions.js';
// COMPONENTS
import RecommendationHomeCard from './RecommendationHomeCard';
import UpButton from './UpButton';

const RecommendationHome = () => {
  const dispatch = useDispatch();
  const { sliders, loading, error } = useSelector((state) => state.sliderList);

  useEffect(() => {
    dispatch(fetchSliders({ page: 'tavsiyelerim' }));
  }, [dispatch]);

  const SampleNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} hidden sm:block`}
        style={{ ...style, right: '15px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
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
        className={`${className} hidden sm:block`} 
        style={{ ...style, left: '15px', zIndex: 2, top: '50%', transform: 'translateY(-50%)' }}
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
      <div className="bottom-2">
        <ul className="m-0 p-0">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-2.5 h-2.5 rounded-full bg-white inline-block mx-1 cursor-pointer"></div>
    ),
  };

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
            {sliders.flatMap((slider) => slider.images).map((img, index) => (
              <div key={index} className="relative flex justify-center items-center">
                {/* Breadcrumb */}
                <div className="absolute top-0 left-0 w-full text-center text-white py-2">
                  <Link to="/" className="hover:underline">
                    Ana Sayfa
                  </Link>
                  {' > '}
                  <Link to="/recommendations" className="hover:underline">
                    Tavsiyelerim
                  </Link>
                </div>
                <img src={img} alt={`Slide ${index + 1}`} className="w-full h-[250px] sm:h-[350px] md:h-[450px] object-cover" />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Tavsiyelerim Bölümü */}
      <RecommendationHomeCard />

      {/* Yukarı Çık Butonu */}
      <UpButton />
    </>
  );
};

export default RecommendationHome;
